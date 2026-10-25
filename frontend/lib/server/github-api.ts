import 'server-only';

import type { Account, Organization, Repository } from '../github';

const githubHeaders = {
  Accept: 'application/vnd.github+json',
  'X-GitHub-Api-Version': '2022-11-28',
};

function requireOAuthConfig() {
  const clientId = process.env.GITHUB_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GITHUB_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error('GitHub OAuth is not configured on this deployment');
  return { clientId, clientSecret };
}

async function githubRequest<T>(path: string, accessToken: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: { ...githubHeaders, Authorization: `Bearer ${accessToken}`, ...init?.headers },
    cache: 'no-store',
  });
  if (!response.ok) {
    const message = response.headers.get('x-ratelimit-remaining') === '0' ? 'GitHub rate limit reached' : `GitHub returned ${response.status}`;
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export function getGitHubAuthorizationUrl(state: string, origin: string) {
  const { clientId } = requireOAuthConfig();
  const redirectUri = `${origin}/api/auth/callback`;
  const params = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, state, scope: 'read:user user:email repo read:org' });
  return `https://github.com/login/oauth/authorize?${params}`;
}

export async function exchangeGitHubCode(code: string, origin: string) {
  const { clientId, clientSecret } = requireOAuthConfig();
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, redirect_uri: `${origin}/api/auth/callback` }),
    cache: 'no-store',
  });
  const data = (await response.json()) as { access_token?: string; error_description?: string };
  if (!response.ok || !data.access_token) throw new Error(data.error_description || 'GitHub OAuth code exchange failed');
  return data.access_token;
}

export async function loadGitHubWorkspace(accessToken: string) {
  const [account, repositories, organizations] = await Promise.all([
    githubRequest<Account>('/user', accessToken),
    githubRequest<Repository[]>('/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member', accessToken),
    githubRequest<Organization[]>('/user/orgs?per_page=100', accessToken),
  ]);
  return { account, repositories, organizations, demo: false };
}

export async function archiveGitHubRepository(accessToken: string, owner: string, repo: string) {
  return githubRequest<Repository>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, accessToken, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ archived: true }),
  });
}
