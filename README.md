

## Orbit GitHub workspace manager

The browser app now opens as **Orbit**, a hosted GitHub account and organization workspace manager. It works immediately in demo mode without an account, and production mode uses server-side GitHub OAuth.

### Included screens

- Overview dashboard with repository, organization, follower, activity, and workspace-health cards
- Searchable repositories view with public/private filters
- Organization cards and access/team review
- Activity log with downloadable CSV export
- Settings view with hosted GitHub OAuth sign-in and secure session handling
- Responsive layout for desktop, tablet, and mobile widths

### Hosted use (recommended)

Orbit is designed to run as a hosted Next.js app on Vercel. Users choose **Sign in with GitHub**, and Orbit loads their personal repositories and authorized organizations through server-side GitHub OAuth. No personal access token is pasted into the browser, and repository write actions are sent through authenticated server routes.

Create a GitHub OAuth App with callback URL `https://YOUR-VERCEL-DOMAIN/api/auth/callback`. Add `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `SESSION_SECRET`, and `NEXT_PUBLIC_APP_URL` to the Vercel project environment. If an organization requires OAuth approval, an organization owner must approve the app before private organization data can be listed.

Configure the Vercel project with `frontend` as its Root Directory, `npm run build` as its build command, and `npm install` as its install command. The frontend workspace contains both the dashboard and the server-side API routes.

### Run the demo locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Demo mode works without credentials. To test OAuth locally, copy `frontend/.env.example` to `frontend/.env.local`, set the values, and register `http://localhost:3000/api/auth/callback` as the OAuth callback URL. Selecting **Use demo mode** returns to local sample data.

The original prototype files remain available as `frontend/app/page.legacy.tsx`, `frontend/app/globals.legacy.css`, and `frontend/app/layout.legacy.tsx`.


## CI/CD and publishing

GitHub Actions provides:

- `.github/workflows/ci.yml`: lint, TypeScript checks, moderate-severity audit gate, and production build on pull requests and pushes to `main`.
- `.github/dependabot.yml`: weekly npm updates and monthly GitHub Actions updates.

Production hosting is Vercel because OAuth and repository operations require server-side route handlers. GitHub Pages is not used for the production app.

## Repository operations

The Repositories screen now supports:

- Multi-select across the current filtered result set
- Organization chips for multi-organization filtering
- Language, sort, search, visibility, and archived filters
- CSV export of selected repositories
- Public-only and private-only repository views
- Copying selected repository links
- Confirmed batch archive for live connected workspaces; demo mode remains read-only
