# executing-plans

Execute plans with checkpoints, verification, and controlled handoffs.

## When to use
When a written plan exists and has been approved by the user. Execute step by step, pausing at each checkpoint.

## Process
1. Read the full plan before starting any step.
2. Execute each step in order. After each step:
   - Run the relevant tests or verification command.
   - Confirm the acceptance criterion is met.
   - Report status to the user before proceeding.
3. If a step fails: stop, diagnose, report to user, do not skip ahead.
4. After all steps complete: run the full test suite and summarize what changed.

## Rules
- Never skip steps without explicit user approval.
- Never proceed past a failing verification.
- Keep each step's diff small and reviewable.

## Source
Superpowers (obra/superpowers)
