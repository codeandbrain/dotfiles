#!/usr/bin/env node

/*
  infra/get_installations.mjs

  Usage (copy-paste ready):
  Working directory: ~/projects/dotfile

  1) Ensure dependencies are installed:
     cd ~/projects/dotfile
     npm install

  2) Ensure .env exists and contains GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY
     cp .env.example .env
     # edit .env and paste the private key and app id

  3) Run the script to list installations:
     cd ~/projects/dotfile
     node infra/get_installations.mjs

  4) Or pass an owner to lookup its installation id:
     node infra/get_installations.mjs codeandbrain

  Notes:
  - This script uses the GitHub App JWT to call the REST API and list installations.
  - The private key must be PEM formatted (newlines preserved). If you pasted it with literal \n sequences, replace them with real newlines.
*/

import dotenv from 'dotenv';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';

dotenv.config();

const APP_ID = process.env.GITHUB_APP_ID;
const PRIVATE_KEY = process.env.GITHUB_APP_PRIVATE_KEY;

if (!APP_ID || !PRIVATE_KEY) {
  console.error('Missing environment variables. Set GITHUB_APP_ID and GITHUB_APP_PRIVATE_KEY in .env');
  process.exit(1);
}

const ownerArg = process.argv[2];

const auth = createAppAuth({
  appId: Number(APP_ID),
  privateKey: PRIVATE_KEY.replace(/\\n/g, '\n'),
});

try {
  const appAuth = await auth({ type: 'app' });
  const octokit = new Octokit({ auth: appAuth.token });

  const res = await octokit.rest.apps.listInstallations();
  const installations = res.data || [];

  if (installations.length === 0) {
    console.log('No installations found for this GitHub App.');
    process.exit(0);
  }

  if (ownerArg) {
    const match = installations.find((it) => it.account && it.account.login && it.account.login.toLowerCase() === ownerArg.toLowerCase());
    if (!match) {
      console.error(`No installation found for owner: ${ownerArg}`);
      console.log('\nAll installations:');
      installations.forEach((it) => {
        console.log(`${it.id}\t${it.account.type}\t${it.account.login}`);
      });
      process.exit(1);
    }

    console.log(`Installation for ${ownerArg}:`);
    console.log(`- installation_id: ${match.id}`);
    console.log(`- account: ${match.account.type} / ${match.account.login}`);
    console.log(`- permissions: ${JSON.stringify(match.permissions || {})}`);
    process.exit(0);
  }

  // Print a simple table of installations
  console.log('Installations:');
  console.log('ID\tTYPE\tOWNER');
  installations.forEach((it) => {
    const id = it.id;
    const type = it.account?.type || 'N/A';
    const login = it.account?.login || 'N/A';
    console.log(`${id}\t${type}\t${login}`);
  });

  console.log('\nTo get the installation id for a specific owner, run:');
  console.log('  node infra/get_installations.mjs <owner>');
} catch (err) {
  console.error('Failed to list installations:', err instanceof Error ? err.message : String(err));
  process.exit(2);
}
