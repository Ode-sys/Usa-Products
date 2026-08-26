---
name: graphify
description: >
  Map any codebase (code, docs, PDFs, images, video) into a queryable
  knowledge graph using tree-sitter AST — no embeddings, no vector store,
  real graph traversal. Use when the user needs to understand a large
  codebase, trace how two things connect, find god nodes, or understand
  community structure. Trigger: "/graphify", "map this codebase",
  "build a knowledge graph", "graphify", "how does X connect to Y",
  "what's the architecture of this project".
license: MIT
---

# Graphify — Knowledge Graph for Codebases

Maps your entire project into a knowledge graph you can query instead of
grepping through files.

- Code is parsed with **tree-sitter AST**: deterministic, no LLM, nothing
  leaves your machine.
- Every edge is tagged `EXTRACTED` (explicit in source) or `INFERRED`
  (resolved by graphify) — you know what was read vs. inferred.
- Not a vector index: a real graph you traverse.

## Install

```bash
uv tool install graphifyy      # note: double-y on PyPI
# or
pipx install graphifyy
```

## Build the graph

```bash
graphify install               # register the skill with your AI assistant
graphify .                     # map the current directory
```

Output in `graphify-out/`:
```
graphify-out/
├── graph.html       open in browser — click nodes, filter, search
├── GRAPH_REPORT.md  highlights: key concepts, surprising connections, questions
└── graph.json       full graph — query anytime without re-reading files
```

## Query the graph

```bash
graphify explain "APIRouter"      # deep-dive into one concept
graphify path "FastAPI" "ModelField"  # trace shortest path between two things
graphify query "how does auth work"   # plain-language question → subgraph
```

Example output:
```
$ graphify path "FastAPI" "ModelField"
Shortest path (3 hops):
  FastAPI --uses--> DefaultPlaceholder <--references-- get_request_handler() --references--> ModelField
```

## Keep graph current

```bash
graphify update .     # re-parse after code changes (AST-only, no API cost, fast)
```

## Workflow with AI assistant

After `graphify install`, type `/graphify .` in your AI assistant to:
1. Build the graph for the current project
2. The assistant then reads `graphify-out/GRAPH_REPORT.md` for architecture overview
3. Subsequent questions resolve against `graph.json` instead of raw files

**Rules (auto-injected via AGENTS.md):**
- Before answering architecture/codebase questions → read `graphify-out/GRAPH_REPORT.md`
- If `graphify-out/wiki/index.md` exists → navigate it instead of raw files
- After modifying code → run `graphify update .` to keep graph current

## What you get

| Capability | Description |
|---|---|
| God nodes | Most-connected concepts — what everything flows through |
| Communities | Subsystems detected by Leiden algorithm, LLM-free labels |
| Cross-file links | `calls` / `imports` / `inherits` / `mixes_in` across ~40 languages |
| Query / path / explain | Plain-language or precise graph traversal |
| Rationale nodes | `# NOTE:` / `# WHY:` comments and ADR citations as first-class nodes |
| Beyond code | Docs, PDFs, images, video map into the same graph |
| Local-first | Code via tree-sitter (no LLM); semantic pass over docs only if configured |

## Benchmarks

| Benchmark | Metric | graphify | Best alternative |
|---|---|---|---|
| LOCOMO (n=300) | recall@10 | **0.497** | supermemory 0.149 |
| LOCOMO (n=300) | QA accuracy | 45.3% | mem0 27.3% |
| LongMemEval-S (n=50) | QA accuracy | **76%** | tied with dense RAG |
| Graph build | LLM credits | **0** | per-token for most |

## Source
https://github.com/Graphify-Labs/graphify — MIT · YC S26
