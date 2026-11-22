# Security

Orbit is designed for hosted use. People sign in with GitHub OAuth; they never paste a personal access token into the browser. After sign-in, the GitHub access token is kept only on the server inside an encrypted, `HttpOnly`, `SameSite=Lax` session cookie. Browser JavaScript never receives the token.

The sign-in app requests `read:user`, `user:email`, `read:org`, and `repo` because Orbit lists private repositories and organizations and can archive repositories after an explicit confirmation. If an organization requires OAuth approval, an organization owner must approve the app before private organization data can be listed.

## Safety rules for this repository

- `GITHUB_OAUTH_CLIENT_SECRET` and `SESSION_SECRET` belong in Vercel environment variables or a local, ignored `.env.local` file — never in this repository.
- `.env` and `.env.*` files are ignored by Git. `frontend/.env.example` contains placeholders only.
- The archive action is sent through a server route, requires an active session, and needs a confirmation in the interface.
- Orbit does not merge pull requests, change default branches, or write to repositories other than the archive action described above.
- Dependencies are checked by `npm audit` in CI and updated by Dependabot.

## Report a problem

Email `code.and.brain@gmail.com` privately. Please do not publish credentials, tokens, or exploit details in a public issue.
