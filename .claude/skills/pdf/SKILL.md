# pdf

Read, inspect, create, edit, render, and verify PDF outputs.

## When to use
When the output must be a PDF, or when reading data from an existing PDF file.

## Reading PDFs
- Use PyMuPDF (fitz) for text extraction, table detection, and image extraction.
- Use pdfplumber for structured table extraction.

## Creating PDFs
- Use ReportLab for programmatic layout control.
- Use WeasyPrint to render HTML/CSS to PDF.
- Use headless Chromium (`playwright.chromium.launch()`) for pixel-perfect HTML-to-PDF.

## Editing PDFs
- Use PyMuPDF to add annotations, watermarks, or merge pages.
- Use pikepdf for low-level PDF structure manipulation.

## Verification
After generating, re-open the PDF and verify:
- Page count is correct
- Text is selectable (not just rasterized)
- Links are clickable
- File size is reasonable

## Source
Anthropic (anthropics/skills)
