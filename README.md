# dotfiles
## codeandbrain — Personal Development Environment

**Machine:** Lenovo · Linux Mint / Linux Lite / Ubuntu 26 · i5-12450H · 7GB RAM  
**Customized Repository:** [codeandbrain/dotfiles](https://github.com/codeandbrain/dotfiles)  
**Managed by:** [chezmoi](https://www.chezmoi.io/) — dotfiles manager  
**Status:** V1 · Active

---

## Identity and contact architecture

| Field | Value |
|---|---|
| Full name | Mohammad Ariful Islam |
| Preferred alias | Ariful / Md Ariful Islam |
| Nationality | Bangladeshi |
| Current location | Cox's Bazar — 4700, Bangladesh |
| Home address | Tangail, Bangladesh |
| Role (Primary) | Founder, ZarishSphere Foundation |
| Educational Background | Public Health Professional |
| Primary mobile | +880 1723 889843 |
| Secondary mobile | +880 1684 364243 |
| Personal email | code.and.brain@gmail.com |

---


## What this repo does

This repository is the **single source of truth** for the development environment on this machine. Every configuration file, tool setting, alias, and shell behaviour is stored here. If the machine is wiped or replaced, running one command restores everything.

It does **not** contain ZarishSphere platform code — that lives in the [zarishsphere](https://github.com/zarishsphere) org. This repo manages *how the machine works*, not *what is being built*.

---

## Repo structure

```
codeandbrain/dotfiles/
├── README.md                        ← you are here
│
├── home/                            ← files that live in ~/ on the machine
│   ├── dot_bashrc                   → ~/.bashrc
│   ├── dot_gitconfig                → ~/.gitconfig
│   ├── dot_gitmessage               → ~/.gitmessage
│   ├── dot_npmrc                    → ~/.npmrc
│   └── dot_config/
│       └── gh/
│           ├── config.yml           → ~/.config/gh/config.yml
│           └── hosts.yml            → ~/.config/gh/hosts.yml
│
├── tools/
│   ├── manifest.md                  ← pinned tool versions — source of truth
│   ├── ai-setup.md                  ← multi-AI tool configuration guide
│   └── vscode-extensions.json       ← VS Code extension list
│
└── scripts/
    └── bootstrap.sh                 ← one-command machine setup (run once)
```

**`dot_` prefix:** chezmoi convention. `dot_bashrc` in this repo becomes `.bashrc` on the machine. The dot prefix prevents files from being invisible inside the repo.

---

## How to apply these files

### New machine setup (first time)

```bash
# 1. Install chezmoi
sh -c "$(curl -fsLS get.chezmoi.io)"

# 2. Apply all dotfiles in one command
~/.local/bin/chezmoi init --apply https://github.com/codeandbrain/dotfiles

# 3. Reload shell
source ~/.bashrc
```

### Update existing machine after a change

```bash
chezmoi update
```

### Edit a file (never edit ~/.bashrc directly)

```bash
chezmoi edit ~/.bashrc
chezmoi apply
```

---

## ZarishSphere workspace

After dotfiles are applied, clone the workspace:

```bash
zsclone
```

This function (defined in `dot_bashrc`) clones every ZarishSphere org repo into `~/zarishsphere/`.

---

*ZarishSphere Foundation · V1 · 2026*  
*License: Apache 2.0 (code) · CC BY 4.0 (documentation)*