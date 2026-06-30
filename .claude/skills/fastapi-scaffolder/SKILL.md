# fastapi-scaffolder

Generate reliable FastAPI service structure, routes, schemas, and tests.

## When to use
When starting a new Python web service or API and FastAPI is the chosen framework.

## Scaffold structure
```
app/
  main.py          # app factory, lifespan, middleware
  routers/         # one file per resource group
  schemas/         # Pydantic request/response models
  models/          # SQLAlchemy or ODM models
  services/        # business logic layer
  dependencies.py  # FastAPI Depends() factories
  config.py        # settings via pydantic-settings
tests/
  conftest.py
  test_<router>.py
```

## Rules
- All route inputs/outputs must use Pydantic models.
- Business logic goes in services/, not in routers/.
- Use async def for all route handlers.
- Test with httpx.AsyncClient, not requests.

## Source
Skill pattern
