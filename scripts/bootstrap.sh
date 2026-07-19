#!/usr/bin/env bash
# =============================================================================
# bootstrap.sh
# ZarishSphere Foundation — Machine Setup Script
# codeandbrain/dotfiles
#
# PURPOSE:
#   Install and configure the complete ZarishSphere development environment
#   inside a DevPod sandbox (Ubuntu base image). Never run this directly
#   against your host OS — it is meant to run inside the DevPod container.
#
# USAGE:
#   bash ~/dotfiles/scripts/bootstrap.sh
#
# VERSIONS LAST VERIFIED: 19 July 2026 (see tools/manifest.md for sources
# and any known conflicts before changing pins here)
# =============================================================================

set -euo pipefail

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

log_section() { echo -e "\n${CYAN}════════════════════════════════════════${NC}"; echo -e "${CYAN}  $1${NC}"; echo -e "${CYAN}════════════════════════════════════════${NC}"; }
log_ok()      { echo -e "  ${GREEN}✓${NC} $1"; }
log_skip()    { echo -e "  ${YELLOW}→${NC} $1 [already installed — skipping]"; }
log_warn()    { echo -e "  ${YELLOW}⚠${NC} $1"; }
log_error()   { echo -e "  ${RED}✗${NC} $1"; }
log_manual()  { echo -e "  ${BLUE}◆ MANUAL STEP:${NC} $1"; }

# =============================================================================
# PINNED VERSIONS — verified 19 July 2026, change here to upgrade a tool
# =============================================================================
GO_VERSION="1.26.5"
GH_VERSION="2.96.0"
NODE_VERSION="24"
DEV_POD_VERSION="0.6.15"
# Ollama: install script pulls latest stable — acceptable for self-hosted tools
# Gemini CLI: REMOVED. Free tier discontinued 18 Jun 2026 — see tools/manifest.md.
# Aider: requires Python <3.13. If system python3 is 3.13+, install via a
#   pyenv-managed 3.12 venv instead — do not touch the system interpreter.

# =============================================================================
# §1 — SYSTEM PACKAGES (apt)
# =============================================================================
log_section "§1 — System packages"

sudo apt update -qq
sudo apt install -y \
    git \
    curl \
    wget \
    nano \
    unzip \
    tree \
    build-essential \
    ca-certificates \
    gnupg \
    lsb-release \
    apt-transport-https \
    software-properties-common \
    python3 \
    python3-pip \
    python3-venv \
    pipx \
    xclip \
    jq

log_ok "System packages installed"

# =============================================================================
# §2 — GO LANGUAGE RUNTIME
# =============================================================================
log_section "§2 — Go $GO_VERSION"

if command -v go &>/dev/null && go version | grep -q "go${GO_VERSION}"; then
    log_skip "Go $GO_VERSION"
else
    log_warn "Installing Go $GO_VERSION..."
    cd /tmp
    wget -q "https://go.dev/dl/go${GO_VERSION}.linux-amd64.tar.gz" \
        -O "go${GO_VERSION}.linux-amd64.tar.gz"
    sudo rm -rf /usr/local/go
    sudo tar -C /usr/local -xzf "go${GO_VERSION}.linux-amd64.tar.gz"
    rm "go${GO_VERSION}.linux-amd64.tar.gz"
    cd "$HOME"
    log_ok "Go $GO_VERSION installed to /usr/local/go"
fi

mkdir -p "$HOME/go/bin"
log_ok "Go workspace: ~/go"

# =============================================================================
# §3 — NODE.JS via nvm
# =============================================================================
log_section "§3 — Node.js $NODE_VERSION (Active LTS)"

export NVM_DIR="$HOME/.nvm"

if [ -d "$NVM_DIR" ]; then
    log_skip "nvm"
    \. "$NVM_DIR/nvm.sh"
else
    log_warn "Installing nvm..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.5/install.sh | bash
    \. "$NVM_DIR/nvm.sh"
    log_ok "nvm installed"
fi

# Always take the latest patch of the LTS line rather than hardcoding a
# specific patch number — Node 24.x ships security patches ~monthly.
nvm install "$NODE_VERSION" --lts
nvm use "$NODE_VERSION"
nvm alias default "$NODE_VERSION"
log_ok "Node.js $(node --version) installed"

# =============================================================================
# §4 — pnpm
# =============================================================================
log_section "§4 — pnpm (requires Node >=22 — satisfied by Node $NODE_VERSION)"

if command -v pnpm &>/dev/null; then
    log_skip "pnpm $(pnpm --version)"
else
    npm install -g pnpm
    log_ok "pnpm installed"
fi

# =============================================================================
# §5 — GITHUB CLI (gh) — tarball install
# =============================================================================
log_section "§5 — GitHub CLI $GH_VERSION"

GH_BIN="$HOME/.local/bin/gh"

