// Pure helpers for following GitHub's paginated API responses.
// No dependencies, no server-only imports, so they can be unit-tested directly.

export const GITHUB_API_ORIGIN = 'https://api.github.com';

// 10 pages x 100 items = at most 1,000 items per list. Beyond this Orbit reports truncation.
export const MAX_PAGES = 10;

/**
 * Reads the `rel="next"` URL out of a GitHub `Link` header.
 *
 * The URL is returned only if it stays on https://api.github.com, because the caller sends
 * the user's access token to whatever this returns. Anything else yields null.
 */
export function parseNextLink(linkHeader: string | null): string | null {
  if (!linkHeader) return null;
  // Do not split on commas: GitHub URLs contain commas (e.g. affiliation=owner,collaborator).
  const entry = /<([^>]*)>\s*;\s*rel="([^"]*)"/g;
  let match: RegExpExecArray | null;
  while ((match = entry.exec(linkHeader)) !== null) {
    if (!match[2].split(/\s+/).includes('next')) continue;
    try {
      const url = new URL(match[1]);
      return url.origin === GITHUB_API_ORIGIN ? url.toString() : null;
    } catch {
      return null;
    }
  }
  return null;
}
