

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
