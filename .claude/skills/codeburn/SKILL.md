---
name: codeburn
description: >
  Track and visualize AI token spend across all AI coding assistants (Claude,
  Codex, GPT-4, Gemini, Copilot, Cursor, and 38 more). Shows cost per
  session, per provider, per project. Use when the user says "show AI costs",
  "how much am I spending on tokens", "token usage", "codeburn", or wants to
  see where AI budget is going.
license: MIT
---

# CodeBurn — See Where Your AI Spend Goes

Tracks and visualizes AI token costs across 41 integrations — Claude Code,
Cursor, Copilot, Codex, Gemini CLI, and more — in a unified dashboard.

## Interfaces

| Mode | Command | Description |
|---|---|---|
| Terminal TUI | `npx codeburn` | Live dashboard in the terminal |
| Web dashboard | `npx codeburn web` | Browser UI at localhost |
| Desktop app | Download from GitHub | Native menubar + tray app |
| Menubar (macOS) | `codeburn menubar` | Always-on cost in the menu bar |

## Quick start

```bash
npx codeburn          # terminal dashboard — no install needed
```

Or install globally:
```bash
npm install -g codeburn
codeburn              # TUI
codeburn web          # web dashboard
```

## What it tracks

- **Per-session cost** — exactly how much each coding session cost
- **Per-provider breakdown** — Claude vs. GPT vs. Gemini etc.
- **Per-project** — which codebases are eating the most tokens
- **Trends** — daily/weekly/monthly spend over time
- **Model comparison** — which model gives best cost/quality ratio

## Desktop downloads

- macOS Apple Silicon: `CodeBurn-{version}-arm64.dmg`
- macOS Intel: `CodeBurn-{version}.dmg`
- Windows: Microsoft Store or `.msi` menubar app
- Linux: `.deb`, `.rpm`, or `.AppImage`

All from: https://github.com/getagentseal/codeburn/releases

## Supported providers (41 integrations)

Claude Code, Cursor, GitHub Copilot, Codex CLI, Gemini CLI, Aider,
OpenCode, Cline, Continue, Goose, OpenHands, Windsurf, Zed, and more.

## When to use

- Monthly AI bill arrived and you don't know what caused the spike
- Comparing Claude vs. GPT-4 cost for the same tasks
- Setting team token budgets
- Understanding cost per feature/project

## Source
https://github.com/getagentseal/codeburn — MIT
Recipient: Claude for Open Source program
