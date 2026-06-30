# citation-management

Manage citations, references, DOI metadata, and publication credit.

## When to use
When writing a research paper, literature review, or any document that requires formal citations.

## Process
1. Collect DOIs or paper titles from the user.
2. Fetch metadata (author, year, title, journal, volume, pages) via CrossRef API or similar.
3. Format citations in the requested style: APA, MLA, Chicago, Vancouver, BibTeX.
4. Build a reference list sorted alphabetically or by citation order.
5. Insert in-text citations in the correct format.
6. Verify DOI links resolve correctly.

## BibTeX example
```bibtex
@article{smith2024,
  author  = {Smith, Jane},
  title   = {Title of Paper},
  journal = {Nature},
  year    = {2024},
  volume  = {600},
  pages   = {100--110},
  doi     = {10.1038/xxx}
}
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
