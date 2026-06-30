# dimensional-analysis

Detect unit mismatches and formula bugs through code annotations.

## When to use
When reviewing scientific, financial, or engineering code where unit correctness matters (physics, chemistry, finance, navigation).

## Process
1. Identify all variables that carry physical or business units (meters, seconds, USD, etc.).
2. Annotate each variable with its unit in a comment or type annotation.
3. Trace through formulas: do the units on both sides of each equation match?
4. Flag: unit mismatches, implicit unit conversions, constants without unit documentation.
5. Suggest: typed unit libraries (pint for Python, unitful for Julia) where appropriate.

## Common bugs to find
- Mixing degrees and radians in trig functions
- Timestamps in seconds vs milliseconds
- Currency amounts without denomination tracking
- Pixel vs viewport unit confusion in UI code

## Source
Trail of Bits (trailofbits/skills)
