---
description: Run the full quality gate and report the result
agent: orbit-dev
---

Load the `quality-gates` skill, then run the complete check from `/home/ariful/projects/dotfiles`:

1. `npm run lint`
2. `npm run typecheck`
3. `npm test`
4. `npm run build`
5. `npm audit --audit-level=critical --omit=dev`

Report each step as passed or failed. If a step fails, paste the full error and propose the smallest fix before making it. Do not push anything.
