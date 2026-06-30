# pptx

Create and revise presentation decks with clean slide structure.

## When to use
When the output must be a `.pptx` file for PowerPoint or Google Slides.

## Process
1. Define the deck outline: title slide, agenda, content slides, closing slide.
2. For each slide: one main idea, max 5 bullet points, one visual element.
3. Use python-pptx to generate programmatically.
4. Apply a consistent slide master / theme.
5. Export and verify by opening in PowerPoint or LibreOffice Impress.

## python-pptx basics
```python
from pptx import Presentation
from pptx.util import Inches, Pt

prs = Presentation()
slide = prs.slides.add_slide(prs.slide_layouts[1])
slide.shapes.title.text = "Slide Title"
prs.save("output.pptx")
```

## Design rules
- One idea per slide.
- Font size minimum 24pt for body text.
- High contrast between text and background.

## Source
Anthropic (anthropics/skills)
