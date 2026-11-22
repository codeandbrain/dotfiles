# Connect Orbit to your GitHub account

Orbit works in demo mode without any of this. Follow these steps only when you want to see your **real** repositories and organizations. Nothing here costs money.

## Your live addresses and names (already created)

| Item | Exact value |
| --- | --- |
| Vercel team | `codeandbrain` |
| Vercel project | `orbit` |
| Website (Homepage URL) | `https://orbit-peach-alpha-31.vercel.app` |
| Callback URL | `https://orbit-peach-alpha-31.vercel.app/api/auth/callback` |
| GitHub account | `codeandbrain` |
| Repository | `codeandbrain/dotfiles` |

The two addresses above are the ones Vercel gave this project. Copy them exactly — no trailing slash, no extra spaces.

## The idea in one picture

1. **Vercel** gives Orbit a web address (done).
2. **GitHub** needs to know that address, so you register it once in a free "OAuth App" form.
3. **GitHub gives back two values**: a Client ID and a Client Secret.
4. **Those two values go into Vercel** as settings, together with a private Session Secret.
5. Vercel rebuilds the site. Sign-in then works.

The Client ID and Client Secret are the only values you need to bring back and give to OpenCode.

---

## Step 1 — Install the free Vercel GitHub App (one-time, for automatic publishing)

This lets every push to `main` update the live website by itself.

1. Open this link while signed in as `codeandbrain`:
   <https://github.com/apps/vercel/installations/new>
2. Choose **Only select repositories** and tick **`dotfiles`**.
3. Click **Install**.

Tell OpenCode when this is done. It will finish connecting the project from the terminal.

---

## Step 2 — Register the free GitHub OAuth App

1. Open this exact link: <https://github.com/settings/applications/new>
2. Fill the form with these exact values:

| Field | What to type |
| --- | --- |
| Application name | `Orbit` |
| Homepage URL | `https://orbit-peach-alpha-31.vercel.app` |
| Application description | `Orbit - a friendly GitHub workspace manager` |
| Authorization callback URL | `https://orbit-peach-alpha-31.vercel.app/api/auth/callback` |
| Enable Device Flow | leave unchecked |
| Expire user access tokens | leave checked |

3. Click **Register application**.
4. On the next page, copy the **Client ID**.
5. Click **Generate a new client secret** and copy the secret immediately — GitHub shows it only once.
6. Paste those two values back to OpenCode in chat. Do **not** put them in any project file.

OpenCode will store them only as Vercel environment variables and rebuild the site.

---

## What OpenCode has already stored in Vercel

| Setting | Where it is stored | Status |
| --- | --- | --- |
| `NEXT_PUBLIC_APP_URL` | Vercel environment variable (Production, Preview, Development) | Done |
| `SESSION_SECRET` | Vercel Secret environment variable | Done — private, never shown |
| `GITHUB_OAUTH_CLIENT_ID` | Vercel environment variable | Waiting for Step 2 |
| `GITHUB_OAUTH_CLIENT_SECRET` | Vercel Secret environment variable | Waiting for Step 2 |

Build settings on the Vercel project: root directory `frontend`, framework `Next.js`, build command `npm run build`, install command `npm install`, Node.js `22.x`.

---

## Step 3 — Check that sign-in works

After OpenCode adds the two values and redeploys:

1. Open <https://orbit-peach-alpha-31.vercel.app>.
2. Click **Settings** in the left menu.
3. Click **Sign in with GitHub**.
4. Approve the permissions GitHub shows.
5. The page returns with a **Connected** badge and your real repositories.

If it fails, the page shows a plain message such as *"GitHub sign-in could not be verified. Please try again."* Copy that message to OpenCode with `/fix`.

---

## Common questions

**Why is the address not simply `orbit.vercel.app`?** That short name is already used by someone else on Vercel, so Vercel assigned this stable one. It is yours and does not change.

**Do I need a GitHub App instead?** No. Orbit uses a free OAuth App by design.

**Why can I not see private organization repositories?** An organization owner must approve the OAuth App first, under the organization's **Applications** settings.

**Can I use a personal access token?** No. Tokens never enter the browser in Orbit.
