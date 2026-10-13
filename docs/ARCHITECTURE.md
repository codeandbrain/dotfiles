# How Dotfile Composer works

## What it is

Dotfile Composer is an early web-app prototype. It has a page for editing one text file and previewing its contents. If the GitHub App is configured, the page can send that file to the backend, which asks GitHub to create a branch and pull request in one repository.

## Why changes use pull requests

A pull request is a proposed change. It gives the repository owner a chance to review the file on GitHub before deciding whether to merge it. The app does not directly change the repository's main branch or merge the pull request.

## Intended request flow

1. The user edits the destination details and dotfile content in the browser.
2. The browser checks that required fields are filled in and shows a live preview.
3. When submitted, the browser sends the details to the backend service.
4. The backend checks the required values and uses the server-side GitHub App credentials.
5. The backend finds the GitHub App installation that can access the named repository.
6. GitHub receives a request to create or use a branch, write the file, and open a pull request.
7. The browser displays the pull request link or an error message.

This end-to-end flow is not currently ready to use. The backend does not yet allow the browser's cross-origin request, so submitting from the page may be blocked.

## Main parts

| Part | What it does |
| --- | --- |
| Frontend (`frontend/app/`) | Displays the editor, preview, destination fields, and result message. |
| Backend (`backend/src/index.ts`) | Receives the browser request, checks required fields, and returns a result. |
| GitHub integration (`backend/src/github.ts`) | Uses the GitHub App to find repository access and create the branch, file update, and pull request. |
| GitHub App manifest (`infra/manifest.yml`) | Provides a starting point for registering a GitHub App. Its placeholder URLs and permissions must be reviewed before use. |
| Local environment file (`.env`) | Holds the private GitHub App credentials on the developer's computer. It must not be shared or committed. |

There is also a cache helper in `backend/src/cache.ts` that supports Redis or in-memory storage. The current GitHub PR integration keeps its own in-memory caches; the helper is not connected to that workflow yet.

## What is not part of the current prototype

The current app does not include:

- browser permission to connect to the backend from the frontend's different local port
- user sign-in or account management
- a page that lists repositories or installations for selection
- a library of profiles, templates, or visual building blocks
- multi-repository or batch updates
- a preview of the exact GitHub diff before submission
- webhook processing, scheduled updates, or a job-history screen
- a database for users, profiles, or audit records

These are possible future features, not available functions. See [PROPOSAL.md](./PROPOSAL.md) for product ideas.

## Security and access

- Keep `GITHUB_APP_PRIVATE_KEY` on the backend only. Never put it in browser code or a `NEXT_PUBLIC_...` setting.
- Install the GitHub App only on the account or organization and repositories that should be in scope.
- Start with a test repository and inspect the pull request before merging.
- The sample manifest includes permissions beyond what the current PR flow needs. Review and reduce the permissions before using it.
- Webhook and OAuth URLs in the sample manifest are placeholders; the prototype does not provide those services.
