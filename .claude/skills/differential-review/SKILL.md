# differential-review

Review code changes with security focus and git history context.

## When to use
When a PR or commit introduces changes to security-sensitive code paths.

## Process
1. Get the diff: `git diff <base>..<head>`
2. Identify security-sensitive changes: auth, crypto, input parsing, file access, network calls.
3. For each sensitive change, read the surrounding context (not just the diff lines).
4. Check git history of changed files for prior vulnerabilities or related fixes.
5. Assess: does the change introduce a new vulnerability, weaken a control, or fix one?
6. Report findings with diff line references.

## High-risk patterns to flag
- Removed validation or length check
- Changed comparison from constant-time to variable-time
- New external input flowing into a dangerous sink
- Auth check moved or removed
- New dependency added without version pinning

## Source
Trail of Bits (trailofbits/skills)
