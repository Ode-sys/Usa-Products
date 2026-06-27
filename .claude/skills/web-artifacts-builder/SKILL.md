# web-artifacts-builder

Build interactive React, Tailwind, and shadcn-style prototypes quickly.

## When to use
When the user needs a working interactive prototype fast, not a full production app.

## Process
1. Confirm scope: what interactions must work, what is cosmetic only.
2. Scaffold with React + Tailwind. Use shadcn/ui primitives where available.
3. Wire up state for the critical interactive paths only.
4. Make it responsive by default.
5. Export as a self-contained artifact or codesandbox-ready bundle.

## Stack defaults
- React (functional components, hooks)
- Tailwind CSS for styling
- shadcn/ui for components
- No backend — mock data only

## Source
Anthropic (anthropics/skills)
