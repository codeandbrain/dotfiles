import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

export async function createDotfilePullRequest({
  owner,
  repo,
  branchName,
  filePath,
  title,
  body,
  fileContents,
}: {
  owner: string;
  repo: string;
  branchName: string;
  filePath: string;
  title: string;
  body: string;
  fileContents: string;
}) {
  const appId = Number(process.env.GITHUB_APP_ID);
  const installationId = Number(process.env.GITHUB_APP_INSTALLATION_ID);
  const privateKey = (process.env.GITHUB_APP_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  if (!appId || !installationId || !privateKey) {
    throw new Error(
      'Missing GitHub App configuration. Set GITHUB_APP_ID, GITHUB_APP_INSTALLATION_ID, and GITHUB_APP_PRIVATE_KEY in the environment.'
    );
  }

  const appAuth = createAppAuth({
    appId,
    privateKey,
    installationId,
    clientId: process.env.GITHUB_APP_CLIENT_ID,
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  });

  const installationAuthentication = await appAuth({ type: 'installation' });
  const octokit = new Octokit({ auth: installationAuthentication.token });

  const repository = await octokit.rest.repos.get({ owner, repo });
  const baseBranch = repository.data.default_branch;

  const baseBranchData = await octokit.rest.repos.getBranch({
    owner,
    repo,
    branch: baseBranch,
  });

  const sha = baseBranchData.data.commit.sha;

  try {
    await octokit.rest.git.getRef({
      owner,
      repo,
      ref: `heads/${branchName}`,
    });
  } catch {
    await octokit.rest.git.createRef({
      owner,
      repo,
      ref: `refs/heads/${branchName}`,
      sha,
    });
  }

  const content = Buffer.from(fileContents, 'utf8').toString('base64');

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: filePath,
    message: title,
    content,
    branch: branchName,
  });

  const pullRequest = await octokit.rest.pulls.create({
    owner,
    repo,
    title,
    head: branchName,
    base: baseBranch,
    body,
  });

  return pullRequest.data;
}
