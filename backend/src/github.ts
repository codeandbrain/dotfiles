import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

async function getAppOctokit() {
  const appId = Number(process.env.GITHUB_APP_ID);
  const privateKey = (process.env.GITHUB_APP_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  if (!appId || !privateKey) {
    throw new Error('Missing GitHub App configuration. Set GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY in the environment.');
  }

  const appAuth = createAppAuth({
    appId,
    privateKey,
    clientId: process.env.GITHUB_APP_CLIENT_ID,
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  });

  const appAuthentication = await appAuth({ type: 'app' });
  return new Octokit({ auth: appAuthentication.token });
}

async function getInstallationIdForRepo(owner: string, repo: string) {
  const octokitApp = await getAppOctokit();

  try {
    const install = await octokitApp.rest.apps.getRepoInstallation({ owner, repo });
    return install.data.id;
  } catch (err: any) {
    // If not installed, GitHub returns a 404. Surface a clear error.
    if (err && err.status === 404) {
      throw new Error(`GitHub App is not installed on repository ${owner}/${repo}. Install the app and grant access to the target repository.`);
    }
    throw err;
  }
}

async function getOctokitForRepo(owner: string, repo: string) {
  const appId = Number(process.env.GITHUB_APP_ID);
  const privateKey = (process.env.GITHUB_APP_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  const installationId = await getInstallationIdForRepo(owner, repo);

  const appAuth = createAppAuth({
    appId,
    privateKey,
    clientId: process.env.GITHUB_APP_CLIENT_ID,
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  });

  const installationAuthentication = await appAuth({ type: 'installation', installationId: Number(installationId) });
  return new Octokit({ auth: installationAuthentication.token });
}

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
  // Get an Octokit instance authenticated as the installation for this repo
  const octokit = await getOctokitForRepo(owner, repo);

  // Fetch repository to determine default branch
  const repository = await octokit.rest.repos.get({ owner, repo });
  const baseBranch = repository.data.default_branch;

  // Get the latest commit SHA of the base branch
  const baseBranchData = await octokit.rest.repos.getBranch({ owner, repo, branch: baseBranch });
  const sha = baseBranchData.data.commit.sha;

  // Create branch if it doesn't exist
  try {
    await octokit.rest.git.getRef({ owner, repo, ref: `heads/${branchName}` });
  } catch {
    await octokit.rest.git.createRef({ owner, repo, ref: `refs/heads/${branchName}`, sha });
  }

  const content = Buffer.from(fileContents, 'utf8').toString('base64');

  await octokit.rest.repos.createOrUpdateFileContents({ owner, repo, path: filePath, message: title, content, branch: branchName });

  const pullRequest = await octokit.rest.pulls.create({ owner, repo, title, head: branchName, base: baseBranch, body });

  return pullRequest.data;
}
