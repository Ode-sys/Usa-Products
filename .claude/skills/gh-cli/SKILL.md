# gh-cli

Use authenticated GitHub CLI flows instead of brittle raw URL fetching.

## When to use
When interacting with GitHub from a script or agent: creating PRs, fetching issue data, triggering workflows, or querying releases.

## Common commands
```bash
# Auth
gh auth status

# PRs
gh pr create --title "..." --body "..."
gh pr list --state open
gh pr merge 123 --squash

# Issues
gh issue create --title "..." --body "..."
gh issue list --label bug

# Actions
gh run list --workflow ci.yml
gh run view 123 --log

# Releases
gh release create v1.0.0 --generate-notes
```

## Rules
- Always use `gh` over raw `curl` to the GitHub API — it handles auth automatically.
- Use `--json` flag to parse output programmatically.
- Use `gh api` for endpoints not covered by named commands.

## Source
Trail of Bits (trailofbits/skills)
