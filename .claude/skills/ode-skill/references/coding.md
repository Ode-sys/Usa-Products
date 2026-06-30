# Domain 01: Agentic Coding & Workflow
*Source: obra/superpowers (215k stars) + Anthropic patterns*

## Skills in This Domain

### 01 · brainstorming
Refine a rough idea into a clear technical direction before writing any code.
- Extract the core problem, not the stated solution
- List 3 technical approaches with tradeoffs
- Recommend one with rationale
- Output: decision summary + chosen direction

### 02 · writing-plans
Convert an approved design into a step-by-step implementation plan.
- Break into atomic tasks (each < 2 hours)
- Define interfaces and contracts first
- Identify dependencies and blockers
- Output: numbered plan with checkpoints

### 03 · executing-plans
Execute plans with checkpoints, verification, and controlled handoffs.
- Follow the plan step by step
- Verify each step before proceeding
- Report blockers immediately
- Output: progress log + current status

### 04 · test-driven-development
Write the failing test first, implement the minimum fix, then refactor.
```
RED → GREEN → REFACTOR
1. Write failing test
2. Write minimum code to pass
3. Refactor without breaking tests
4. Repeat
```

### 05 · systematic-debugging
Reproduce → isolate → fix → verify.
```
1. Reproduce the issue reliably
2. Form hypothesis about root cause
3. Add logging/breakpoints to confirm
4. Fix the root cause (not symptoms)
5. Verify fix + add regression test
```

### 06 · dispatching-parallel-agents
Split independent tasks across subagents to reduce context collisions.
- Identify truly independent subtasks
- Define clear interfaces between agents
- Merge results with conflict resolution
- Never parallelize dependent tasks

### 07 · subagent-driven-development
Use focused agents for implementation and review.
- Agent A: implementation only
- Agent B: review and critique
- Agent C: integration and testing

### 08 · requesting-code-review
Force a review pass before merge/release.
Checklist:
- [ ] Tests pass
- [ ] Edge cases covered
- [ ] Security considerations checked
- [ ] Performance acceptable
- [ ] Documentation updated

### 09 · using-git-worktrees
Run parallel branches without corrupting main workspace.
```bash
git worktree add ../feature-branch feature/name
# work in isolation
git worktree remove ../feature-branch
```

### 10 · finishing-a-development-branch
Close a branch cleanly.
```
1. All tests green
2. PR description written
3. Changelog updated
4. Merge conflicts resolved
5. Branch deleted after merge
```

---

## Ode-Specific Patterns

**Preferred stack:** Python · TypeScript · React · Google Apps Script  
**Avoid:** over-engineering simple automations  
**Always:** build reusable, not one-off
