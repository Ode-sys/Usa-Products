# dispatching-parallel-agents

Split independent tasks across subagents to reduce context collisions.

## When to use
When a task has two or more clearly independent subtasks that do not share state or files and would benefit from parallel execution.

## Process
1. Identify the independent subtasks. Verify they touch different files or systems.
2. Write a clear, self-contained prompt for each subagent including all needed context.
3. Dispatch agents in parallel using the Agent tool.
4. Collect results and integrate them, resolving any conflicts.
5. Run the full test suite after integration.

## Rules
- Never dispatch agents that write to the same file simultaneously.
- Each agent prompt must be self-contained — no shared state through the parent context.
- Always integrate and verify after parallel agents complete.

## Source
Superpowers (obra/superpowers)
