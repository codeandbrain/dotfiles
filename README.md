# Orbit — GitHub workspace manager

Orbit is a free, browser-based workspace for managing a GitHub account and its organizations. It opens in a safe **demo mode** with sample data, and can connect to your real GitHub account with a secure, server-side sign-in.

> New here? Read [START-HERE.md](START-HERE.md). It has the exact three commands and where to click.

## What you can do

- See an overview of repositories, organizations, followers, and workspace health
- Search and filter repositories by name, organization, language, visibility, and archived status
- Select several repositories at once, export a CSV, or copy their links
- Review organization cards and access information in demo mode
- Export a sample activity log as a CSV
- Sign in with GitHub to load your live account, repositories, and organizations
- Archive selected repositories after a clear confirmation (live accounts only)

## Run it locally

Working folder: `/home/ariful/projects/dotfiles`

```bash
npm ci
npm run dev
```

Open <http://localhost:3000>. Demo mode needs no credentials. To connect GitHub, copy [frontend/.env.example](frontend/.env.example) to `frontend/.env.local`, fill in the values, and follow [docs/OAUTH-SETUP.md](docs/OAUTH-SETUP.md).

## Check the project

```bash
npm run check
```

This runs linting, type checks, tests, and the production build. The same checks run automatically on GitHub through [.github/workflows/ci.yml](.github/workflows/ci.yml), plus a security audit. Dependencies are updated weekly by Dependabot.

## Hosting

Orbit is one hosted Next.js application on Vercel, with `frontend` as the project root. The live site is <https://orbit-peach-alpha-31.vercel.app>. The sign-in routes must run on a server, so a purely static site is not supported. See [docs/OAUTH-SETUP.md](docs/OAUTH-SETUP.md) for the exact GitHub sign-in settings.

## Project map

| Path | Purpose |
| --- | --- |
| `START-HERE.md` | Plain-language entry point |
| `AGENTS.md` | Working rules for the AI developer (OpenCode) |
| `frontend/app/` | Screens and server routes |
| `frontend/lib/` | Small helpers and their tests |
| `docs/` | Product, architecture, and setup guides |
| `.opencode/` | OpenCode agents, commands, and skills |

## Contact

Problems or security concerns: `code.and.brain@gmail.com`. Please do not post secrets in public issues.
