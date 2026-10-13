# Architecture

## Product goal

Create a browser-first, no-code dotfile manager that can help a user manage dotfiles for their own account and across multiple GitHub organizations.

## Core principles

- GUI-first experience for non-developer users
- Safe-by-default GitHub actions: branch + commit + PR flow
- Multi-org support through GitHub App installation tokens
- Offline-friendly local preview capability
- Open, exportable configuration and data layouts

## System components

### 1. Frontend

A Next.js app provides:

- a snippet library and profile templates
- a dotfile preview pane
- a target repo selection workflow
- a form to submit changes for approval and PR creation

### 2. Backend API

A Fastify server provides:

- GitHub App auth setup
- installation token fetching
- repository data access
- branch/file/PR creation endpoints
- status and job reporting for each request

### 3. GitHub App

The GitHub App is the main integration point for:

- user account installations
- organization installations
- per-installation scoping and permissions
- branch/commit/PR creation across multiple repos

### 4. Data model

At the MVP level, the data layer can remain simple:

- user profile
- installation metadata
- templates and snippets
- job history
- target repo mapping

## Recommended permissions

At minimum, use:

- Repository contents: read and write
- Pull requests: read and write
- Metadata: read

If you later need workflow automation, add workflow permissions carefully.

## Deployment model

- Frontend: Vercel or a similar hosting platform
- Backend: Render, Fly.io, Cloud Run, or a lightweight VM
- Database: Postgres for jobs/audit history
- Secrets: environment variables + GitHub App private key stored in a secure secret manager

## Security notes

- never store GitHub App secrets in the frontend
- validate webhook signatures if adding webhooks later
- prefer PR creation over direct pushes for initial releases
- log all changes with repo, branch, and timestamp metadata

## MVP user flow

1. User logs in or installs the GitHub App.
2. User chooses or creates a dotfile profile.
3. User selects an organization or repo target.
4. User previews the generated content.
5. User submits a change.
6. The app creates a branch, writes the file, and opens a pull request.

## Future roadmap

- dry-run diff previews
- batch repo selection and apply-all workflows
- scheduled sync rules
- rollback and audit history
- repo template marketplace
