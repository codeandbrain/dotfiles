# Orbit Production Auth and Deployment Implementation Plan

> **For agentic workers:** Native execution in this session, with verification after each slice.

**Goal:** Make Orbit ready for a hosted, no-local-token workflow where users sign in with GitHub, see repositories and organizations available to their account, and can safely perform repository actions through server-side API routes.

**Architecture:** Convert the frontend from a static Pages-only browser-token app into a Next.js full-stack app. GitHub OAuth runs through Route Handlers; the access token is encrypted into an HttpOnly cookie and never exposed to client JavaScript. Server routes proxy GitHub data and write actions, while demo mode remains available without credentials. Vercel becomes the deployment target; GitHub Pages is retained only as a non-production static fallback until the hosted app is configured.

**Tech Stack:** Next.js App Router 16, React, TypeScript, Node 22 in CI, ESLint 9 flat config, GitHub OAuth, Octokit REST, Vercel Git deployment.

**Spec:** Existing `docs/PROPOSAL.md`, `docs/ARCHITECTURE.md`, and the user's request for hosted GitHub sign-in and organization access.

## Global Constraints

- The production UI must not require a local machine, local browser token, or local backend process.
- GitHub credentials must remain server-side and be stored only in an encrypted HttpOnly cookie.
- Demo mode must continue to work without GitHub credentials.
- CI must use a supported Node version and pass lint, type checking, security audit, and build.
- Changes must be committed in logical slices and pushed to `main` only after fresh verification.
- GitHub App private keys must not be added to the repository or client bundle.
- Repository writes remain explicit and safety-first; archive actions require confirmation.

## Review Focus

- OAuth callback tampering or missing state must reject safely; covered by auth utility tests.
- Missing production environment variables must show a useful setup error instead of silently failing; covered by route/build checks and documentation.
- Private repository and organization data must be fetched through the server, never through a browser token; covered by route implementation and source audit.
- GitHub API failures and expired sessions must return actionable responses; covered by route tests and UI notice handling.
- The Vercel build must work from the monorepo root and deploy the Next app with API routes; covered by the production build and deployment configuration.

---

### Task 1: Repair CI dependency and lint configuration

**Files:**
- Modify: `frontend/package.json`, root `package.json`
- Create: `frontend/eslint.config.mjs`
- Modify: `.github/workflows/ci.yml`, `.github/workflows/deploy-pages.yml`
- Update: `package-lock.json`

- [ ] Upgrade frontend ESLint to the version required by `eslint-config-next@16.4.3` and switch to the supported flat config entry point.
- [ ] Remove the deprecated `--ext` lint flag and add an explicit frontend typecheck command.
- [ ] Keep Node 22 in CI and use the same `npm ci`, lint, typecheck, audit, and build sequence locally and remotely.
- [ ] Run `npm ci`, lint, typecheck, and build; commit as `fix: align eslint with next 16`.

### Task 2: Add tested server-side GitHub OAuth session utilities

**Files:**
- Create: `frontend/lib/server/github-session.ts`
- Create: `frontend/lib/server/github-api.ts`
- Create: `frontend/lib/server/github-session.test.ts`
- Modify: `frontend/package.json`, root `package.json`
- Update: `package-lock.json`

- [ ] Add a small tested session module using Web Crypto AES-GCM with `SESSION_SECRET`, expiry, and timing-safe state handling.
- [ ] Add GitHub OAuth authorization URL, code exchange, current-user, repository, and organization API helpers.
- [ ] Add tests for round-trip encryption, tampered payload rejection, expiry rejection, and OAuth state generation/verification.
- [ ] Run the focused tests red first, implement the minimum behavior, then run the focused and full test suites; commit as `feat: add encrypted github oauth sessions`.

### Task 3: Add Next.js OAuth and GitHub proxy routes

**Files:**
- Create: `frontend/app/api/auth/github/route.ts`
- Create: `frontend/app/api/auth/callback/route.ts`
- Create: `frontend/app/api/auth/session/route.ts`
- Create: `frontend/app/api/auth/logout/route.ts`
- Create: `frontend/app/api/repositories/archive/route.ts`
- Create: `frontend/.env.example`
- Modify: `.gitignore`, root `.env.example`

- [ ] Implement OAuth start/callback/logout and session routes with secure cookie settings for hosted HTTPS and a local development fallback.
- [ ] Fetch live account, repositories, and organizations on the server; include a normalized response for the existing dashboard.
- [ ] Implement server-side archive requests using the session token and reject unauthenticated or malformed requests.
- [ ] Run typecheck/build and route-level tests; commit as `feat: add hosted github oauth routes`.

### Task 4: Replace browser-token UI with hosted sign-in

**Files:**
- Modify: `frontend/app/page.tsx`, `frontend/lib/github.ts`, `frontend/app/globals.css`, `frontend/app/layout.tsx`
- Create: `frontend/lib/github-client.test.ts`

- [ ] Remove the token input and direct browser calls to `api.github.com`.
- [ ] Add `Sign in with GitHub`, session loading, logout, expired-session, and connection error states.
- [ ] Preserve demo mode, repository filters, CSV export, copy links, organization views, and confirmed archive action through the new server route.
- [ ] Add accessible labels, live status messaging, keyboard-visible focus, and reduced-motion support for the new auth controls.
- [ ] Run tests, lint, typecheck, and build; commit as `feat: replace browser tokens with github sign in`.

### Task 5: Make hosted deployment the production path

**Files:**
- Create: `vercel.json`, `frontend/public/manus-routes.json`, `SECURITY.md`
- Modify: `README.md`, `docs/ARCHITECTURE.md`, `docs/GITHUB_APP_ONBOARDING.md`, `.github/workflows/deploy-pages.yml`

- [ ] Configure Vercel to build the frontend workspace with Next API routes and document required `GITHUB_OAUTH_CLIENT_ID`, `GITHUB_OAUTH_CLIENT_SECRET`, `SESSION_SECRET`, and `NEXT_PUBLIC_APP_URL` variables.
- [ ] Update documentation to describe GitHub OAuth App callback URL, organization authorization requirements, Vercel deployment, and the security model.
- [ ] Keep GitHub Pages workflow as an explicit demo/static fallback and prevent it from being described as the production deployment.
- [ ] Run the production build and inspect generated routes; commit as `docs: document hosted github deployment`.

### Task 6: Integrate, deploy, and clean repository state

**Files:**
- No source changes expected beyond fixes found during verification.

- [ ] Run the complete local quality gate under Node 22: `npm ci`, `npm test`, `npm run lint`, `npm run typecheck`, `npm audit --audit-level=high`, and `npm run build`.
- [ ] Push the verified feature branch, confirm GitHub Actions success, merge or fast-forward the verified changes to `main`, and push `main`.
- [ ] Create/link the Vercel project to `codeandbrain/dotfiles`, configure the frontend root and non-secret build settings, and verify the deployment build.
- [ ] Close obsolete Dependabot PRs after the dependency fixes are on `main`; delete their stale branches only after confirming they are no longer needed.
- [ ] Report any remaining user-only setup step: creating/configuring the GitHub OAuth App and adding its secret values in Vercel, if no existing OAuth credentials are available.
