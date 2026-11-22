# Orbit — GitHub workspace manager

Orbit is a free, browser-based workspace for managing a GitHub account and its organizations. It opens in a safe **demo mode** with sample data, and connects to a real GitHub account with a secure, server-side sign-in.

Live site: <https://orbit-peach-alpha-31.vercel.app>

> New here? Read [START-HERE.md](START-HERE.md). It explains how to find your project folder, which commands to run, and where to click.

## What you can do

- See an overview of repositories, organizations, followers, and workspace health
- Search and filter repositories by name, organization, language, visibility, and archived status
- Select several repositories at once, export a CSV, or copy their links
- Review organization cards and access information in demo mode
- Export a sample activity log as a CSV
- Sign in with GitHub to load your live account, repositories, and organizations
- Archive selected repositories after a clear confirmation (live accounts only)

## Run it locally

Working folder: the project root — the folder containing this `README.md`. Open a terminal in that folder, then run:

```bash
npm ci
```

```bash
npm run dev
```

Open <http://localhost:3000>. Demo mode needs no credentials.

## Configuration

No secret is needed for demo mode. For local sign-in, copy [frontend/.env.example](frontend/.env.example) to `frontend/.env.local` and fill in the four values described in [docs/OAUTH-SETUP.md](docs/OAUTH-SETUP.md). The `.env.local` file is ignored by Git. In production the same values live only in Vercel environment variables.

## Check the project

```bash
npm run check
```

This runs linting, type checks, tests, and the production build. The same checks run automatically on GitHub through [.github/workflows/ci.yml](.github/workflows/ci.yml), plus a security audit. Dependencies are updated weekly by Dependabot.

## Hosting

Orbit is one hosted Next.js application on Vercel, with `frontend` as the project root. The sign-in routes must run on a server, so a purely static site is not supported. Pushing to `main` publishes a new production deployment automatically. See [docs/OAUTH-SETUP.md](docs/OAUTH-SETUP.md) for the exact GitHub sign-in settings and custom-domain notes.

## Project map

| Path | Purpose |
| --- | --- |
| `START-HERE.md` | Plain-language entry point, machine-independent |
| `AGENTS.md` | Working rules for the AI developer, following the open AGENTS.md format |
| `frontend/app/` | Screens and server routes |
| `frontend/lib/` | Helpers and their tests |
| `docs/` | Product, architecture, sign-in, and optional-tools guides |
| `.opencode/` | OpenCode agents, commands, and spec-compliant skills |

## Contributing

Orbit has one maintainer. Read [AGENTS.md](AGENTS.md) before changing anything, run the `quality-gates` checks, and commit in small, clearly named steps. Documentation should use plain language, be machine-independent, and follow the open `AGENTS.md` and `SKILL.md` formats. [docs/SETUP-CHECKLIST.md](docs/SETUP-CHECKLIST.md) lists optional free tools; none is installed automatically.

## Security and contact

See [SECURITY.md](SECURITY.md). Problems or security concerns: `code.and.brain@gmail.com`. Please do not post secrets in public issues.
