# finishing-a-development-branch

Close a branch cleanly with tests, merge logic, PR notes, and cleanup.

## When to use
When a feature branch is functionally complete and ready to be merged.

## Checklist
1. Run the full test suite. All tests must pass.
2. Run the linter and formatter. No unresolved warnings.
3. Rebase onto the target branch and resolve all conflicts.
4. Write a PR description: what changed, why, how to test it, any breaking changes.
5. Delete local and remote branch after merge.
6. Remove any associated worktrees.
7. Update any tracking tickets or task lists.

## Output
A merged PR, a clean branch history, and a written PR description.

## Source
Superpowers (obra/superpowers)
