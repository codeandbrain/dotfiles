# Dotfile Composer

Dotfile Composer is an early web-app prototype for preparing a settings file and proposing it to a GitHub repository.

It is designed for people who would rather use a visual form than work directly with Git. The intended flow is to edit a sample Git configuration, preview it, and ask the app to create a branch and pull request. A pull request is a proposed change for you to review; it does not change the repository's main branch by itself.

> **Current status:** This is an early local prototype, not a finished no-code product. The source includes an editor and preview, and the backend contains code for a single-repository pull request. The checked-in frontend currently imports a missing stylesheet, so the page may fail to start. Even after that is fixed, browser-to-backend access is not enabled for cross-origin requests, so submitting from the page may be blocked. Do not rely on the full GitHub flow until both issues are fixed and tested. There is no sign-in, repository picker, ready-made profile library, visual block editor, multi-repository apply, or change-history screen.

## What the prototype is designed to do

- Edit the sample `.gitconfig` content in a browser and see a live preview.
- Enter a GitHub account or organization, repository, destination file path, branch name, and pull request title.
- The backend contains a GitHub App workflow for one repository, but browser submission is not yet working end to end (see the current-status note above).
- Review the requested change on GitHub before deciding whether to merge it, once end-to-end submission is working.

When the page can be started, editing and previewing do not require GitHub setup. A real pull request would also require GitHub App setup, repository access, a working browser-to-backend connection, and internet access to GitHub.

## What you need

- A computer with Node.js 20 or newer and npm.
- This project folder saved on your computer.
- A GitHub account. To create a real pull request, you also need permission to install a GitHub App on the target account or organization.

The project and its local development tools are free to use. Installing packages and contacting GitHub require an internet connection.

## Try the local preview

The steps below start the development server if the project files and dependencies are in working order. If you see a `globals.css` error, the project needs a code fix before the page can open.

### 1. Open the project

In Visual Studio Code, choose **File → Open Folder…** and open the project folder. The examples below use:

`/home/ariful/projects/dotfile`

If you saved the project elsewhere, use your actual folder path in place of that path.

### 2. Install the project tools

In Visual Studio Code, choose **Terminal → New Terminal**. In that terminal, run:

```bash
cd /home/ariful/projects/dotfile
```

Then run:

```bash
npm install
```

This downloads the tools needed to run the project. You normally do this once, and again only after project dependencies change.

### 3. Start the web page

In the terminal at `/home/ariful/projects/dotfile`, run:

```bash
npm run dev
```

Keep this terminal open. In your browser, open <http://localhost:3000>.

### 4. Try the composer

Edit the fields and the dotfile text in the left panel. The preview on the right updates as you type. You can use this local preview without setting up a GitHub App.

## GitHub App setup (for a future end-to-end test)

The steps below prepare a GitHub App, but they do not fix the current browser-to-backend connection. Complete them only if you are preparing for a future end-to-end test. Use a test repository and do not merge any pull request without reviewing it.

1. In GitHub, create and install an App using the GUI-first instructions in [docs/GITHUB_APP_ONBOARDING.md](./docs/GITHUB_APP_ONBOARDING.md).
2. Grant access to a test repository first. The current workflow needs repository **Contents: Read and write** and **Pull requests: Read and write** access.
3. Create a private `.env` file in the project root by opening `.env.example` in Visual Studio Code and using **File → Save As…**. Save the copy as `.env` in the project root. Do not rename or edit the original `.env.example`.
4. In `.env`, add the GitHub App ID and private key from the GitHub App settings. Keep the private key private. The `.env` file is excluded from Git so it should not be uploaded to GitHub.
5. Start the backend in a second Visual Studio Code terminal:

   Working directory: `/home/ariful/projects/dotfile`

   ```bash
   cd /home/ariful/projects/dotfile
   ```

   Then run:

   ```bash
   npm run dev:backend
   ```

6. Keep both terminals open. Do not submit a real change yet: the current frontend-to-backend connection may be blocked by the browser.
7. After the missing stylesheet and browser connection issues are fixed and tested, try the flow using only the test repository. Review any pull request on GitHub; the app does not merge it for you.

