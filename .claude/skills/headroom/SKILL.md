---
name: headroom
description: >
  Compress tool outputs, logs, files, RAG chunks, and conversation history
  before they reach the LLM — 60–95% fewer tokens on JSON data, 15–20% on
  coding sessions. Use when context is bloated, token costs are high, or
  tool outputs are noisy. Also when the user says "compress context",
  "save tokens", "headroom", or when a session is hitting context limits.
license: Apache-2.0
---

# Headroom — Context Compression Layer

Headroom compresses everything the agent reads before it hits the model.
Same answers, fraction of the tokens.

## What it does

- **Library** — `compress(messages)` inline in Python or TypeScript
- **Proxy** — `headroom proxy --port 8787`, zero code changes, any language
- **Agent wrap** — `headroom wrap claude|codex|cursor|aider|opencode|cline` in one command
- **MCP server** — `headroom_compress`, `headroom_retrieve`, `headroom_stats` tools
- **Cross-agent memory** — shared store across Claude, Codex, Gemini, auto-dedup
- **`headroom learn`** — mines failed sessions, writes corrections to `CLAUDE.local.md`
- **Reversible (CCR)** — originals cached; model can retrieve on demand

## Install

```bash
# Python
pip install headroom-ai          # add [all] for every optional extra

# TypeScript / Node
npm install headroom-ai

# Wrap Claude Code (one command, undo with headroom unwrap claude)
headroom wrap claude
```

## Quick start

```python
from headroom_ai import Headroom

hr = Headroom()

messages = [
    {"role": "user", "content": "Analyze this log:\n" + big_log_string},
]
compressed = hr.compress(messages)
# Pass compressed to your LLM — same answer, fewer tokens
response = anthropic.messages.create(model="claude-opus-5", messages=compressed)
```

## Proxy mode (zero code changes)

```bash
headroom proxy --port 8787
# Then point any client at http://127.0.0.1:8787
# Works with OpenAI SDK, Anthropic SDK, LiteLLM, etc.
```

## MCP server (Claude Code / Cursor)

```bash
# Add to Claude Code
claude mcp add headroom -- headroom mcp
```

Available tools once added:
- `headroom_compress` — compress a payload before sending
- `headroom_retrieve` — retrieve original from CCR store
- `headroom_stats` — show compression stats for the session

## Compression pipeline

1. **Content-type routing** — detects JSON, code, logs, diffs, text automatically
2. **Per-type compressors**:
   - JSON/arrays: SmartCrusher (70–90% reduction)
   - Code: AST-aware via tree-sitter (preserves imports, signatures, types)
   - Logs/text: Pattern deduplication, noise removal
3. **CCR store** — compressed form is cached; original retrievable on demand

## Benchmarks

| Content type | Token reduction |
|---|---|
| JSON tool outputs | 70–90% |
| Build logs | 60–80% |
| Code files | 40–60% |
| Text/docs | 30–50% |
| Coding agent sessions | 15–20% |

## headroom learn (failure mining)

```bash
headroom learn              # reads conversation logs, writes to CLAUDE.local.md
headroom learn --shared     # writes to CLAUDE.md (shared with team)
```

Finds patterns where the agent failed or hallucinated, writes correction
rules to the project's memory file for the next session.

## Framework integrations

```python
# Anthropic SDK
from headroom_ai.integrations import withHeadroom
import anthropic
client = withHeadroom(anthropic.Anthropic())

# LangChain
from headroom_ai.langchain import HeadroomCallbackHandler
```

## Source
https://github.com/headroomlabs-ai/headroom — Apache 2.0
