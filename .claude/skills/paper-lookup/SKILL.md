# paper-lookup

Find papers, abstracts, metadata, and research references.

## When to use
When the user needs to find academic papers on a topic, verify a citation, or retrieve paper metadata.

## Data sources
- **PubMed**: biomedical and life sciences — `https://pubmed.ncbi.nlm.nih.gov/`
- **arXiv**: preprints in CS, physics, math, economics — `https://arxiv.org/`
- **Semantic Scholar API**: cross-domain with citation graph
- **CrossRef API**: DOI metadata resolution
- **OpenAlex**: open bibliographic database

## Process
1. Take the user's topic or partial citation.
2. Search the appropriate database using keywords or DOI.
3. Return: title, authors, year, journal/conference, abstract, DOI/URL.
4. If multiple matches: list the top 5 with enough detail for the user to identify the right one.

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
