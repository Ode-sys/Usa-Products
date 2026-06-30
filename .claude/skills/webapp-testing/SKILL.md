# webapp-testing

Test web apps through realistic browser flows and UI checks.

## When to use
After building or changing a web UI, or before shipping to verify the critical user journeys work end-to-end in a real browser.

## Process
1. List the critical user journeys (login, checkout, form submission, etc.).
2. Write Playwright or Cypress tests for each journey.
3. Run tests in a headless browser against the local dev server.
4. Check: navigation, form validation, error states, loading states, mobile viewport.
5. Report failures with screenshot evidence.

## Defaults
- Use Playwright with Chromium.
- Test the golden path first, then error paths.
- Assert on visible text and ARIA roles, not implementation details.

## Source
Anthropic (anthropics/skills)
