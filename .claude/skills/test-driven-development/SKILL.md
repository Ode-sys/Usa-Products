# test-driven-development

Write the failing test first, implement the minimum fix, then refactor.

## When to use
When adding a new feature or fixing a bug where correctness can be expressed as a test.

## Process
1. Write a failing test that describes the desired behavior. Run it to confirm it fails.
2. Write the minimum implementation code to make the test pass. No extras.
3. Run the test to confirm it passes.
4. Refactor the implementation for clarity, keeping tests green.
5. Repeat for the next behavior.

## Rules
- Never write implementation before the test exists.
- Never write more code than needed to pass the current test.
- Refactor only when tests are green.

## Source
Superpowers pattern (obra/superpowers)
