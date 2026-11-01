import 'server-only';

import type { Account, Organization, Repository } from '../github';
import { GITHUB_API_ORIGIN, MAX_PAGES, parseNextLink } from '../pagination';

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

async function githubFetch(url: string, accessToken: string, init?: RequestInit): Promise<Response> {
  const response = await fetch(url, {
    ...init,
    headers: { ...githubHeaders, Authorization: `Bearer ${accessToken}`, ...init?.headers },
    cache: 'no-store',
  });
  if (!response.ok) {
    const message = response.headers.get('x-ratelimit-remaining') === '0' ? 'GitHub rate limit reached' : `GitHub returned ${response.status}`;
    throw new Error(message);
  }
  return response;
}

async function githubRequest<T>(path: string, accessToken: string, init?: RequestInit): Promise<T> {
  const response = await githubFetch(`${GITHUB_API_ORIGIN}${path}`, accessToken, init);
  return response.json() as Promise<T>;
}

// Follows GitHub's Link: rel="next" headers, up to MAX_PAGES pages, and reports whether
// more data existed than was loaded.
async function githubRequestAll<T>(path: string, accessToken: string): Promise<{ items: T[]; truncated: boolean }> {
  const items: T[] = [];
  let url: string | null = `${GITHUB_API_ORIGIN}${path}`;
  let pages = 0;
  while (url) {
    if (pages >= MAX_PAGES) return { items, truncated: true };
    const response = await githubFetch(url, accessToken);
    items.push(...((await response.json()) as T[]));
    url = parseNextLink(response.headers.get('link'));
    pages += 1;
  }
  return { items, truncated: false };
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
    githubRequestAll<Repository>('/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator,organization_member', accessToken),
    githubRequestAll<Organization>('/user/orgs?per_page=100', accessToken),
  ]);
  return {
    account,
    repositories: repositories.items,
    organizations: organizations.items,
    truncated: repositories.truncated || organizations.truncated,
    demo: false,
  };
}

export async function archiveGitHubRepository(accessToken: string, owner: string, repo: string) {
  return githubRequest<Repository>(`/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, accessToken, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ archived: true }),
  });
}
