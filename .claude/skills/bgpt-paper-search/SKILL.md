# bgpt-paper-search

Search biomedical and scientific literature with focused prompts.

## When to use
When searching PubMed, bioRxiv, or other biomedical databases for papers on a specific clinical or biological question.

## Search strategy
1. Extract the core concepts from the user's question (PICO for clinical: Population, Intervention, Comparison, Outcome).
2. Build a Boolean search string: `(concept1 OR synonym1) AND (concept2 OR synonym2)`
3. Apply filters: publication date, article type (review, clinical trial, meta-analysis), species.
4. Run on PubMed via API or Entrez utilities.
5. Return top 10 results with abstract snippets.

## PubMed E-utilities
```
https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=<query>&retmax=10
```

## MeSH terms
Use MeSH controlled vocabulary for precise biomedical searches.

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
