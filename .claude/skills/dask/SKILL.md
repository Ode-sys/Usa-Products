# dask

Scale data processing with parallel and distributed computation.

## When to use
When a dataset is too large for pandas to handle in memory, or when processing can be parallelized across cores or machines.

## Core patterns
```python
import dask.dataframe as dd

# Read large CSV
df = dd.read_csv("data/*.csv")

# Compute (lazy → eager)
result = df.groupby("category")["value"].mean().compute()

# Persist in memory for repeated use
df = df.persist()
```

## When to use each API
- `dask.dataframe` — pandas-like, for tabular data
- `dask.array` — numpy-like, for array computation
- `dask.bag` — list-like, for unstructured data
- `dask.distributed` — multi-machine cluster

## Rules
- `.compute()` triggers execution — call once at the end.
- Use `.persist()` on data accessed multiple times.
- Monitor the dashboard: `client.dashboard_link`

## Source
Scientific Agent Skills (K-Dense-AI/scientific-agent-skills)
