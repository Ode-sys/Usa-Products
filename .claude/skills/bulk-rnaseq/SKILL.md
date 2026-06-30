# bulk-rnaseq

Analyze bulk RNA-seq pipelines, counts, QC, and differential expression.

## When to use
When processing bulk RNA-seq data from raw reads or count matrices through to differential expression results.

## Standard pipeline
1. **QC**: FastQC on raw reads, MultiQC for summary
2. **Trimming**: Trim Galore or fastp
3. **Alignment**: STAR or HISAT2 to reference genome
4. **Quantification**: featureCounts or Salmon (pseudo-alignment)
5. **Differential expression**: DESeq2 (R) or PyDESeq2 (Python)
6. **Visualization**: volcano plot, heatmap, PCA

## DESeq2 (R) minimal
```r
library(DESeq2)
dds <- DESeqDataSetFromMatrix(countData=counts, colData=metadata, design=~condition)
dds <- DESeq(dds)
res <- results(dds, contrast=c("condition","treated","control"))
```

## PyDESeq2 (Python)
```python
from pydeseq2.dds import DeseqDataSet
dds = DeseqDataSet(counts=counts, clinical=metadata, design_factors="condition")
dds.deseq2()
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
