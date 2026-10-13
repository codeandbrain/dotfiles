# Set up a GitHub App for Dotfile Composer

## What this setup is for

A GitHub App gives this prototype permission to create a branch, update a file, and open a pull request in a repository you choose.

You do **not** need this setup just to open the local website and preview a dotfile. Set it up only when you are ready to try a real pull request.

## Important before you begin

- Use a test repository first.
- You need permission to create a GitHub App and install it on the account or organization that owns the test repository.
- Keep the private key secret. It belongs in the private `.env` file on your computer, never in the browser or in a public GitHub repository.
- This prototype does not implement GitHub sign-in or webhooks. The example manifest contains placeholder callback and webhook URLs; they are not working services. Do not set up a tunnel for this prototype.
- The browser currently cannot submit to the backend because cross-origin access is not enabled. App setup alone will not make pull request submission work; wait until that connection has been fixed and tested before trying a real repository.
- The example manifest requests more permissions than the current composer uses. Request only repository **Contents: Read and write** and **Pull requests: Read and write** for this workflow. Repository metadata access is normally provided for installed repositories.

## Create and install the App in GitHub

GitHub's page labels can change. In your browser:

1. Open your GitHub account settings and go to **Developer settings → GitHub Apps**.
2. Choose **New GitHub App**.
3. Give the App a recognizable name, such as `Dotfile Composer Test`.
4. For the homepage URL, use the project's GitHub page: <https://github.com/codeandbrain/dotfile>.
5. Leave webhooks disabled if GitHub offers that choice. The prototype does not receive webhook events.
6. In **Repository permissions**, grant:
   - **Contents:** Read and write. This lets the App create a branch and write the requested file.
   - **Pull requests:** Read and write. This lets the App open a pull request for review.
7. Save the App.
8. On the App settings page, copy the **App ID**.
9. In the **Private keys** section, choose **Generate a private key** and save the downloaded key somewhere private on your computer. Do not upload it to GitHub or send it to anyone.
10. Use **Install App** to install it on your personal account or organization. Select only your test repository.

The optional client ID, client secret, OAuth callback URL, webhook secret, and installation ID are not needed for the current create-pull-request workflow.

## Add the credentials to your local project

1. Open the project folder in Visual Studio Code.
2. In the file list, open `.env.example`.
3. Choose **File → Save As…** and save a copy named `.env` in the project root, next to `package.json`.
4. In `.env`, enter your App ID after `GITHUB_APP_ID=`.
5. Open the downloaded private key in a text editor, copy its complete contents, and put it after `GITHUB_APP_PRIVATE_KEY=`. Keep the key's beginning and ending lines. The example uses `\n` between lines to represent line breaks.
6. Save `.env`. The project is configured to keep `.env` out of Git.

Do not share screenshots of this file. It contains credentials that allow access to repositories where the App is installed.

## Start the local preview

After the missing stylesheet issue noted in the project README is fixed, use the editor and preview by opening a terminal in Visual Studio Code and using this working directory:

`/home/ariful/projects/dotfile`

If the project is saved somewhere else, use that folder instead.

Run:

```bash
npm run dev
```

Keep the terminal open and open <http://localhost:3000> in your browser. The preview does not require a GitHub App. Starting the backend separately does not remove the browser-to-backend limitation described above.

After the missing stylesheet is restored and browser-to-backend access is implemented and tested, the backend can be started in a second terminal with:

```bash
npm run dev:backend
```

At that point, use a test repository and confirm a pull request appears on GitHub. Review the proposed file change there. This prototype does not merge pull requests.

## Optional: find the installation ID

The current composer finds the App installation from the account and repository name you enter. You do not need to look up or enter the installation ID to create a pull request.

If you have another reason to find it, see [README_INSTALLATIONS.md](../infra/README_INSTALLATIONS.md). That helper is an optional command-line tool, not required for normal use.
