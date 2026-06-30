# Domain 03: Backend & APIs
*Source: Anthropic + Trail of Bits + community patterns*

## Skills 21–30

### api-design
Design clean REST/GraphQL APIs before writing code:
```
1. Define resources (nouns, not verbs)
2. Design endpoints: GET /resource · POST /resource · PATCH /resource/:id
3. Define request/response schemas
4. Plan error codes and messages
5. Document with OpenAPI spec
```

### fastapi-scaffolder
```python
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel

app = FastAPI(title="API Name", version="1.0.0")

class ItemSchema(BaseModel):
    name: str
    value: float

@app.get("/health")
async def health(): return {"status": "ok"}

@app.post("/items", response_model=ItemSchema)
async def create_item(item: ItemSchema):
    # validate → process → return
    return item
```

### sql-optimization
```sql
-- Always: EXPLAIN ANALYZE before optimizing
EXPLAIN ANALYZE SELECT ...;

-- Index strategy:
-- 1. WHERE clauses first
-- 2. JOIN columns second  
-- 3. ORDER BY third
-- Composite index order matters: (high_cardinality, low_cardinality)
```

### database-migration
```
Zero-downtime pattern:
1. Add column (nullable, no default)
2. Deploy new code (writes both old + new)
3. Backfill data in batches
4. Add NOT NULL constraint
5. Deploy final code (reads new column only)
6. Drop old column
```
