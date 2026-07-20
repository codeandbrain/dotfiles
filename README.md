# dotfiles

## codeandbrain — Personal Development Environment

**Machine:** Lenovo · Linux Mint 22.3 (Cinnamon) / Linux Lite 7.8 / Ubuntu 26.04 LTS · i5-12450H · 8GB RAM / 512GB SSD  
**Customized Repository:** [codeandbrain/dotfiles](https://github.com/codeandbrain/dotfiles)  
**Managed by:** [chezmoi](https://www.chezmoi.io/) — dotfiles manager**Status:** V2 · AI-Enhanced & Sandboxed  

> **Portability note:** nothing in this repo should assume a specific OS flavour, hostname, or local username. If you find a hardcoded assumption, it's a bug — file it.

---

## Identity and contact architecture

| Field | Value |
| --- | --- |
| Full name | Mohammad Ariful Islam |
| Preferred alias | Ariful / Md Ariful Islam |
| Nationality | Bangladeshi |
| Current location | Cox's Bazar — 4700, Bangladesh |
| Home address | Tangail, Bangladesh |
| Role (Primary) | Founder, ZarishSphere Foundation |
| Educational Background | Public Health Professional |
| Primary mobile | +880 1723 889843 |
| Secondary mobile | +880 1684 364243 |
| Personal email | [code.and.brain@gmail.com](mailto:code.and.brain@gmail.com) |

### 1.1 GitHub accounts

| Account | Email | Role (assumed — confirm) |
| --- | --- | --- |
| `codeandbrain` | [code.and.brain@gmail.com](mailto:code.and.brain@gmail.com) | Default/personal identity (this dotfiles repo, personal projects) |
| `arwazarish` | [zarishsphere@gmail.com](mailto:zarishsphere@gmail.com) | Org-management identity for `zsdotcom` |
| `devopsariful` | [dev43ariful@gmail.com](mailto:dev43ariful@gmail.com) | DevOps/CI/automation identity |

**GitHub Organization:** [https://github.com/zsdotcom](https://github.com/zsdotcom)  
***Org email:** [platform@zarishsphere.com](mailto:platform@zarishsphere.com)  

### 1.2 Other platform accounts

| Platform | URL |
| --- | --- |
| GitLab (free) | [https://gitlab.com/zarishsphere.org](https://gitlab.com/zarishsphere.org) |
| npm organization | [https://www.npmjs.com/settings/zarishsphere/packages](https://www.npmjs.com/settings/zarishsphere/packages) |
| Docker Hub | [https://hub.docker.com/u/zarishsphere](https://hub.docker.com/u/zarishsphere) |
| Custom domain (Cloudflare, free tier ) | zarishsphere.com |

---

## What this repo does (V2 Enhancements)

This repository is the **single source of truth** for the development environment on this machine. Every configuration file, tool setting, alias, and shell behavior is stored here.

- **Automated Version Management:** All tools and dependencies are automatically checked for updates via GitHub Actions and an AI agent (currently a placeholder for OpenCode).

- **Sandboxed Environment with DevPod:** A reproducible, isolated development environment via DevPod. All AI/agent work, inputs, and outputs stay inside the sandbox — nothing touches the host machine's settings, and nothing is tied to the host's username or OS flavour.

- **GUI-Friendly for Newcomers:** Streamlined setup emphasizing GUI-based tools; CLI is always exact, copy-paste, numbered steps.

- **No telemetry by default:** No tool in this stack is configured to phone home usage data. If a tool ships telemetry, it is disabled in its config file here (see `tools/manifest.md`).

It does **not** contain ZarishSphere platform code — that lives in the [zsdotcom](https://github.com/zsdotcom) org. This repo manages *how the machine works*, not *what is being built*.

---

## Repo structure

```
codeandbrain/dotfiles/
├── README.md                        ← you are here
│
├── .github/workflows/               ← GitHub Actions for automated maintenance
│   └── auto-update-versions.yml
│
├── devpod/
│   └── devpod.yaml                  ← isolated development environment definition
│
├── home/                            ← files that live in ~/ on the machine
│   ├── dot_bashrc                   → ~/.bashrc
│   ├── dot_gitconfig                → ~/.gitconfig
│   ├── dot_gitconfig-zsdotcom       → ~/.gitconfig-zsdotcom   (identity: arwazarish)
│   ├── dot_gitconfig-devops         → ~/.gitconfig-devops     (identity: devopsariful)
│   ├── dot_gitmessage               → ~/.gitmessage
│   ├── dot_npmrc                    → ~/.npmrc
│   └── dot_config/
│       └── gh/
│           ├── config.yml           → ~/.config/gh/config.yml
│           └── hosts.yml            → ~/.config/gh/hosts.yml
│
├── tools/
│   ├── manifest.md                  ← pinned tool versions — source of truth for automation
│   ├── ai-setup.md                  ← multi-AI tool configuration guide
│   └── vscode-extensions.json
│
└── scripts/
    └── bootstrap.sh                 ← one-command sandbox setup (run once, inside DevPod)
```

**`dot_`**** prefix:** chezmoi convention. `dot_bashrc` in this repo becomes `.bashrc` on the machine.

---

## Multi-account git identity (GUI-optional, but this part needs a text edit)

Three identities are wired up via `[includeIf]` in `~/.gitconfig`:

| Working directory | Identity used | Config file |
| --- | --- | --- |
| Anything else | `codeandbrain` (default) | `~/.gitconfig` |
| `~/zarishsphere/` (zsdotcom org work) | `arwazarish` | `~/.gitconfig-zsdotcom` |
| `~/devops/` (CI/automation work) | `devopsariful` | `~/.gitconfig-devops` |

You don't need to remember which is which day-to-day — just work inside the right folder and git picks the identity automatically. Nothing here depends on your OS username; it's keyed entirely on folder path.

**If you already have cloned repos pointing at the old ****`zarishsphere`**** org**, repoint them (run once per repo):

```bash
git remote set-url origin git@github.com:zsdotcom/<repo-name>.git
```

---

## GUI-Friendly Setup

### 1. Install DevPod (Desktop GUI)

- **Download:** [https://devpod.sh/docs/getting-started/install/](https://devpod.sh/docs/getting-started/install/)

### 2. Create Your Sandbox

1. Clone this repo:

   ```bash
   gh repo clone codeandbrain/dotfiles
   cd dotfiles
   ```

1. Launch the DevPod UI:

   ```bash
   devpod ui &
   ```

1. In the DevPod UI, import `devpod/devpod.yaml` from your cloned repo.

1. Start the workspace. This automatically sets up an isolated environment, runs `bootstrap.sh`, applies your `chezmoi` dotfiles, and starts local AI services — all inside the sandbox, never on the host.

### 3. Automated Dotfile Updates

A GitHub Action opens a PR titled "Automated: Update tool versions in manifest.md" whenever new stable tool versions are found. Review and merge from: [https://github.com/codeandbrain/dotfiles](https://github.com/codeandbrain/dotfiles)

---

## ZarishSphere workspace

```bash
zsclone
```

Clones every `zsdotcom` org repo into `~/zarishsphere/` (local folder name kept for continuity — only the remote org changed ).

---

*ZarishSphere Foundation · V2 · 2026**License: Apache 2.0 (code) · CC BY 4.0 (documentation)*
