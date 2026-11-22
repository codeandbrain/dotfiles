# Connect Orbit to your GitHub account

Orbit works in demo mode without any of this. Follow these steps only when you want to see your **real** repositories and organizations.

Nothing here costs money.

---

## The idea (30 seconds)

GitHub needs to know that a sign-in attempt really comes from your Orbit site. To do that, you register the site once with GitHub and receive two values: a **client ID** (public-ish) and a **client secret** (private). You also create your own **session secret** — a long random string that Orbit uses to lock the sign-in cookie. Finally, you tell Orbit the web address of the site.

That is four values in total.

---

## Step 1 — Register a free GitHub OAuth App

1. Sign in at <https://github.com>.
2. Click your profile picture → **Settings** → **Developer settings** (usually at the bottom of the left menu) → **OAuth Apps** → **New OAuth App**.
3. Fill in:
   - **Application name:** `Orbit`
   - **Homepage URL:** your live address, for example `https://your-project.vercel.app`
   - **Authorization callback URL:** `https://your-project.vercel.app/api/auth/callback`
4. Click **Register application**.
5. Copy the **Client ID**.
6. Click **Generate a new client secret**, then copy the secret immediately. GitHub shows it only once.

For local testing, register a second OAuth App (or add a second callback URL) using `http://localhost:3000/api/auth/callback`.

---

## Step 2 — Make your session secret

In a terminal, in any folder, run:

```bash
openssl rand -base64 32
```

Copy the long line it prints. That is your session secret. Make a new one only if you want to sign everyone out; changing it invalidates existing sign-ins.

---

## Step 3 — Put the four values in the right place

### For the website on your own computer

Working folder: `/home/ariful/projects/dotfiles/frontend`

```bash
cp .env.example .env.local
```

Open `frontend/.env.local` in a text editor and fill in:

```text
NEXT_PUBLIC_APP_URL=http://localhost:3000
GITHUB_OAUTH_CLIENT_ID=your-client-id
GITHUB_OAUTH_CLIENT_SECRET=your-client-secret
SESSION_SECRET=your-long-random-string
```

Start the app again from the project root with `npm run dev`. The `.env.local` file is ignored by Git — it will never be uploaded.

### For the hosted site on Vercel

1. Open your project in Vercel → **Settings** → **Environment Variables**.
2. Add the same four names and values.
3. Set the Vercel project **Root Directory** to `frontend`.
4. Build command: `npm run build`. Install command: `npm install`.
5. Redeploy so the new values take effect.

---

## Step 4 — Check that it worked

1. Open the site and go to **Settings**.
2. Choose **Sign in with GitHub**.
3. GitHub asks you to approve Orbit. Review the permissions and approve.
4. You should return to the dashboard with a **Connected** badge and your real repositories.

If something goes wrong, Orbit now shows a clear message such as *"GitHub sign-in could not be verified. Please try again."* — tell OpenCode with `/fix` and include the message.

---

## Common questions

**Do I need to create a GitHub App?** No. Orbit uses a free OAuth App. The older GitHub App approach is not part of this project.

**Why can I not see private organization repositories?** An organization owner may need to approve the OAuth App first. Check the organization's **Applications** settings.

**Why does the app say some repositories are missing?** GitHub is read in pages of 100, up to 1,000 items. If you have more, Orbit tells you instead of pretending the list is complete.

**Can I use a personal access token instead?** No — by design. Tokens never enter the browser in Orbit.
