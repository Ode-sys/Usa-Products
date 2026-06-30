# agentic-actions-auditor

Audit GitHub Actions workflows for agent-related security issues.

## When to use
Before merging a PR that modifies `.github/workflows/`, or when reviewing a third-party workflow.

## Checks
1. **Untrusted input injection**: does the workflow use `${{ github.event.pull_request.title }}` or similar in `run:` steps without sanitization?
2. **Excessive permissions**: does the workflow request `write-all` or `contents: write` without justification?
3. **Third-party actions**: are actions pinned to a commit SHA, not a mutable tag?
4. **Secret exposure**: are secrets printed to logs or passed to untrusted steps?
5. **Self-hosted runners**: are they used for public repos (RCE risk)?
6. **Workflow triggers**: does `pull_request_target` run untrusted code from a fork?

## Output
A findings list with severity (Critical / High / Medium / Low) and remediation for each issue.

## Source
Trail of Bits (trailofbits/skills)
