# anndata

Work with annotated matrices for single-cell and omics data.

## When to use
When working with single-cell RNA-seq, ATAC-seq, or other omics data that uses the AnnData format (the standard for scanpy and scverse).

## AnnData structure
```
AnnData object:
  .X          — expression matrix (n_obs × n_vars)
  .obs         — cell/sample metadata (DataFrame)
  .var         — gene/feature metadata (DataFrame)
  .obsm        — embeddings (PCA, UMAP, etc.)
  .obsp        — connectivities, distances
  .uns         — unstructured metadata
```

## Common operations
```python
import anndata as ad
import scanpy as sc

adata = sc.read_h5ad("data.h5ad")
adata.obs["cell_type"]              # cell metadata
adata.var["highly_variable"]        # gene metadata
adata[adata.obs["condition"] == "treated"]  # subsetting
adata.write_h5ad("output.h5ad")
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
