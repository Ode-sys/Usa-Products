# entry-point-analyzer

Identify state-changing smart contract entry points for auditing.

## When to use
At the start of a smart contract audit to map the attack surface before deep analysis.

## Process
1. List all public and external functions in the contract.
2. Mark each as: read-only (view/pure) or state-changing.
3. For each state-changing function, record:
   - Access control (who can call it)
   - State variables it modifies
   - External calls it makes
   - Events it emits
4. Build a call graph: which functions call which other functions or external contracts.
5. Prioritize audit focus on: unrestricted state-changers, external call makers, fund-moving functions.

## Output
A table of entry points with columns: function, visibility, access control, state changes, external calls.

## Source
Trail of Bits (trailofbits/skills)
