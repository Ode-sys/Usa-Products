# sql-optimization

Improve slow queries with indexing, plans, and simpler data access.

## When to use
When a query is slow, when load increases, or before shipping a feature that queries large tables.

## Process
1. Get the query execution plan: `EXPLAIN ANALYZE` (PostgreSQL) or `EXPLAIN` (MySQL).
2. Identify the bottleneck: sequential scan, sort, nested loop, hash join.
3. Add indexes for filtered and joined columns. Prefer partial indexes for filtered subsets.
4. Rewrite the query if the plan shows poor cardinality estimates.
5. Benchmark before and after with realistic data volumes.

## Common fixes
- Missing index on WHERE or JOIN column → add B-tree index
- SELECT * → select only needed columns
- N+1 → use JOIN or batch fetch
- Large OFFSET → use cursor-based pagination

## Source
Skill pattern