if [ -f "$GH_BIN" ] && "$GH_BIN" version 2>/dev/null | grep -q "$GH_VERSION"; then
    log_skip "gh $GH_VERSION"
else
    log_warn "Installing gh $GH_VERSION..."
    mkdir -p "$HOME/.local/bin"
    cd /tmp
    wget -q "https://github.com/cli/cli/releases/download/v${GH_VERSION}/gh_${GH_VERSION}_linux_amd64.tar.gz" \
        -O "gh_${GH_VERSION}_linux_amd64.tar.gz"
    tar -xzf "gh_${GH_VERSION}_linux_amd64.tar.gz"
    cp "gh_${GH_VERSION}_linux_amd64/bin/gh" "$HOME/.local/bin/gh"
    chmod +x "$HOME/.local/bin/gh"
    rm -rf "gh_${GH_VERSION}_linux_amd64"*
    cd "$HOME"
    log_ok "gh $GH_VERSION installed to ~/.local/bin/gh"
fi

# =============================================================================
# §6 — CHEZMOI (dotfiles manager)
# =============================================================================
log_section "§6 — chezmoi"

if command -v chezmoi &>/dev/null; then
    log_skip "chezmoi $(chezmoi --version | head -1)"
else
    sh -c "$(curl -fsLS get.chezmoi.io)" -- -b "$HOME/.local/bin"
    log_ok "chezmoi installed to ~/.local/bin"
fi

# =============================================================================
# §7 — DOCKER ENGINE
# =============================================================================
log_section "§7 — Docker Engine"

if command -v docker &>/dev/null; then
    log_skip "Docker $(docker --version)"
else
    log_warn "Installing Docker Engine..."
    sudo apt remove -y docker docker-engine docker.io containerd runc 2>/dev/null || true

    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
        sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    echo \
        "deb [arch=$(dpkg --print-architecture) \
        signed-by=/etc/apt/keyrings/docker.gpg] \
        https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" | \
        sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt update -qq
    # Deliberately NOT pinning a docker-ce point release here — apt will
    # always resolve the current stable 29.x build, which stays inside
    # security-patch range without a manual bump each time.
    sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

    sudo usermod -aG docker "$USER"

    log_ok "Docker installed"
    log_warn "IMPORTANT: Log out and back in for docker group to take effect"
    log_warn "  Or run: newgrp docker"
fi

# =============================================================================
# §7.5 — DEVPOD
# =============================================================================
log_section "§7.5 — DevPod $DEV_POD_VERSION"

if command -v devpod &>/dev/null; then
    log_skip "DevPod"
else
    log_warn "Installing DevPod..."
    DEV_POD_URL="https://github.com/loft-sh/devpod/releases/download/v${DEV_POD_VERSION}/devpod_linux_amd64.AppImage"
    DEV_POD_PATH="$HOME/.local/bin/devpod"

    mkdir -p "$(dirname "$DEV_POD_PATH")"
    wget -q "$DEV_POD_URL" -O "$DEV_POD_PATH"
    chmod +x "$DEV_POD_PATH"
    log_ok "DevPod installed to $DEV_POD_PATH"
    log_manual "Run: devpod ui & to start the DevPod UI"
fi

# =============================================================================
# §8 — SSH KEY (GitHub authentication)
# =============================================================================
log_section "§8 — SSH Key"

SSH_KEY="$HOME/.ssh/id_ed25519"

if [ -f "$SSH_KEY" ]; then
    log_skip "SSH key already exists at $SSH_KEY"
else
    log_warn "Generating SSH key..."
    mkdir -p "$HOME/.ssh"
    chmod 700 "$HOME/.ssh"
    ssh-keygen -t ed25519 \
        -C "code.and.brain@gmail.com" \
        -f "$SSH_KEY" \
        -N ""
    eval "$(ssh-agent -s)"
    ssh-add "$SSH_KEY"
    log_ok "SSH key generated: $SSH_KEY"
fi

echo ""
log_manual "Add your SSH public key to GitHub:"
echo ""
echo "     ┌─────────────────────────────────────────────────────────────┐"
cat "$SSH_KEY.pub" | sed 's/^/     │  /'
echo "     └─────────────────────────────────────────────────────────────┘"
echo ""
log_manual "  1. Open in browser: https://github.com/settings/ssh/new"
log_manual "  2. Title: lenovo-ubuntu-sandbox"
log_manual "  3. Key type: Authentication Key"
log_manual "  4. Paste the key → Save"
log_manual "  5. Then run: ssh -T git@github.com"
log_manual "  6. Then run: gh auth login"

# =============================================================================
# §9 — AI TOOLS
# =============================================================================
log_section "§9 — AI Tools"

# --- Claude Code ---
if command -v claude &>/dev/null; then
    log_skip "Claude Code"
else
    log_warn "Installing Claude Code..."
    npm install -g @anthropic-ai/claude-code@latest
    log_ok "Claude Code installed"
