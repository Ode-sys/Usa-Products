# building-ui

Guide UI construction in Expo and React Native projects.

## When to use
When building screens, components, or navigation flows in an Expo or React Native app.

## Process
1. Identify the screen type: list, detail, form, modal, tab, or drawer.
2. Use Expo-compatible primitives: View, Text, ScrollView, FlatList, Pressable.
3. Apply StyleSheet for styles — avoid inline style objects in render.
4. Handle safe area insets with SafeAreaView or useSafeAreaInsets.
5. Test on both iOS and Android dimensions.

## Expo-specific rules
- Use expo-router for navigation.
- Use @expo/vector-icons for icons.
- Avoid web-only CSS properties.
- Test with Expo Go for rapid feedback.

## Source
Expo (expo/skills)
