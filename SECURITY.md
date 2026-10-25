# Security

Orbit is designed for hosted use. Users sign in with GitHub OAuth; they do not paste a personal access token into the browser. The OAuth access token is held only by the server inside an encrypted, `HttpOnly`, `SameSite=Lax` session cookie. Client-side JavaScript never receives the token.

The OAuth app requests `read:user`, `user:email`, `read:org`, and `repo` because Orbit lists private repositories and organizations and can archive repositories after an explicit confirmation. GitHub organization policies may require an administrator to approve the OAuth application before private organization data becomes available.

The archive action is intentionally routed through the server and requires an authenticated session. Orbit does not merge pull requests or change default branches. Keep `GITHUB_OAUTH_CLIENT_SECRET` and `SESSION_SECRET` in Vercel environment variables only; never commit `.env` files, OAuth secrets, or GitHub App private keys.

To report a security issue, open a private report through the repository owner's GitHub security contact rather than publishing credentials or exploit details in a public issue.