The sample GitHub App manifest at [infra/manifest.yml](./infra/manifest.yml) contains placeholder URLs and asks for some permissions that the current composer does not use. Review its requested permissions before creating an App; grant only what your use case needs. Webhook and sign-in flows are not implemented in this prototype, so the placeholder webhook and callback URLs are not working services.

If you need to look up an App installation ID, see [infra/README_INSTALLATIONS.md](./infra/README_INSTALLATIONS.md). The current create-pull-request endpoint finds the installation by the target account/repository; you do not need to fill in `GITHUB_APP_INSTALLATION_ID` for that flow.

## Where to find things

| File or folder | What it is for |
| --- | --- |
| [frontend/app/page.tsx](./frontend/app/page.tsx) | The composer page: fields, editor, preview, and submit button. |
| [frontend/app/layout.tsx](./frontend/app/layout.tsx) | The browser page title and shared page setup. |
| [frontend/package.json](./frontend/package.json) | Frontend tools and commands. |
| [frontend/tsconfig.json](./frontend/tsconfig.json) | Frontend TypeScript settings. |
| [frontend/next.config.js](./frontend/next.config.js) | Frontend framework settings. |
| [backend/src/index.ts](./backend/src/index.ts) | Backend web service, health check, and request validation. |
| [backend/src/github.ts](./backend/src/github.ts) | GitHub App authentication and branch/file/pull-request actions. |
| [backend/src/cache.ts](./backend/src/cache.ts) | Backend cache helper. |
| [backend/package.json](./backend/package.json) | Backend tools and commands. |
| [backend/tsconfig.json](./backend/tsconfig.json) | Backend TypeScript settings. |
| [.env.example](./.env.example) | Safe-to-share example of the local settings file; it contains no real credentials. |
| [.gitignore](./.gitignore) | Files Git should keep out of the repository, including `.env` and downloaded tools. |
| [.vscode/settings.json](./.vscode/settings.json) | Optional Visual Studio Code workspace preferences. |
| [infra/manifest.yml](./infra/manifest.yml) | Starting configuration for creating a GitHub App; includes placeholder URLs and permissions to review. |
| [infra/README_INSTALLATIONS.md](./infra/README_INSTALLATIONS.md) | How to find a GitHub App installation ID. |
| [infra/get_installations.mjs](./infra/get_installations.mjs) | Helper that lists the GitHub App's installations. |
| [docs/USER_PERSONA.md](./docs/USER_PERSONA.md) | The intended user needs and documentation preferences for this project. |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | A plain-language description of how the current prototype is put together. |
| [docs/GITHUB_APP_ONBOARDING.md](./docs/GITHUB_APP_ONBOARDING.md) | GUI-first GitHub App setup instructions. |
| [docs/PROPOSAL.md](./docs/PROPOSAL.md) | Product ideas and possible future features; these are not all implemented. |
| [package.json](./package.json) | Top-level commands for starting and building the project. |
| [index.html](./index.html) | An older, standalone sign-in-page mockup. It is not connected to the current composer and does not provide real sign-in. |

## Common commands

Run these commands in a terminal whose working directory is `/home/ariful/projects/dotfile`.

| Command | What it does |
| --- | --- |
| `npm install` | Downloads project tools. |
| `npm run dev` | Starts the frontend website. |
| `npm run dev:backend` | Starts the backend service. Run it in a second terminal. |
| `npm run build` | Attempts to build the frontend and backend; errors appear in the terminal. |

There is not yet a working lint command for both workspaces.

## Keep credentials safe

- Never paste the GitHub App private key into the browser or the frontend code.
- Keep real credentials in `.env` on your own computer. Do not put them in `.env.example`.
- Before sharing a screenshot or log, check that it does not show private keys or other credentials.
- Start with a test repository and review the pull request before merging.

## Current limitations and future ideas

This prototype does not yet provide a sign-in page, automatic repository list, selectable templates, dry-run change comparison, batch updates, undo workflow, audit history, webhook handling, or the cross-origin browser connection needed to submit to the backend. Ideas for future work are collected in [docs/PROPOSAL.md](./docs/PROPOSAL.md).

For a question or issue, include what you clicked, what you expected to happen, and what appeared instead. Do not include private keys, passwords, or tokens.
