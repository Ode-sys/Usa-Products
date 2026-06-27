# Domain 02: Frontend, UI & Product Design
*Source: Anthropic skills + Expo skills + community collections*

## Skills in This Domain

### 11 · frontend-design
Create distinctive production-grade interfaces.
- Avoid generic/templated looks
- Use intentional typography and spacing
- Apply brand colors consistently
- Always mobile-first

**Ode brand defaults:**
- Colors: #000000 · #FFFFFF · #009736 · #CE1126
- Fonts: Cairo (Arabic) · Inter (English)
- Style: warm, human, revolutionary

### 12 · web-artifacts-builder
Build interactive React + Tailwind + shadcn prototypes.
- Single-file artifacts preferred
- Use useState/useReducer for state
- No localStorage (unsupported in Claude.ai)
- Tailwind utility classes only

### 13 · theme-factory
Generate reusable color, typography, and component themes.
```
Input: brand keywords + one color
Output: full token system (colors, fonts, spacing, shadows, radius)
```

### 14 · webapp-testing
Test web apps through realistic browser flows.
- Happy path first
- Edge cases second
- Accessibility third

### 15 · brand-guidelines
Apply brand rules consistently.
**Odé | عودة guidelines:**
- Keffiyeh pattern: CSS `repeating-linear-gradient`
- Watermelon Easter eggs: hidden in design details
- Olive branch: dividers and decorative elements
- Tone: dignified, warm, defiant

### 16 · canvas-design
Create precise visual layouts for PNG/PDF outputs.
- Use Python PIL + arabic_reshaper + python-bidi for Arabic text
- Always specify DPI for print outputs
- Export at 2x resolution minimum

### 17 · algorithmic-art
Generate creative coded visuals and patterns.
- p5.js style in React artifacts
- Keffiyeh geometric patterns
- Procedural Palestinian motifs

### 18 · slack-gif-creator
Create lightweight animated GIFs.
- Max 512px width
- Max 30 frames
- Use PIL ImageDraw for simple animations

### 19 · building-ui (Expo/React Native)
Guide UI construction for mobile apps.
- StyleSheet over inline styles
- Platform.OS for conditional styling
- SafeAreaView always

### 20 · mobile-design-system
Turn app screens into consistent mobile UI language.
- Define: colors, typography, spacing, components
- Document in a single tokens file

---

## Arabic RTL Design Rules (Always Apply)
```html
<div dir="rtl" lang="ar" style="font-family: 'Cairo', sans-serif;">
```
- Text alignment: right
- Flex direction: row-reverse
- Icons mirror: scale(-1, 1)
- Numbers: keep LTR within RTL context
