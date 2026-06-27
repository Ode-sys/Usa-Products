# graphql-schema-assistant

Plan schemas, resolvers, pagination, authorization, and performance.

## When to use
When designing or evolving a GraphQL API.

## Process
1. Define types from the domain model. Use scalar types precisely.
2. Add queries (reads) and mutations (writes) for each type.
3. Plan pagination: use cursor-based (Relay spec) for large collections.
4. Define authorization rules: field-level, type-level, or directive-based.
5. Identify N+1 risks and add DataLoader batching.
6. Document the schema with descriptions on every type and field.

## Conventions
- Types: PascalCase (`UserProfile`)
- Fields: camelCase (`createdAt`)
- Mutations: verb + noun (`createUser`, `updateOrder`)
- Use `input` types for mutation arguments

## Source
Skill pattern
