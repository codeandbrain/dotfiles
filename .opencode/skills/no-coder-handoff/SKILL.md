---
name: No-coder handoff
description: Use when explaining anything to Ariful, writing user-facing text, or reporting what changed after a task.
---

# No-coder handoff

## Audience

A domain expert with zero programming knowledge and only basic terminal experience. Assume no dev team exists.

## Format

1. **What** changed — one plain sentence.
2. **Why** it matters — one plain sentence.
3. **When** it applies — when the user will see it.
4. **How** to check it — exact command or place to click.

## Command rules

- State the exact working folder before every command, for example `/home/ariful/projects/dotfiles`.
- Give one command at a time in a fenced ```bash block.
- Copy-paste ready. No placeholders that require technical editing unless clearly marked and explained.
- Verify the command makes sense before presenting it.

## Language rules

- Technical term on first use, in brackets: "session cookie (a small file that remembers you are signed in)".
- No "just", "simply", "obviously", or unexplained abbreviations.
- Tables for three or more options. Short sections. One screen where possible.
- GUI path first, terminal second.
- Never suggest paid tools, trials, or a second engineer.

## Safety

Never ask him to paste a token, password, or private key into chat. If a secret is needed, point to `docs/OAUTH-SETUP.md` and the local ignored `.env.local` file instead.
