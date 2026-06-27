# mobile-design-system

Turn app screens into a consistent mobile UI language.

## When to use
When an app has multiple screens that look inconsistent and need a shared visual system.

## Process
1. Audit existing screens: identify repeated patterns and inconsistencies.
2. Define a token layer: colors, spacing scale, border radii, shadow levels, type scale.
3. Create base components: Button, Card, Input, Badge, Avatar, BottomSheet.
4. Ensure each component accepts variant and size props.
5. Document usage in a lightweight style guide (Storybook or a screen gallery).

## React Native specifics
- Use StyleSheet.create for performance.
- Define all tokens in a central theme file.
- Support light/dark mode with useColorScheme.

## Source
Skill pattern
