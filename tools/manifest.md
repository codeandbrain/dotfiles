# tools/manifest.md
## ZarishSphere Toolchain — Pinned Version Manifest

**Machine:** codeandbrain@lenovo · Ubuntu 26.04 LTS · i5-12450H  
**Last verified:** June 2026  
**Rule:** `latest` tag is forbidden. Every tool is version-pinned here.

---

## Currently installed (verified on this machine)

| Tool | Version | Install method | Binary location |
|---|---|---|---|
| Go | 1.24.4 | tarball → /usr/local/go | `/usr/local/go/bin/go` |
| Node.js | 24.17.0 | nvm | `~/.nvm/versions/node/v24.17.0/bin/node` |
| npm | 11.13.0 | bundled with Node | same as Node |
| pnpm | 11.8.0 | npm global | same as Node |
| git | 2.53.0 | apt | `/usr/bin/git` |
| gh CLI | 2.95.0 | tarball | `~/.local/bin/gh` |
| chezmoi | latest stable | curl install script | `~/.local/bin/chezmoi` |

---

## To install next (in order)

| Tool | Version to install | Install command |
|---|---|---|
| Docker | 27.x | see scripts/bootstrap.sh §Docker |
| DevPod | 0.4.1 | AppImage | `~/.local/bin/devpod` |
| Claude Code | latest stable | `npm install -g @anthropic-ai/claude-code` |
| Gemini CLI | latest stable | `npm install -g @google/gemini-cli` |
| Ollama | latest stable | `curl -fsSL https://ollama.com/install.sh \| sh` |
| Aider | latest stable | `pip install aider-chat` |

---

## Download URLs (for reinstall or new machine)

| Tool | Official download URL |
|---|---|
| Go | https://go.dev/dl/ (download `goX.Y.Z.linux-amd64.tar.gz`) |
| Node via nvm | https://github.com/nvm-sh/nvm |
| gh CLI | https://github.com/cli/cli/releases (download `gh_X.Y.Z_linux_amd64.tar.gz`) |
| chezmoi | https://www.chezmoi.io/install/ |
| Docker | https://docs.docker.com/engine/install/ubuntu/ |
| DevPod | https://github.com/loft-sh/devpod/releases |
| Claude Code | https://docs.anthropic.com/claude-code |
| Gemini CLI | https://github.com/google-gemini/gemini-cli |
| Ollama | https://ollama.com/download/linux |
| Aider | https://aider.chat/docs/install/ |

---

## Version update process

When a tool is upgraded:
1. Update the version in this file
2. Commit: `chore(dotfiles): upgrade <tool> to vX.Y.Z`
3. Push to `codeandbrain/dotfiles`
