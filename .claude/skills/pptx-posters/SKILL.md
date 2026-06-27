# pptx-posters

Build scientific presentation posters in slide format.

## When to use
When the user wants a conference poster as a PowerPoint file instead of LaTeX/PDF.

## Setup
In PowerPoint or python-pptx, set the slide size to the target poster dimensions (e.g., A0: 33.1" × 46.8").

## python-pptx setup
```python
from pptx import Presentation
from pptx.util import Inches

prs = Presentation()
prs.slide_width = Inches(46.8)
prs.slide_height = Inches(33.1)
```

## Layout
- Use a grid of text boxes: 3 columns × N rows.
- Title banner across the full top width.
- Author and affiliation row below title.
- Content columns: Introduction, Methods, Results, Conclusions.
- Logos in header and footer.

## Design tips
- Use high-res images (300 DPI minimum).
- Sans-serif font for body, minimum 24pt.
- Use colored section headers to separate blocks.

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
