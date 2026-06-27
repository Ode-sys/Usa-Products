# open-notebook

Create transparent research notes, logs, and reproducible records.

## When to use
When conducting research that needs to be reproducible, auditable, or shared with collaborators.

## Structure
Each notebook entry includes:
```markdown
## [Date] — [Topic]

**Goal**: What am I trying to find out?

**Method**: What did I do?

**Result**: What did I observe?

**Interpretation**: What does it mean?

**Next step**: What should I do next?

**Code/Data**: [links or inline snippets]
```

## Principles
- Record negative results and failed experiments, not just successes.
- Link to the exact data version used (git commit, file hash, or dataset version).
- Never edit past entries — append corrections as new entries with a reference.

## Formats
- Jupyter Notebook (.ipynb) for code + prose
- Markdown files in a git repo for version control
- Obsidian vault for interconnected notes

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
