# audit-context-building

Build deep architectural context before making security claims.

## When to use
At the start of any security audit, before making findings or recommendations.

## Process
1. Read the README, architecture docs, and threat model if they exist.
2. Map the trust boundaries: what data enters from outside, what leaves.
3. Identify: authentication mechanism, authorization model, cryptographic operations, external dependencies.
4. List all data stores and their sensitivity level.
5. Trace the most critical data flows end-to-end (e.g., payment flow, auth flow).
6. Document assumptions made and questions that need answering.

## Output
An architecture summary with:
- Trust boundary diagram (text-based)
- Critical data flows
- Known unknowns list
- Preliminary risk ranking of components

## Rules
- Never make a vulnerability claim without understanding the surrounding context.
- Document what you do NOT know, not just what you know.

## Source
Trail of Bits (trailofbits/skills)
