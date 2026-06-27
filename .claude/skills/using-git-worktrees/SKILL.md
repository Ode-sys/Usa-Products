# using-git-worktrees

Run parallel development branches without corrupting the main workspace.

## When to use
When you need to work on two or more features simultaneously, or when running a long-running agent on one branch while keeping the main branch clean.

## Process
1. Create a new worktree: `git worktree add <path> -b <branch-name>`
2. Work in the worktree path. Changes are isolated from the main working tree.
3. Run tests inside the worktree to verify without affecting main.
4. When done, merge or PR from the branch, then remove the worktree: `git worktree remove <path>`
5. Prune stale worktree references: `git worktree prune`

## Rules
- Never share unsaved file state between worktrees.
- Always clean up worktrees when the branch is merged or abandoned.
- Use descriptive branch names that match the worktree path.

## Source
Superpowers (obra/superpowers)
