# subagent-driven-development

Use focused agents for implementation and review instead of one bloated chat.

## When to use
When a task is complex enough that a single chat session would accumulate too much context, causing quality degradation.

## Process
1. Plan: in the main session, define the task boundary and the acceptance criteria.
2. Implement: spawn a focused subagent with only the context it needs. Let it implement.
3. Review: spawn a separate review agent to inspect the output for correctness and quality.
4. Integrate: pull the reviewed output back into the main session.
5. Verify: run tests in the main session.

## Rules
- Each subagent gets exactly the context it needs, nothing more.
- Never let a subagent make decisions outside its defined scope.
- Always run final verification in the main session.

## Source
Superpowers (obra/superpowers)
