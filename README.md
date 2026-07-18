# dotfiles
## codeandbrain — Personal Development Environment

**Machine:** Lenovo · Linux Mint / Linux Lite / Ubuntu 26 · i5-12450H · 7GB RAM  
**Customized Repository:** [codeandbrain/dotfiles](https://github.com/codeandbrain/dotfiles)  
**Managed by:** [chezmoi](https://www.chezmoi.io/) — dotfiles manager  
**Status:** V2 · AI-Enhanced & Sandboxed

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

## What this repo does (V2 Enhancements)

This repository is the **single source of truth** for the development environment on this machine. Every configuration file, tool setting, alias, and shell behavior is stored here. With V2, we've introduced significant enhancements:

*   **Automated Version Management:** All tools and dependencies are now automatically checked for updates via GitHub Actions and Gemini CLI. This ensures you always have the latest stable versions without manual intervention.
*   **Sandboxed Environment with DevPod:** A reproducible and isolated development environment is provided using DevPod. This prevents conflicts with your host system and ensures a consistent setup across different machines.
*   **GUI-Friendly for Newcomers:** The setup process is streamlined for Linux newcomers, emphasizing GUI-based tools and simplified commands.

It does **not** contain ZarishSphere platform code — that lives in the [zarishsphere](https://github.com/zarishsphere) org. This repo manages *how the machine works*, not *what is being built*.

---

## Repo structure

```
codeandbrain/dotfiles/
├── README.md                        ← you are here
│
├── .github/workflows/               ← GitHub Actions for automated maintenance
│   └── auto-update-versions.yml     ← Automatically checks and updates tool versions
│
├── devpod/                          ← DevPod configuration for sandboxed environments
│   └── devpod.yaml                  ← Defines the isolated development environment
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
│   ├── manifest.md                  ← pinned tool versions — source of truth for automation
│   ├── ai-setup.md                  ← multi-AI tool configuration guide
│   └── vscode-extensions.json       ← VS Code extension list
│
└── scripts/
    └── bootstrap.sh                 ← one-command machine setup (run once)
```

**`dot_` prefix:** chezmoi convention. `dot_bashrc` in this repo becomes `.bashrc` on the machine. The dot prefix prevents files from being invisible inside the repo.

---

## How to apply these files (GUI-Friendly Setup)

This setup is designed to be as simple as possible for Linux newcomers. We'll use DevPod to create an isolated environment, and `chezmoi` to manage your dotfiles within it.

### 1. Install DevPod (Graphical User Interface)

DevPod provides a desktop application for Linux that makes managing sandboxed environments easy. Download and install it from the official website:

*   **Download DevPod Desktop:** [https://devpod.sh/docs/getting-started/install/](https://devpod.sh/docs/getting-started/install/)

Follow the installation instructions for your Linux distribution. Once installed, launch the DevPod application.

### 2. Create Your ZarishSphere DevPod

1.  **Clone this repository:** If you haven't already, clone this `dotfiles` repository to your local machine.
    ```bash
    gh repo clone codeandbrain/dotfiles
    cd dotfiles
    ```
2.  **Launch DevPod UI:** Open your terminal and run:
    ```bash
    devpod ui &
    ```
    This will open the DevPod graphical interface in your web browser.
3.  **Import DevPod Configuration:** In the DevPod UI, navigate to the option to import a workspace. Point it to the `devpod/devpod.yaml` file within your cloned `dotfiles` repository.
4.  **Start the DevPod:** Follow the prompts in the DevPod UI to create and start your `zarishsphere-devpod` workspace. This will automatically:
    *   Set up an isolated Ubuntu environment.
    *   Run the `bootstrap.sh` script to install all necessary tools (Go, Node.js, pnpm, GitHub CLI, chezmoi, Docker, AI tools like Gemini CLI and Ollama).
    *   Apply your `chezmoi` dotfiles to personalize the environment.
    *   Start Ollama and Open WebUI for local AI interactions.

### 3. Automated Dotfile Updates (via GitHub)

This repository is configured with a GitHub Action that automatically checks for and proposes updates to your tool versions. You'll receive a Pull Request on GitHub when new stable versions are available. To merge these updates:

1.  **Go to your GitHub repository:** [https://github.com/codeandbrain/dotfiles](https://github.com/codeandbrain/dotfiles)
2.  **Review Pull Requests:** Look for open Pull Requests titled "Automated: Update tool versions in manifest.md".
3.  **Merge the PR:** Review the proposed changes and, if satisfied, click the "Merge pull request" button. This will update your `manifest.md` and ensure your DevPod environment stays up-to-date the next time it's started or refreshed.

---

## ZarishSphere workspace

After your DevPod is running and dotfiles are applied, you can clone the ZarishSphere workspace within your DevPod environment:

```bash
zsclone
```

This function (defined in `dot_bashrc`) clones every ZarishSphere org repo into `~/zarishsphere/`.

---

*ZarishSphere Foundation · V2 · 2026*  
*License: Apache 2.0 (code) · CC BY 4.0 (documentation)*
