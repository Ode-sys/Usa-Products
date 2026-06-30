# cellxgene-census

Query and integrate single-cell reference datasets.

## When to use
When accessing the CZ CELLxGENE Census — a large, standardized single-cell reference corpus — for cross-dataset analysis or cell type annotation.

## Basic query
```python
import cellxgene_census

with cellxgene_census.open_soma() as census:
    # Get cell metadata for human lung cells
    obs = census["census_data"]["homo_sapiens"].obs.read(
        value_filter="tissue_general == 'lung' and is_primary_data == True",
        column_names=["soma_joinid", "cell_type", "disease", "dataset_id"]
    ).concat().to_pandas()

    # Get expression matrix for a gene set
    adata = cellxgene_census.get_anndata(
        census=census,
        organism="Homo sapiens",
        var_value_filter="feature_name in ['ACTB', 'GAPDH']",
        obs_value_filter="tissue_general == 'lung'"
    )
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
