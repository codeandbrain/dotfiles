# tools/ai-setup.md
## ZarishSphere — Multi-AI Tool Setup

**Principle:** Every AI tool here is free, open-source, and vendor-switchable.  
**GUI first:** Every tool listed has a GUI path. Terminal is secondary.  
**No lock-in:** All config files are in this repo. Switching AI providers = changing one line.

---

## The AI stack for ZarishSphere

| Layer | Tool | What it does | Free? | Offline? |
|---|---|---|---|---|
| Coding agent (terminal) | Claude Code | Full codebase understanding, file editing, terminal control | Free tier | No |
| Coding agent (terminal) | Gemini CLI | Google's terminal coding agent | Free tier | No |
| Coding agent (terminal) | OpenCode | Multi-provider terminal agent | Free | No |
| Coding agent (VS Code) | Cline | Claude/GPT-powered VS Code agent | Free tier | No |
| Coding agent (VS Code) | Continue | Open-source AI coding in VS Code | Free | Optional |
| Local LLM runtime | Ollama | Runs LLMs on your own machine | Free | YES |
| Local LLM UI | Open WebUI | Browser GUI for Ollama | Free | YES |
| AI writing (desktop) | Moraya | Already installed (AppImage) | Free | Partial |
| AI writing (ZarishSphere) | ZarishNote | Under development | Free | YES (Plane 0) |

---

## 1. Claude Code

**What it is:** Anthropic's terminal agent. Reads your entire codebase, writes code, runs commands.  
**Install:**
```bash
npm install -g @anthropic-ai/claude-code
```
**First run:**
```bash
claude
```
Opens in browser for authentication. Free tier available.

**In VS Code:** Claude Code also works inside VS Code terminal.

---

## 2. Gemini CLI

**What it is:** Google's terminal agent. Similar to Claude Code.  
**Install:**
```bash
npm install -g @google/gemini-cli
```
**First run:**
```bash
gemini
```
**Config file location:** `~/.gemini/`  
**Free tier:** Gemini 2.0 Flash — 60 requests/minute, 1500/day.

---

## 3. OpenCode

**What it is:** Multi-provider terminal agent — works with Claude, Gemini, OpenAI, or local Ollama.  
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

## 4. Ollama — Local LLM Runtime (Plane 0 compatible)

**What it is:** Runs AI models entirely on your machine. No internet required after model download.  
**Install:**
```bash
curl -fsSL https://ollama.com/install.sh | sh
```
**Pull a model:**
```bash
ollama pull llama3.2          # 2GB — general use
ollama pull phi4              # 9GB — better quality, needs more RAM
ollama pull mistral           # 4GB — good balance
ollama pull qwen2.5-coder     # 4GB — coding specialist
```

**Given 7GB RAM:** `llama3.2` and `qwen2.5-coder` are the practical limits.  
**Check RAM before pulling:** `free -h`

---

## 5. Open WebUI — Browser GUI for Ollama

**What it is:** A ChatGPT-style browser interface for your local Ollama models.  
**Zero internet required after setup.**

**Install (via Docker — requires Docker first):**
```bash
docker run -d \
  --name open-webui \
  --restart always \
  -p 3000:8080 \
  -v open-webui:/app/backend/data \
  --add-host=host.docker.internal:host-gateway \
  ghcr.io/open-webui/open-webui:v0.5.21
```
**Open:** http://localhost:3000  
**Note:** Pin the version tag — never use `latest`.

---

## 6. Continue (VS Code extension)

**What it is:** Open-source AI coding assistant inside VS Code. Works with Claude, Gemini, or local Ollama.  
**Install in VS Code:**
1. Open VS Code
2. Press `Ctrl+Shift+X` (Extensions panel)
3. Search: `Continue`
4. Install: `Continue - Codestral, Claude, and more`

**Config:** `~/.continue/config.json`  
Switch between Claude, Gemini, or local Ollama by editing one field.

---

## 7. Cline (VS Code extension)

**What it is:** Claude-native VS Code agent. Can edit files, run terminal commands, browse the web.  
**Install:** Extensions panel → search `Cline`  
**Uses:** Claude Sonnet via API key — free tier available.

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

**To configure MCP in Claude Code:**  
Edit `~/.claude/mcp_settings.json` (created automatically on first run).

**To configure MCP in Continue:**  
Edit `~/.continue/config.json` under the `mcpServers` key.

---

## Switching between AI providers

The multi-AI setup is designed so that changing your primary AI is one edit:

| Tool | Config file | Line to change |
|---|---|---|
| OpenCode | `~/.config/opencode/config.json` | `"provider"` field |
| Continue | `~/.continue/config.json` | `"models"` array |
| Cline | VS Code settings | API key field |
| Ollama | No config needed | `ollama run <model>` |

No tool in this stack requires a paid subscription to function. All have genuine free tiers or are fully self-hosted.
