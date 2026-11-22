# How Orbit is built

## In one paragraph

Orbit is a single Next.js website. The visible dashboard runs in your browser; the sign-in and GitHub operations run on the server in small "route handlers". That split is the key safety idea: secret values and your GitHub token stay on the server, while the browser only receives the information needed to draw the screen.

## The parts

| Part | Where | What it does |
| --- | --- | --- |
| Dashboard screen | `frontend/app/page.tsx` | Draws the overview, repository, organization, access, activity, and settings screens. Uses sample data until sign-in succeeds. |
| Page shell and styles | `frontend/app/layout.tsx`, `frontend/app/globals.css` | Sets the page title and all styling. Fonts are local, so the app works offline. |
| Sign-in routes | `frontend/app/api/auth/*` | Start sign-in, receive GitHub's callback, report the session, and sign out. |
| Archive route | `frontend/app/api/repositories/archive/route.ts` | Archives one repository after checking the session and the request. |
| Server helpers | `frontend/lib/server/github-api.ts`, `github-session.ts` | Talk to GitHub, encrypt/decrypt the session cookie, and check the sign-in "state". |
| Browser helpers | `frontend/lib/github.ts`, `workspace.ts`, `pagination.ts` | Data shapes, sample data, filters, CSV export, and page-limit handling. |
| Tests | `frontend/lib/**/*.test.ts` | Check filters, archiving, page links, and session encryption. |
| Automation | `.github/workflows/ci.yml`, `.github/dependabot.yml` | Run checks on every change and keep dependencies current. |

## What happens when you sign in

1. On the Settings screen you choose **Sign in with GitHub**.
2. `api/auth/github` creates a random one-time "state" value, stores it in a short-lived cookie, and sends you to GitHub.
3. GitHub sends you back to `api/auth/callback` with a code and the same state.
4. The server compares the state with the cookie. If they do not match, sign-in is rejected.
5. The server exchanges the code for an access token, encrypts it into an `HttpOnly` session cookie, and returns you to the dashboard.
6. `api/auth/session` uses that cookie to load your account, up to 1,000 repositories, and up to 1,000 organizations from GitHub. If there is more data, the app says so instead of silently hiding it.
7. **Sign out** deletes the session cookie and returns to demo mode.

## Safety notes

- The state check prevents an attacker from starting a sign-in in your name.
- The session cookie is encrypted with `SESSION_SECRET` and expires after seven days.
- Passwords and tokens are never typed into Orbit; GitHub handles identity.
- The "next page" link from GitHub is accepted only if it points to `https://api.github.com`, so the token is never sent to another address.
- Archiving is a `PATCH` request made by the server, one repository at a time, with failures reported honestly.

## What Orbit does **not** do

- It does not read your GitHub activity or organization members/teams — those screens explain this clearly instead of showing fake live data.
- It does not create branches, commits, or pull requests.
- It does not merge changes or alter default branches.
- It does not store your GitHub data in a database; each page load fetches it again from GitHub.
