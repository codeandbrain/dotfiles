# tools/ai-setup.md
## ZarishSphere — Multi-AI Tool Setup (within DevPod)

**Principle:** Every AI tool here is free, open-source, and vendor-switchable. These tools run inside your DevPod sandboxed environment.
**GUI first:** every tool listed has a GUI path where one exists.
**No lock-in:** all config files are in this repo. Switching AI providers = changing one line.
**Last verified:** 19 July 2026

---

## ⚠️ Gemini CLI has been removed from this stack

Google discontinued Gemini CLI's free tier on **18 June 2026**. It stopped serving requests for free, Google AI Pro, and Ultra individual accounts. The replacement, **Antigravity CLI**, is closed-source and requires a paid Google AI Pro subscription — that conflicts with this repo's zero-cost rule, so it is not included here.

If you specifically want it back later on a paid plan, that's a deliberate choice to make yourself, not something these dotfiles should default you into.

---

## The AI stack for ZarishSphere

| Layer | Tool | What it does | Free? | Offline? | Environment |
|---|---|---|---|---|---|
| Sandboxing | DevPod | Isolated, reproducible development environments | Free | N/A | Host (GUI) |
| Coding agent (terminal) | Claude Code | Full codebase understanding, file editing, terminal control | Free tier | No | DevPod |
| Coding agent (terminal) | OpenCode | Multi-provider terminal agent (works with Claude, local Ollama, others) | Free | Optional | DevPod |
| Coding agent (VS Code) | Cline | Claude/GPT-powered VS Code agent | Free tier | No | DevPod (VS Code) |
| Coding agent (VS Code) | Continue | Open-source AI coding in VS Code | Free | Optional | DevPod (VS Code) |
| Local LLM runtime | Ollama | Runs LLMs on your own machine — inside the DevPod sandbox only | Free | YES | DevPod |
| Local LLM UI | Open WebUI | Browser GUI for Ollama | Free | YES | DevPod |
| AI writing (desktop) | Moraya | Already installed (AppImage) | Free | Partial | DevPod |
| AI writing (ZarishSphere) | ZarishNote | Under development | Free | YES (Plane 0) | DevPod |

---

## 1. Claude Code

**Install:**
```bash
npm install -g @anthropic-ai/claude-code@latest
```
Requires Node.js ≥22 — your Node 24 setup satisfies this.

**First run:**
```bash
claude
```
Opens in browser for authentication. Free tier available.

**In VS Code:** Claude Code also works inside the VS Code terminal.

---

## 2. OpenCode (replaces Gemini CLI in this stack)

**What it is:** Multi-provider terminal agent — works with Claude, local Ollama, or other providers, all free.
**Binary:** Already installed at `~/.local/bin/opencode`
**Run:** `opencode` (alias: `oc`)

**Switch provider:** Edit `~/.config/opencode/config.json`:
```json
{
  "provider": "anthropic",
  "model": "claude-sonnet-4-6"
}
```
Set `"provider": "ollama"` and `"model": "llama3.2"` for fully offline use.

---

## 3. Ollama — Local LLM Runtime (sandbox-only)

**Install:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```
Runs entirely inside the DevPod container — never on your host machine, so it doesn't violate your "no local LLM installs" rule at the host level.

**Current version (verified 19 July 2026):** v0.32.1

**Pull a model:**
```bash
ollama pull llama3.2          # ~2GB — general use
ollama pull qwen2.5-coder     # ~4GB — coding specialist
```

**Given 8GB RAM in the sandbox:** `llama3.2` and `qwen2.5-coder` are the practical limits. Check headroom first: `free -h`

---

## 4. Open WebUI — Browser GUI for Ollama

**Current pinned version (verified 19 July 2026):** `v0.9.5` — the previous pin (`v0.5.21`) was several releases behind.

**Install (via Docker):**
```bash
docker run -d \
  --name open-webui \
  --restart always \
  -p 3000:8080 \
  -v open-webui:/app/backend/data \
  --add-host=host.docker.internal:host-gateway \
  ghcr.io/open-webui/open-webui:v0.9.5
```
**Open:** http://localhost:3000
**Note:** Pin the version tag — never use `:latest` or `:main`. Check https://github.com/open-webui/open-webui/releases before bumping.

---

## 5. Continue (VS Code extension)

**Install in VS Code:** Extensions panel → search `Continue`
**Config:** `~/.continue/config.json` — switch between Claude, local Ollama, or others by editing one field.

---

## 6. Cline (VS Code extension)

**Install:** Extensions panel → search `Cline`
**Uses:** Claude Sonnet via API key — free tier available.

---

## 7. Aider — command-line pair programmer (Python version note)

**Constraint:** Aider requires `Python <3.13, >=3.10`. If your sandbox's `python3 --version` reports 3.13 or newer, a plain `pip install aider-chat` will fail.

**Safe install path (doesn't touch the system interpreter):**
```bash
curl https://pyenv.run | bash
pyenv install 3.12.8
pyenv virtualenv 3.12.8 aider-env
pyenv activate aider-env
pip install aider-chat
```

---

## MCP servers (Model Context Protocol)

MCP servers extend AI tools with access to your real data — files, GitHub, browser, etc.

| MCP Server | Purpose | How to connect |
|---|---|---|
| Filesystem MCP | Read/write your local files | Built into Claude Code |
| GitHub MCP | Read issues, PRs, repos | `npx @modelcontextprotocol/server-github` |
| Memory MCP | Persistent AI memory across sessions | `npx @modelcontextprotocol/server-memory` |
| Context7 MCP | Up-to-date library documentation | Connected via Claude.ai settings |
| Cloudflare MCP | Manage Cloudflare Workers/Pages/D1 | Connected via Claude.ai settings |
| zs-note MCP | ZarishNote repo access | Connected via Claude.ai settings |

**To configure MCP in Claude Code:** Edit `~/.claude/mcp_settings.json` (created automatically on first run).
**To configure MCP in Continue:** Edit `~/.continue/config.json` under the `mcpServers` key.

---

## Switching between AI providers

| Tool | Config file | Line to change |
|---|---|---|
| OpenCode | `~/.config/opencode/config.json` | `"provider"` field |
| Continue | `~/.continue/config.json` | `"models"` array |
| Cline | VS Code settings | API key field |
| Ollama | No config needed | `ollama run <model>` |

No tool in this stack requires a paid subscription. All have genuine free tiers or are fully self-hosted.
