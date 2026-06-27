# theme-factory

Generate reusable color, typography, and component theme directions.

## When to use
When starting a new product, rebranding, or when the design system needs a coherent visual language.

## Process
1. Gather inputs: brand keywords, target audience, existing assets if any.
2. Generate a color palette: primary, secondary, neutral, semantic (success/warning/error).
3. Define a type scale: font family choices, size steps (xs through 4xl), line heights.
4. Define component tokens: border radius, shadow levels, spacing unit.
5. Output as CSS custom properties or a Tailwind config extension.
6. Provide a one-page preview HTML showing the theme applied.

## Output formats
- CSS custom properties (`:root { --color-primary: ... }`)
- Tailwind `theme.extend` config
- JSON design tokens

## Source
Anthropic (anthropics/skills)
