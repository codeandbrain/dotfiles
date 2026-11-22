---
name: quality-gates
description: Use before reporting any task as finished, or when running /check in the Orbit project.
---

# Quality gates

Working folder for every command: the project root (the folder containing `AGENTS.md`)

## Required sequence

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=critical --omit=dev
```

`npm run check` runs lint, typecheck, tests, and build in one command. Use it for a quick pass; still run the audit step separately before saying "done".

## What each step means

| Step | Catches |
| --- | --- |
| `npm ci` | Missing or mismatched installed packages |
| lint | Code style and obvious mistakes |
| typecheck | Wrong types or misspelled names |
| tests | Broken filters, CSV export, paging links, session encryption |
| build | Problems that only appear when producing the final site |
| audit | Known security problems in shipped packages |

## Rules

- Run every step. Never skip a failing step by saying it is unrelated.
- Paste the full error when something fails.
- Fix the smallest cause, then rerun the whole sequence.
- `npm audit` moderate findings are tracked by Dependabot; critical findings block release.
- After all steps pass, give a one-screen hand-off note. Never push to GitHub without an explicit yes.
