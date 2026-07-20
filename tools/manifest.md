# tools/manifest.md

## ZarishSphere Toolchain — Pinned Version Manifest

**Machine:** codeandbrain@lenovo · Linux Mint 22.3 / Linux Lite 7.8 / Ubuntu 26.04 LTS · i5-12450H · 8GB RAM / 512GB SSD  
**Last verified:** 19 July 2026 (live web research — see notes per tool)  
**Rule:** `latest` tag is forbidden except where explicitly marked "rolling is safe" below. No tool here requires payment or a credit card — anything that now does has been removed and flagged.

---

## ⚠️ Flagged this pass — read before applying

1. **Gemini CLI is gone from the free stack.** On 18 June 2026 Google cut off Gemini CLI for free/Pro/Ultra individual accounts. The replacement, Antigravity CLI (`agy`), is closed-source and requires a paid Google AI Pro subscription — that breaks your zero-cost rule, so it is **not** included below. `.github/workflows/auto-update-versions.yml` and `tools/ai-setup.md` both referenced Gemini CLI; both need editing (see the copies below) or your automation will silently fail. If you want a second AI CLI back in rotation, OpenCode (already free/multi-provider) or Claude Code cover the same ground without a new subscription.

1. **Aider vs. Ubuntu 26.04's Python.** Aider on PyPI requires `Python <3.13, >=3.10`. Check `python3 --version` after bootstrap — if it reports 3.13+, `pip install aider-chat` will refuse to install. Fix: install a pinned 3.12 via `pyenv` and point Aider's venv at that, rather than the system interpreter. Don't touch the system `python3` — that would violate your "don't change local machine settings" rule.

1. **pnpm 11.x requires Node ≥22.** You're on Node 24, so this is fine — noted here only so a future downgrade doesn't silently break `pnpm`.

---

## Currently installed / target versions (verified 19 July 2026)

| Tool | Version | Install method | Binary location |
| --- | --- | --- | --- |
| Go | **1.26.5** | tarball → /usr/local/go | `/usr/local/go/bin/go` |
| Node.js | **24.x (Active LTS "Krypton")** | nvm — always `nvm install 24 --lts` | `~/.nvm/versions/node/current/bin/node` |
| npm | bundled with Node 24 | bundled | same as Node |
| pnpm | **11.12.0** | npm global | same as Node |
| git | **2.54.0** | apt | `/usr/bin/git` |
| gh CLI | **2.96.0** | tarball | `~/.local/bin/gh` |
| chezmoi | rolling (currently 2.71.0) | curl install script | `~/.local/bin/chezmoi` |

## AI / DevOps tooling (verified 19 July 2026)

| Tool | Version | Install command | Notes |
| --- | --- | --- | --- |
| Docker Engine | **29.x** (apt repo, not a hardcoded minor) | see scripts/bootstrap.sh §Docker |  |
| DevPod | **0.6.15** (latest *stable*; 0.7.0 line is alpha — do not use) | AppImage/binary → `~/.local/bin/devpod` |  |
| Claude Code | rolling via npm (currently 2.1.x) | `npm install -g @anthropic-ai/claude-code@latest` | requires Node ≥22 ✅ |
| ~~Gemini CLI~~ | — | **removed** | free tier discontinued 18 Jun 2026; see flag #1 above |
| OpenCode | rolling (binary already at `~/.local/bin/opencode`) | download from opencode.ai | multi-provider fallback for the Gemini CLI gap |
| Ollama | **0.32.1** | `curl -fsSL https://ollama.com/install.sh | sh` | runs inside DevPod only, never on host |
| Open WebUI | **v0.9.5** (was pinned to a stale v0.5.21 — 4 releases behind ) | `ghcr.io/open-webui/open-webui:v0.9.5` | pin the tag, never `:main` or `:latest` |
| Aider | pip, Python `<3.13,>=3.10` required | `pip install aider-chat --break-system-packages` (inside a 3.12 venv — see flag #2) |  |

---

## Accounts referenced by this manifest (no payment required for any of them)

| Account | Platform | URL |
| --- | --- | --- |
| codeandbrain | GitHub (personal) | [https://github.com/codeandbrain](https://github.com/codeandbrain) |
| arwazarish | GitHub (org mgmt ) | [https://github.com/zsdotcom](https://github.com/zsdotcom) |
| devopsariful | GitHub (DevOps ) | — |
| zarishsphere.org | GitLab (free) | [https://gitlab.com/zarishsphere.org](https://gitlab.com/zarishsphere.org) |
| zarishsphere | npm org | [https://www.npmjs.com/settings/zarishsphere/packages](https://www.npmjs.com/settings/zarishsphere/packages) |
| zarishsphere | Docker Hub | [https://hub.docker.com/u/zarishsphere](https://hub.docker.com/u/zarishsphere) |
| zarishsphere.com | Domain (Cloudflare free tier ) | [https://zarishsphere.com](https://zarishsphere.com) |

---

## Download URLs (for reinstall or new machine )

| Tool | Official download URL |
| --- | --- |
| Go | [https://go.dev/dl/](https://go.dev/dl/) (download `goX.Y.Z.linux-amd64.tar.gz` ) |
| Node via nvm | [https://github.com/nvm-sh/nvm](https://github.com/nvm-sh/nvm) |
| gh CLI | [https://github.com/cli/cli/releases](https://github.com/cli/cli/releases) |
| chezmoi | [https://www.chezmoi.io/install/](https://www.chezmoi.io/install/) |
| Docker | [https://docs.docker.com/engine/install/ubuntu/](https://docs.docker.com/engine/install/ubuntu/) |
| DevPod | [https://github.com/loft-sh/devpod/releases](https://github.com/loft-sh/devpod/releases) (use the latest **non-alpha** tag ) |
| Claude Code | [https://docs.claude.com/en/docs/claude-code](https://docs.claude.com/en/docs/claude-code) |
| OpenCode | [https://opencode.ai](https://opencode.ai) |
| Ollama | [https://ollama.com/download/linux](https://ollama.com/download/linux) |
| Open WebUI | [https://github.com/open-webui/open-webui/releases](https://github.com/open-webui/open-webui/releases) |
| Aider | [https://aider.chat/docs/install/](https://aider.chat/docs/install/) |

---

## Version update process

When a tool is upgraded:

1. Update the version in this file, noting the date you verified it (web search, not memory — tool versions move fast )

1. Commit: `chore(dotfiles): upgrade <tool> to vX.Y.Z`

1. Push to `codeandbrain/dotfiles`

**On the automated PR workflow:** `.github/workflows/auto-update-versions.yml` previously installed Gemini CLI to do this version-checking. Since that path now needs a paid account, either (a) swap the workflow to call Claude Code or OpenCode instead, or (b) leave the workflow as a manual trigger you run yourself with `gh workflow run`. See the updated workflow file for a placeholder using a free path.
