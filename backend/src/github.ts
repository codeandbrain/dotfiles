import { Octokit } from '@octokit/rest';
import { createAppAuth } from '@octokit/auth-app';

type TokenCacheEntry = { token: string; expiresAt: number };

const tokenCache = new Map<number, TokenCacheEntry>(); // installationId -> token
const ownerInstallationCache = new Map<string, number>(); // owner -> installationId

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

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

/**
 * Get installation id for a specific repository. Throws if app not installed on the repo.
 */
export async function getInstallationIdForRepo(owner: string, repo: string): Promise<number> {
  const appOctokit = await getAppOctokit();

  try {
    const install = await appOctokit.rest.apps.getRepoInstallation({ owner, repo });
    // cache owner -> installation
    if (install && install.data && install.data.account && install.data.id) {
      ownerInstallationCache.set(install.data.account.login.toLowerCase(), install.data.id);
    }
    return install.data.id;
  } catch (err: any) {
    if (err && err.status === 404) {
      throw new Error(`GitHub App is not installed on repository ${owner}/${repo}. Install the app and grant access to the target repository.`);
    }
    throw err;
  }
}

/**
 * Find installation id by owner (org or user). Uses cached value if available.
 */
export async function getInstallationIdForOwner(owner: string): Promise<number> {
  const key = owner.toLowerCase();
  if (ownerInstallationCache.has(key)) return ownerInstallationCache.get(key)!;

  const appOctokit = await getAppOctokit();
  let page = 1;

  while (true) {
    const res = await appOctokit.rest.apps.listInstallations({ per_page: 100, page });
    if (!res.data || res.data.length === 0) break;
    const match = res.data.find((it) => it.account && it.account.login && it.account.login.toLowerCase() === key);
    if (match) {
      ownerInstallationCache.set(key, match.id);
      return match.id;
    }
    page += 1;
  }

  throw new Error(`No installation found for owner/org: ${owner}`);
}

/**
 * Create (or return cached) installation token for installationId.
 */
async function getInstallationToken(installationId: number): Promise<string> {
  const cache = tokenCache.get(installationId);
  if (cache && cache.expiresAt - 30 > nowSec()) {
    return cache.token;
  }

  const appId = Number(process.env.GITHUB_APP_ID);
  const privateKey = (process.env.GITHUB_APP_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  const appAuth = createAppAuth({
    appId,
    privateKey,
    clientId: process.env.GITHUB_APP_CLIENT_ID,
    clientSecret: process.env.GITHUB_APP_CLIENT_SECRET,
  });

  const auth = await appAuth({ type: 'installation', installationId: Number(installationId) });

  if (!auth.token || !auth.expiresAt) {
    throw new Error('Failed to obtain installation token');
  }

  const expiresAtSec = Math.floor(new Date(auth.expiresAt).getTime() / 1000);
  tokenCache.set(installationId, { token: auth.token, expiresAt: expiresAtSec });
  return auth.token;
}

/**
 * Return an Octokit authenticated for the installation that has access to owner/repo.
 */
export async function getOctokitForTarget({ owner, repo }: { owner: string; repo?: string }): Promise<Octokit> {
  let installationId: number;
  if (repo) {
    installationId = await getInstallationIdForRepo(owner, repo);
  } else {
    installationId = await getInstallationIdForOwner(owner);
  }

  const token = await getInstallationToken(installationId);
  return new Octokit({ auth: token });
}

/**
 * Invalidate caches for a given installation id and/or owner
 */
export function invalidateInstallationCache(installationId?: number, owner?: string) {
  if (installationId !== undefined) {
    tokenCache.delete(installationId);
  }
  if (owner) {
    ownerInstallationCache.delete(owner.toLowerCase());
  }
}

/**
 * Create branch + file update + PR using installation-scoped Octokit.
 */
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
  const octokit = await getOctokitForTarget({ owner, repo });

  const repository = await octokit.rest.repos.get({ owner, repo });
  const baseBranch = repository.data.default_branch;

  const baseBranchData = await octokit.rest.repos.getBranch({ owner, repo, branch: baseBranch });
  const sha = baseBranchData.data.commit.sha;

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
