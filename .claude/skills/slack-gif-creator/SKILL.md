# slack-gif-creator

Create lightweight animated GIFs for social, Slack, and product moments.

## When to use
When a team announcement, product launch, or social post needs a short animated visual instead of static images.

## Process
1. Define the message: what should the GIF communicate in 1-3 seconds.
2. Design frames: text + background + simple animation (fade, slide, bounce).
3. Keep dimensions small: 480×270 or 640×360 max.
4. Keep file size under 1 MB for Slack compatibility.
5. Export as an optimized GIF (limited palette, dithering off for flat colors).

## Tools
- Canvas API frame-by-frame rendering
- gif.js library for in-browser encoding
- FFmpeg for command-line conversion

## Source
Anthropic (anthropics/skills)
