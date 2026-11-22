# Orbit sign-in setup — completed

Orbit works in demo mode without any setup. This page records the live GitHub sign-in setup so it can be checked or repeated later.

## Your live settings

| Item | Exact value |
| --- | --- |
| GitHub account | `codeandbrain` |
| Repository | `codeandbrain/dotfiles` |
| Vercel team | `codeandbrain` |
| Vercel project | `orbit` |
| Website (Homepage URL) | `https://orbit-peach-alpha-31.vercel.app` |
| Callback URL | `https://orbit-peach-alpha-31.vercel.app/api/auth/callback` |
| Production branch | `main` |

The short name `orbit.vercel.app` was already taken, so Vercel assigned the stable address above.

## What is connected

| Setting | Where it lives | Status |
| --- | --- | --- |
| Vercel project → GitHub repository | Vercel Git integration | Connected ✓ |
| `NEXT_PUBLIC_APP_URL` | Vercel environment variable (Production, Preview, Development) | Done ✓ |
| `SESSION_SECRET` | Vercel Secret environment variable | Done ✓ — private, never shown |
| `GITHUB_OAUTH_CLIENT_ID` | Vercel Secret environment variable | Done ✓ |
| `GITHUB_OAUTH_CLIENT_SECRET` | Vercel Secret environment variable | Done ✓ — private, never shown |
| Root directory | `frontend` | Done ✓ |
| Framework | Next.js | Done ✓ |
| Build command | `npm run build` | Done ✓ |
| Install command | `npm install` | Done ✓ |
| Node.js version | `22.x` | Done ✓ |

No secret value is stored in this repository. A push to `main` creates a new production deployment through Vercel's free GitHub integration.

## How the pieces fit

1. Vercel gave Orbit the website address above.
2. A free GitHub OAuth App was registered with that address as its homepage, and the `/api/auth/callback` address as its callback.
3. GitHub returned a Client ID and Client Secret; both were added only in Vercel's environment settings.
4. A private Session Secret encrypts the small sign-in cookie (an `HttpOnly` cookie that remembers you are signed in).
5. When someone signs in, GitHub sends them back to the callback address with a one-time code. The server checks it and returns them to the dashboard with their real repositories.

## How to check sign-in

1. Open <https://orbit-peach-alpha-31.vercel.app>.
2. Click **Settings** in the left menu.
3. Click **Sign in with GitHub**.
4. Approve the permissions GitHub shows.
5. The dashboard returns with a **Connected** badge and your real repositories.

If it fails, the page shows a plain message such as *"GitHub sign-in could not be verified. Please try again."* Copy that message to OpenCode with `/fix`.

## If the OAuth App ever needs to be recreated

Register a new one at <https://github.com/settings/applications/new> with:

| Field | Value |
| --- | --- |
| Application name | `Orbit` |
| Homepage URL | `https://orbit-peach-alpha-31.vercel.app` |
| Application description | `Orbit - a friendly GitHub workspace manager` |
| Authorization callback URL | `https://orbit-peach-alpha-31.vercel.app/api/auth/callback` |
| Enable Device Flow | unchecked |
| Expire user access tokens | checked |

Then replace the two GitHub values in Vercel → Settings → Environment Variables and redeploy. Do not paste the secret into chat or into a project file.

## Custom domain (optional, only if you already own one)

Vercel can attach a domain you already own at no cost. Buying a new domain is not part of this zero-cost setup, and the short `orbit.vercel.app` is already allocated to someone else, so the address above stays as it is.

If you later add a domain you own, update three places together, then redeploy:

| Place | New value |
| --- | --- |
| GitHub OAuth App Homepage URL | `https://your-domain.example` |
| GitHub OAuth App Authorization callback URL | `https://your-domain.example/api/auth/callback` |
| Vercel environment variable `NEXT_PUBLIC_APP_URL` | `https://your-domain.example` |

---

## Common questions

**Can I use a personal access token?** No. Tokens never enter the browser in Orbit.

**Why can I not see private organization repositories?** An organization owner must first approve the OAuth App under that organization's **Applications** settings.

**Why does the app say some repositories are missing?** GitHub is read in pages of 100, up to 1,000 items. If there is more data, Orbit says so instead of pretending the list is complete.
