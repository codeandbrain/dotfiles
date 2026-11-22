# AGENTS.md — Orbit project rules

This file is read by OpenCode at the start of every session in this repository. It is the single source of truth for how work is done here. Follow it exactly.

## 1. Who I am working with

- Ariful (`codeandbrain`) is the owner and **sole builder**. There is no development team and no budget.
- He is an expert in public health and program design, and a beginner with code, terminals, Git, and Markdown.
- Assume zero prior technical knowledge for every new task. Never assume a colleague will review the work.

## 2. How to communicate

- Plain language first. Explain technical terms in brackets the first time they appear.
- Give **exact, copy-paste-ready commands**, one at a time, and state the working folder before each command.
- Prefer clicking in an app over typing a command. Use the terminal only when there is no GUI path.
- Do not say "just", "simply", or "obviously". Never make him feel that asking is a problem.
- Use short sections, tables for three or more options, and **What / Why / When / How** when explaining a choice.
- If evidence is needed, inspect files or use web search. Do not ask him for facts you can find yourself.
- For design decisions, use the Decision Grill style in `docs/USER_PERSONA.md`: ask all open questions in one round, worded so "Yes" accepts the recommendation, then stop and wait.

## 3. Hard limits

- **Zero cost.** Never suggest a paid tool, a trial, an expiring free tier, or a service requiring a card.
- **Zero secrets in the repository.** Never write tokens, passwords, private keys, or filled-in `.env` files. Only placeholder examples are allowed.
- **No push without permission.** Creating a branch and committing locally is fine. `git push` always requires an explicit "yes".
- **One product.** Orbit is the only product here. Do not reintroduce the old backend, GitHub App, Manus files, static-site publishing, Copilot setup, or legacy prototype screens.
- **OpenCode is the only AI developer.** Do not add another coding assistant or AI co-author setting.

## 4. Project shape

- `START-HERE.md` is the human front door. Keep it accurate and short.
- `README.md` is the project overview. `docs/` holds the product brief, architecture, and sign-in setup.
- The app lives entirely in `frontend/`. There is no backend workspace.
- `frontend/.env.example` is the only secret-sample file.
- Vercel is the only hosting target. The sign-in routes need a server; static export is not supported.

## 5. How to work

1. Say what you are about to change, in one plain sentence.
2. Make the smallest change that solves the problem.
3. Verify with the quality-gates skill before reporting success.
4. Report what changed, what you checked, and what he should click or type next.
5. Commit in logical slices with clear messages. Never amend or rewrite history without asking.

Always load the relevant skill before starting a task:

| Situation | Skill |
| --- | --- |
| Learning or changing the project layout | `orbit-project` |
| Explaining something or writing user-facing text | `no-coder-handoff` |
| Before saying "done" | `quality-gates` |
| Branch, commit, PR, or GitHub automation | `github-workflow` |

## 6. Safety in the app itself

- Keep GitHub tokens server-side and inside the encrypted, `HttpOnly` session cookie.
- Keep the OAuth state check in place.
- Never show fake live data. Sample data is allowed only in clearly labelled demo mode.
- Write actions require confirmation; demo mode stays read-only.
- Keep the interface usable offline: no external fonts, scripts, or trackers.
