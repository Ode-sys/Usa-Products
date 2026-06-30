# git-cleanup

Clean worktrees, branches, and repo state safely with confirmation gates.

## When to use
When the repo has accumulated stale branches, orphaned worktrees, or large files that bloat history.

## Process
1. List merged branches: `git branch --merged main`
2. Confirm with user before deleting any branch.
3. Remove merged local branches: `git branch -d <branch>`
4. Remove stale remote tracking refs: `git remote prune origin`
5. List and remove orphaned worktrees: `git worktree list`, `git worktree remove <path>`
6. Optionally run `git gc --aggressive` to compact the object store.

## Safety rules
- Never delete unmerged branches without explicit user confirmation.
- Never force-delete (`-D`) without showing the user what commits would be lost.
- Always `prune` before deleting remote tracking branches.

## Source
Trail of Bits (trailofbits/skills)
