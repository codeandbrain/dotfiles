# dotfile — GUI-first dotfile manager

A browser-based, no-code GUI for composing, previewing, and applying dotfiles across a user's account and multiple organizations' repositories.

What
- A visual dotfile composer: drag-and-drop snippets and templates (zshrc, gitconfig, VS Code settings, etc.).
- Preview and diff, then apply changes as branches + PRs to one or many repos.

Why
- Makes dotfile management accessible to non-developers and program teams.
- Safe-by-default: create pull requests rather than direct commits; provide dry-run and per-repo previews.
- Supports multi-organization workflows via a GitHub App installation.

When (MVP criteria)
- Visual composer with snippet library and preview
- Repo selection and dry-run
- Create branch, commit, and open PR per target repo
- Audit log and job history

How (quick orientation)
1. GUI-first: primary interaction will be the web app (no CLI required).
2. GitHub integration: use a GitHub App (recommended) to operate across organizations. Personal repo support can use the App or user OAuth for their account.
3. Local dev (CLI fallback — copy-paste commands):
   - Working directory: ~/projects/dotfile
   - Commands (run one at a time):
     1) cd ~/projects && git clone https://github.com/codeandbrain/dotfile.git
     2) cd ~/projects/dotfile
     3) # install node deps (Node 18+ required)
     4) npm install
     5) npm run dev --workspace frontend

Repository layout (recommended)
- frontend/    — SvelteKit or Next.js app (visual composer, preview)
- backend/     — Node + Fastify (GitHub App auth, job runner API)
- templates/   — snippet & profile templates (JSON)
- docs/        — architecture and runbooks
- .github/     — CI workflows and GitHub App manifest (infra/manifest.yaml)

Next actions I can take (pick one):
A. Create README + ARCHITECTURE.md and scaffold directories (I already created README and architecture doc).  
B. Generate scaffolding code: frontend (SvelteKit) + backend (TypeScript, Fastify) and sample PR endpoint.  
C. Draft a GitHub App manifest and installation instructions.  
D. Create prioritized issue list + milestones in this repo.

Which option do you want me to do now? If B, tell me TypeScript or JavaScript; I'll scaffold files and push them into the repo.
