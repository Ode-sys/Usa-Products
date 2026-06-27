# fp-check

Verify whether a reported security issue is a true or false positive.

## When to use
When triaging security scanner output or reviewing audit findings before reporting them.

## Process
1. Reproduce the condition: can you construct a concrete input that triggers the issue?
2. Trace the data flow: does untrusted input actually reach the vulnerable sink?
3. Check mitigations: is there a validation, encoding, or access control that prevents exploitation?
4. Check context: is this dead code, test code, or a controlled internal API?
5. Verdict: True Positive / False Positive / Needs More Info.

## Verdict criteria
- **True Positive**: reproducible, exploitable, no mitigating control.
- **False Positive**: unreachable code path, fully mitigated, or scanner pattern misfire.
- **Needs More Info**: data flow unclear, requires runtime verification.

## Output
Verdict + evidence (code path, test case, or mitigation reference).

## Source
Trail of Bits (trailofbits/skills)
