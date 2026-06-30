# polars

Fast dataframe work for analytics, cleaning, and transformation.

## When to use
When pandas is too slow for a data transformation task, or when working with large datasets that benefit from lazy evaluation and query optimization.

## Key differences from pandas
- Use `pl.col("name")` instead of `df["name"]`
- Lazy API: `df.lazy()...filter()...collect()`
- No index — use explicit columns
- Expressions compose instead of chaining

## Common patterns
```python
import polars as pl

df = pl.read_csv("data.csv")

result = (
    df
    .filter(pl.col("value") > 100)
    .group_by("category")
    .agg(pl.col("value").mean().alias("avg_value"))
    .sort("avg_value", descending=True)
)
```

## Lazy evaluation
```python
df.lazy().filter(...).collect()  # optimizes the query plan
```

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
