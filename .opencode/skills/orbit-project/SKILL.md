---
name: orbit-project
description: Use when learning or changing the Orbit repository layout, naming, or where a change belongs.
---

# Orbit project map

Orbit is one hosted Next.js app. There is no backend, no GitHub App, and no static-site publishing path.

## Directory contract

| Path | Contains |
| --- | --- |
| `START-HERE.md` | The human front door: three commands, where to click |
| `README.md` | Short project overview and links |
| `AGENTS.md` | Working rules for the AI developer |
| `opencode.jsonc` | OpenCode model, agent, and permissions |
| `.opencode/` | Agents, commands, and skills (single source of truth) |
| `frontend/app/` | Screens plus server routes under `app/api/` |
| `frontend/lib/` | Pure helpers and their `.test.ts` files |
| `frontend/lib/server/` | Server-only GitHub and session code |
| `docs/` | Product brief, architecture, sign-in setup, user persona |

## Rules

- The only secret-sample file is `frontend/.env.example`. Root `.env.example` was removed.
- Vercel root directory is `frontend`. Do not restore `GITHUB_PAGES` static export.
- `npm` is the only package manager. `pnpm-lock.yaml` was removed.
- ESLint uses the flat config `frontend/eslint.config.mjs` only. `.eslintrc.json` was removed.
- The dashboard is `frontend/app/page.tsx`; if it grows, split components into new files under `frontend/app/components/` rather than adding more long lines.
- Never add runtime downloads of fonts, scripts, or trackers.

## Removed on purpose

Do not recreate: `backend/`, `infra/`, root `index.html`, `*.legacy.*` files, `manus-routes.json`, `docs/superpowers/`, the Copilot setup workflow, `.vscode/settings.json`, or the old GitHub App documents. Git history holds them if ever needed.
