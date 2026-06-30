# biopython

Sequence analysis, biological data parsing, and NCBI-style workflows.

## When to use
When working with DNA, RNA, or protein sequences, or when fetching biological data from NCBI databases.

## Common tasks
```python
from Bio import SeqIO, Entrez, Blast
from Bio.Seq import Seq

# Parse FASTA
for record in SeqIO.parse("sequences.fasta", "fasta"):
    print(record.id, len(record.seq))

# Translate DNA to protein
dna = Seq("ATGAAACCCGGG")
protein = dna.translate()

# Fetch from NCBI
Entrez.email = "user@example.com"
handle = Entrez.efetch(db="nucleotide", id="NC_000913", rettype="gb", retmode="text")
record = SeqIO.read(handle, "genbank")
```

## Key modules
- `Bio.SeqIO` — read/write sequence formats (FASTA, GenBank, FASTQ)
- `Bio.Entrez` — NCBI database access
- `Bio.Blast` — run and parse BLAST searches
- `Bio.Align` — pairwise and multiple sequence alignment
- `Bio.PDB` — protein structure parsing

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
