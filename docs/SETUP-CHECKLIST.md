# Optional tools checklist

Orbit itself needs only a browser and its hosted address. The tools below are for working on the code locally. **Nothing here is installed automatically** by this project, every item is free, and each has builds for Windows, macOS, and Linux. Install only what you need, in this order.

GitHub sign-in in a browser handles account access. Private organization data still needs approval from that organization's owner inside GitHub's own settings; no tool here can grant it.

---

## 1. Needed for local development

| Tool | Why it is needed | Official place to install | Check it |
| --- | --- | --- | --- |
| Node.js 22 or newer | Runs the website on your computer | <https://nodejs.org> | `node --version` |
| npm | Installs project packages; included with Node.js | Comes with Node.js | `npm --version` |
| Git | Saves and publishes changes | <https://git-scm.com/downloads> | `git --version` |

## 2. Helpful but optional

| Tool | Why it helps | Official place to install | Check it |
| --- | --- | --- | --- |
| GitHub CLI (`gh`) | Sign in to GitHub from a terminal | <https://cli.github.com> | `gh auth status` |
| Vercel CLI | Deploy from a terminal | <https://vercel.com/docs/cli> | `vercel --version` |
| OpenCode CLI | The project's only AI developer; free models need no account | <https://opencode.ai/terminal> | `opencode --version` |
| OpenCode Desktop | The same agent in an app | <https://opencode.ai/desktop> | Open the app and read its version under Help / About |
| Zed or another lightweight editor | Read and edit files | <https://zed.dev> | Open the editor |
| Open VSX | Free extension catalogue for compatible editors | <https://open-vsx.org> | Search for an extension in the editor's Extensions panel |

Avoid paid plans, trials, and tools that require a card. The free OpenCode models and the free tiers listed here are enough for Orbit.

## 3. Project instructions and skills

These files come with the repository. Nothing extra is downloaded:

| Folder | Contains |
| --- | --- |
| `.opencode/skills/` | Four workflow files following the open Agent Skills `SKILL.md` specification |
| `.opencode/commands/` | Five slash commands, including `/start`, `/check`, and `/fix` |
| `AGENTS.md` | Project rules in the open AGENTS.md format, readable by many tools |

To check them, open the repository folder in your editor and look inside `.opencode/`.

## 4. Verify compatibility

Open a terminal **in the project folder** and run each check one at a time. A version number means that tool is ready.

```bash
node --version
```

```bash
npm --version
```

```bash
git --version
```

```bash
gh auth status
```

```bash
vercel --version
```

```bash
opencode --version
```

Then check the project itself:

```bash
npm run check
```

If a check fails, copy the whole message and give it to OpenCode with `/fix`. Do not change tool versions to guess a fix.

## 5. What is deliberately not automatic

- No desktop app, editor, or extension is installed by Orbit.
- No GitHub organization is changed or configured by Orbit.
- No secret is written to a project file. Secrets stay in Vercel environment variables or a local ignored `.env.local` file.
- No existing sign-in is altered by installing a tool.
