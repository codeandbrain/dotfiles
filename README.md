

## Orbit GitHub workspace manager

The browser app now opens as **Orbit**, a free-first GitHub account and organization workspace manager. It works immediately in demo mode without an account, paid service, database, or API key.

### Included screens

- Overview dashboard with repository, organization, follower, activity, and workspace-health cards
- Searchable repositories view with public/private filters
- Organization cards and access/team review
- Activity log and CSV-export placeholder
- Settings view with browser-only fine-grained GitHub token connection
- Responsive layout for desktop, tablet, and mobile widths

### Run it locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. Use **Settings → Connect GitHub** to load live data. The token is sent directly from the browser to GitHub and is not stored by the backend. For the safest setup, create a fine-grained token with only read access to repository metadata, repositories, and organizations. Selecting **Use demo mode** clears the token field and returns to local sample data.

The original prototype files remain available as `frontend/app/page.legacy.tsx`, `frontend/app/globals.legacy.css`, and `frontend/app/layout.legacy.tsx`.


## CI/CD and publishing

GitHub Actions now provides:

- `.github/workflows/ci.yml`: lint, TypeScript checks, critical-only audit gate, and production build on pull requests and pushes to `main`.
- `.github/workflows/deploy-pages.yml`: free static deployment of the browser app to GitHub Pages after a `main` push.
- `.github/dependabot.yml`: weekly npm updates and monthly GitHub Actions updates.

Enable **Settings → Pages → Source: GitHub Actions** once in the repository settings. After the first successful `main` deployment, GitHub will show the live Pages URL in the workflow environment.

## Repository operations

The Repositories screen now supports:

- Multi-select across the current filtered result set
- Organization chips for multi-organization filtering
- Language, sort, search, visibility, and archived filters
- CSV export of selected repositories
- Copying selected repository links
- Confirmed batch archive for live connected workspaces; demo mode remains read-only
