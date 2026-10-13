# Programmatic installation lookup

What
- A small script (infra/get_installations.mjs) that uses the GitHub App JWT to list installations and print installation IDs for the app.

Why
- Avoid manual UI hunting for installation IDs. Useful for scripting and for CI setup where you need the numeric installation_id.

When to run
- After you create the GitHub App and download the private key and set GITHUB_APP_ID + GITHUB_APP_PRIVATE_KEY in .env.

How to run (exact copy-paste commands)
- Working directory: ~/projects/dotfile

1) Install dependencies (if not done already):

   cd ~/projects/dotfile
   npm install

2) Create .env and add values (copy from .env.example):

   cd ~/projects/dotfile
   cp .env.example .env
   # open .env in your editor and set GITHUB_APP_ID and paste the private key into GITHUB_APP_PRIVATE_KEY (preserve newlines)

3) Run the script to list installations:

   cd ~/projects/dotfile
   node infra/get_installations.mjs

4) Run the script to lookup a specific owner (returns the installation_id):

   cd ~/projects/dotfile
   node infra/get_installations.mjs codeandbrain

Output
- The script prints a tab-separated list of installations (id, type, owner).
- When an owner argument is supplied, it prints the matching installation_id and metadata.

Notes
- This script requires Node 18+ and the repo dependencies installed.
- Keep your private key secret. Do not commit it to the repo.
