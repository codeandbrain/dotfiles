# GitHub App onboarding (GUI-first)

What
- A ready-to-use GitHub App manifest is checked into infra/manifest.yml.
- This document shows GUI-first, step-by-step instructions to create the GitHub App from that manifest, install it into an account/org, generate required credentials, and configure the local prototype.

Why
- A GitHub App is the recommended integration because it supports multi-organization installs with scoped installation tokens and least-privilege permissions.
- Using the manifest makes registration fast and repeatable without hand-copying permissions.

When
- Do this before attempting to use the backend with real repositories or before running end-to-end tests that touch GitHub.

How (GUI-first)

Step 1 — Prepare
- Working directory on your machine: ~/projects/dotfile
- Ensure you have a GitHub account and admin permissions for any org you will install the app into.

Step 2 — Create the GitHub App from manifest (fast, GUI)
1. Open the GitHub "Create a GitHub App from a manifest" page in your browser:
   - https://github.com/settings/apps/new
2. Choose the option "Create GitHub App" and paste the contents of infra/manifest.yml into the manifest field, or upload the file if prompted.
3. Click "Create GitHub App".

Step 3 — Configure the app (GUI)
1. After creation, on the App settings page, set the following:
   - Homepage URL: https://example.com (replace with your deployed URL later)
   - Webhook URL: use your backend webhook URL (for local testing see Step 6)
   - Webhook secret: leave blank (or set one and record it in your .env)
2. Confirm permissions match what's in infra/manifest.yml. Adjust only if you understand the permission impact.

Step 4 — Generate credentials (GUI)
1. On the App page, create and download a private key. Save it securely.
2. Copy the App ID (displayed on the app settings page).
3. If present, copy Client ID and Client Secret (needed if you later add OAuth user flows).

Step 5 — Install the app (GUI)
1. Click "Install App" on the app settings page.
2. Choose to install on your personal account and any organization where you have admin rights.
3. Choose repositories to grant access to (start with a single test repo).
4. After installation, record the installation ID from the installation URL: when viewing the installation in the browser the URL path contains `/settings/installations/<installation_id>` — copy that numeric ID.

Step 6 — Local testing (GUI + lightweight tunnel)
- For local testing you need the backend reachable by GitHub for webhooks and OAuth redirects. Use a free tunnel service: localtunnel (npx localtunnel) or expose the backend via a temporary public URL.

If you prefer CLI one-liners (copy-paste safe):
Working directory: ~/projects/dotfile
1) Ensure you're in the repo root:
   cd ~/projects/dotfile

2) Start the backend in dev mode (in a separate terminal window):
   npm run dev:backend

3) Start a local tunnel to expose port 4000 (open a new terminal):
   # working directory: any (we'll use home)
   cd ~

   npx localtunnel --port 4000 --subdomain dotfile-demo-$(date +%s)

   # localtunnel prints a public URL like https://dotfile-demo-123456.loca.lt
   # Copy that URL and set it in the App settings as the "Webhook URL" and "Homepage URL" (use /webhook and /auth/callback paths accordingly)

Step 7 — Configure environment and run the prototype (GUI-first with small CLI steps)
1. Copy the example env file:
   Working directory: ~/projects/dotfile
   cp .env.example .env

2. Edit .env using a text editor and set these values from the GitHub App page:
   - GITHUB_APP_ID=<App ID you copied>
   - GITHUB_APP_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\n...\n-----END RSA PRIVATE KEY-----"
   - GITHUB_APP_INSTALLATION_ID=<installation id from Step 5>
   - NEXT_PUBLIC_BACKEND_URL=<the tunnel URL from Step 6, e.g. https://dotfile-demo-123456.loca.lt>

3. Start frontend and backend locally (two terminals):
   Terminal 1 (frontend):
   Working directory: ~/projects/dotfile
   npm run dev

   Terminal 2 (backend):
   Working directory: ~/projects/dotfile
   npm run dev:backend

4. Open the frontend at http://localhost:3000 and try creating a PR using the composer.

How to confirm the app works (GUI checks)
- After submitting from the frontend, you should see a new branch and pull request in the target repository.
- Check the backend logs (terminal) for success messages from the Octokit calls.

Troubleshooting (GUI-first)
- If GitHub reports webhook delivery failures, check the public tunnel URL and webhook URL in the app settings.
- If authentication fails, re-check GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY formatting (newlines must be preserved).
- If permission errors occur, ensure the installation was granted access to the target repository.

Security and next steps
- When moving to staging or production, host the backend on a public, stable URL and replace temporary tunnel endpoints.
- Store the private key in a secure secret store (do not commit it to the repo). For zero-cost options, consider environment variables on your host or GitHub Actions secrets.
- Enforce webhook signature verification in the backend before processing webhooks.

If you want, I will now:
- (A) Add the manifest to .github/manifest.yml to make it directly available from the repo settings (done: infra/manifest.yml added).
- (B) Create a step-by-step script to programmatically list installations and retrieve installation IDs using the GitHub REST API and JWT (CLI fallback).  

Reply "B" if you want the programmatic CLI steps added to the repo as a helper script; otherwise say "Done" and I will stop here.