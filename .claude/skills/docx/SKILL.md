# docx

Create and edit Word documents with structure, styles, and formatting.

## When to use
When the output must be a `.docx` file: reports, contracts, proposals, or any document that will be edited in Microsoft Word or Google Docs.

## Process
1. Define document structure: title, headings (H1/H2/H3), body text, tables, lists.
2. Use python-docx to generate the document programmatically.
3. Apply named styles consistently (not inline formatting).
4. For tables: set column widths, header row repeat on page break.
5. Add page numbers, headers/footers if required.
6. Save as `.docx` and verify by opening in Word or LibreOffice.

## python-docx basics
```python
from docx import Document
doc = Document()
doc.add_heading("Title", 0)
doc.add_paragraph("Body text")
doc.save("output.docx")
```

## Source
Anthropic (anthropics/skills)
