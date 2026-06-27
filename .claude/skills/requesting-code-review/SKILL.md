# requesting-code-review

Force a review pass before merge, release, or client delivery.

## When to use
Before merging a PR, shipping a release, or delivering code to a client. Also useful after a large refactor.

## Process
1. Produce a diff or summary of all changes since the last stable point.
2. Ask the reviewer (human or agent) to check for: correctness, security, performance, readability, and test coverage.
3. Collect findings as a prioritized list: blocker / warning / suggestion.
4. Address all blockers before proceeding.
5. Optionally address warnings; document decisions to skip them.
6. Record that a review occurred and what was checked.

## Output
A reviewed, approved diff ready for merge or delivery.

## Source
Superpowers (obra/superpowers)
