# dotfile

A browser-first, no-code GUI for composing, previewing, and applying dotfiles to a user's account and multiple GitHub organization repositories.

## What this repo contains

This repository is set up as a TypeScript MVP scaffold for:

- a Next.js frontend for a visual dotfile composer
- a Fastify backend for GitHub App authentication and GitHub API calls
- a sample workflow to create a branch, update a file, and open a pull request in a target repository

## Quick start

### 1) Install dependencies

```bash
npm install
```

### 2) Run the frontend

```bash
npm run dev
```

Open http://localhost:3000

### 3) Run the backend

```bash
npm run dev:backend
```

The backend listens on http://localhost:4000

## Environment setup

Copy the sample environment file and fill in the values:

```bash
cp .env.example .env
```

Then set the values for the GitHub App fields before using real GitHub API calls.

## Repository structure

```text
.
├── backend/
│   ├── src/
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   └── ARCHITECTURE.md
├── frontend/
│   ├── app/
│   ├── package.json
│   ├── tsconfig.json
│   └── next.config.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Default workflow

1. Open the frontend composer.
2. Write or choose a dotfile profile.
3. Select the target owner/repo.
4. Submit the request.
5. The backend creates a branch, writes the file, and opens a pull request.

## Notes

This is a scaffold and prototype. It intentionally favors a safe-by-default model:

- create PRs instead of direct pushes
- preview before apply
- support multi-organization workflows via GitHub App installations

## Next steps

- add real repo selection UI for user + org installations
- add dry-run diff previews
- add multi-repo batch targeting
- add audit logs and templates
