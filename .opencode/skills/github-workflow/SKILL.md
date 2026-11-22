---
name: GitHub workflow
description: Use for branches, commits, pull requests, Dependabot, or GitHub Actions in the Orbit repository.
---

# GitHub workflow

Owner: `codeandbrain`. Repository: `https://github.com/codeandbrain/dotfiles` (note the plural). Contact: `code.and.brain@gmail.com`.

## Rules

1. Never push to GitHub without an explicit yes from Ariful.
2. Create a branch for any change larger than a typo. Suggested prefix: `refactor/`, `fix/`, `feat/`, `docs/`.
3. Commit in logical slices with short, clear messages such as `docs: rewrite setup guide`.
4. Never rewrite published history or force-push.
5. Keep secrets out of commits. If a secret was ever committed, say so plainly and rotate it.
6. CI runs lint, typecheck, tests, critical audit, and build on every pull request and push to `main`. Do not weaken it.

## Explaining GitHub to a non-coder

| Term | Plain words |
| --- | --- |
| Branch | A separate copy of the project so experiments cannot break the live version |
| Commit | A labelled saved step you can return to |
| Pull request | A request to merge your saved steps into the main version |
| CI | Automatic checks that run every time something changes |
| Dependabot | A robot that opens small requests to update packages |

## Before any push

- Run the `quality-gates` skill.
- Show the exact branch name and what will be pushed.
- Wait for a clear yes.
