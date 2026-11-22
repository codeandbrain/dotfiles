# Start here

**Orbit** is a free, browser-based workspace for looking after your GitHub account and organizations. You can sign in with GitHub, see your repositories, filter and export them, and work in a safe demo mode without any account at all.

This page is the short version. Everything else is linked from here.

---

## 1. Run it on your computer

Open a terminal and use **this exact folder**:

```text
/home/ariful/projects/dotfiles
```

Run these three commands, one at a time:

```bash
npm ci
npm run dev
```

Then open <http://localhost:3000> in your browser.

- `npm ci` installs the needed pieces (only the first time, or after changes).
- `npm run dev` starts the website. Leave that terminal open while you use it.
- To stop it, press `Ctrl + C` in the terminal.

You do **not** need any GitHub account or secret to try the demo.

---

## 2. Check that everything still works

In the same folder:

```bash
npm run check
```

This runs the automatic checks: code style, type checks, tests, and a full build.

---

## 3. Sign in with GitHub (optional)

The demo works without this. To see your real repositories, follow the plain-language guide in [docs/OAUTH-SETUP.md](docs/OAUTH-SETUP.md).

In short: create a free GitHub OAuth App, give it a callback address, then add four values to the website's settings. **Never put secret values in a file that gets uploaded to GitHub.**

---

## 4. Where things are

| I want to… | Go to |
| --- | --- |
| Understand what Orbit is | [docs/PRODUCT.md](docs/PRODUCT.md) |
| Understand how it is built | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) |
| Set up sign-in | [docs/OAUTH-SETUP.md](docs/OAUTH-SETUP.md) |
| Know how your data is protected | [SECURITY.md](SECURITY.md) |
| Ask OpenCode for help | Type `/start` in OpenCode |

---

## 5. Two simple rules

1. **Never paste a password, token, or private key into chat or into a file that gets uploaded.**
2. **If a command fails, copy the whole message and give it to OpenCode with `/fix`.** Do not try to guess a fix yourself — that is what I am here for.
