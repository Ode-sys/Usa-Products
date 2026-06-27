# systematic-debugging

Reproduce the issue, isolate root cause, fix, then verify evidence.

## When to use
When a bug is reported or a test fails and the cause is not immediately obvious.

## Process
1. Reproduce: create the smallest possible reproduction case. Confirm it fails reliably.
2. Isolate: add logging or breakpoints to narrow the failure to one function or one data path.
3. Hypothesize: state one specific root cause hypothesis before changing any code.
4. Fix: make the minimal change that addresses the root cause.
5. Verify: run the reproduction case and the full test suite. Confirm both pass.
6. Document: write a one-sentence explanation of what was wrong and why.

## Rules
- Fix root causes, not symptoms.
- Do not change multiple things at once.
- Never mark a bug fixed without running the reproduction case.

## Source
Superpowers pattern (obra/superpowers)