fi

# --- Gemini CLI: REMOVED ---
# Free tier discontinued 18 June 2026; replacement (Antigravity CLI) requires
# a paid Google AI Pro subscription. See tools/manifest.md flag #1.
log_warn "Gemini CLI skipped — free tier discontinued, see tools/manifest.md"

# --- Ollama ---
if command -v ollama &>/dev/null; then
    log_skip "Ollama"
else
    log_warn "Installing Ollama (local LLMs, sandbox-only)..."
    curl -fsSL https://ollama.com/install.sh | sh
    log_ok "Ollama installed"
    log_manual "Pull a model after install: ollama pull llama3.2"
fi

# --- OpenCode: already installed at ~/.local/bin/opencode ---
if command -v opencode &>/dev/null; then
    log_skip "OpenCode (already at ~/.local/bin)"
else
    log_warn "OpenCode not found — download from https://opencode.ai and place in ~/.local/bin"
fi

# --- Aider: needs Python <3.13. Isolate via pyenv if system python3 is 3.13+ ---
PY_VER="$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")' 2>/dev/null || echo "unknown")"
if [[ "$PY_VER" > "3.12" ]] || [[ "$PY_VER" == "unknown" ]]; then
    log_warn "System python3 is $PY_VER — Aider requires <3.13."
    log_manual "Install a 3.12 interpreter via pyenv and create a dedicated venv for Aider:"
    log_manual "  curl https://pyenv.run | bash"
    log_manual "  pyenv install 3.12.8 && pyenv virtualenv 3.12.8 aider-env"
    log_manual "  pyenv activate aider-env && pip install aider-chat"
    log_manual "This keeps the system python3 untouched, per your no-machine-changes rule."
else
    if command -v aider &>/dev/null; then
        log_skip "Aider"
    else
        pip install aider-chat --break-system-packages
        log_ok "Aider installed"
    fi
fi

# =============================================================================
# §10 — VS CODE EXTENSIONS
# =============================================================================
log_section "§10 — VS Code Extensions"

if ! command -v code &>/dev/null; then
    log_warn "VS Code not in PATH — skipping extensions"
    log_manual "Install extensions from tools/vscode-extensions.json via VS Code GUI"
else
    EXTENSIONS=(
        "continue.continue"
        "saoudrizwan.claude-dev"
        "github.copilot"
        "github.copilot-chat"
        "github.vscode-github-actions"
        "github.vscode-pull-request-github"
        "eamodio.gitlens"
        "golang.go"
        "ms-azuretools.vscode-docker"
        "yzhang.markdown-all-in-one"
        "davidanson.vscode-markdownlint"
        "redhat.vscode-yaml"
        "ms-vscode-remote.remote-ssh"
        "streetsidesoftware.code-spell-checker"
        "gruntfuggly.todo-tree"
        "pkief.material-icon-theme"
        "github.github-vscode-theme"
    )
    for ext in "${EXTENSIONS[@]}"; do
        code --install-extension "$ext" --force 2>/dev/null && \
            log_ok "Extension: $ext" || \
            log_warn "Skipped: $ext"
    done
fi

# =============================================================================
# §11 — ZARISHSPHERE WORKSPACE
# =============================================================================
log_section "§11 — ZarishSphere Workspace"

ZS_HOME="$HOME/zarishsphere"

if [ -d "$ZS_HOME" ]; then
    log_skip "~/zarishsphere/ already exists"
else
    mkdir -p "$ZS_HOME"
    log_ok "Created ~/zarishsphere/"
fi

# =============================================================================
# SUMMARY
# =============================================================================
log_section "Setup Complete"

echo -e "  ${GREEN}Machine setup complete.${NC}"
echo ""
echo -e "  ${YELLOW}REMAINING MANUAL STEPS (in this order):${NC}"
echo ""
echo -e "  ${BLUE}1.${NC} Register SSH key on GitHub (see §8 output above)"
echo -e "  ${BLUE}2.${NC} Test SSH:    ssh -T git@github.com"
echo -e "  ${BLUE}3.${NC} Auth gh CLI: gh auth login"
echo -e "  ${BLUE}4.${NC} Apply dotfiles: chezmoi init --apply https://github.com/codeandbrain/dotfiles"
echo -e "  ${BLUE}5.${NC} Reload shell: source ~/.bashrc"
echo -e "  ${BLUE}6.${NC} Verify tools: zstools"
echo -e "  ${BLUE}7.${NC} Clone ZS workspace: zsclone"
echo ""
echo -e "  ${YELLOW}DOCKER NOTE:${NC} Log out and back in to use docker without sudo"
echo -e "  ${YELLOW}AI STACK NOTE:${NC} Gemini CLI removed (see tools/manifest.md) — Claude Code, OpenCode, and Ollama remain free"
echo ""
