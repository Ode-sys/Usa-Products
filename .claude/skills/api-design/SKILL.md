# api-design

Design clean REST, GraphQL, or tool APIs before writing implementation code.

## When to use
Before writing any server code. API design is a contract — get it right before building.

## Process
1. Define the resources or operations the API exposes.
2. For REST: choose resource names (nouns), HTTP verbs, status codes, and URL structure.
3. For GraphQL: design types, queries, mutations, and subscriptions.
4. Define request and response schemas with examples.
5. Document error responses and their codes.
6. Review for: consistency, discoverability, versioning strategy, auth model.

## REST conventions
- Use plural nouns: `/users`, `/orders`
- Nest resources max one level: `/users/{id}/orders`
- Return 201 on create, 200 on update, 204 on delete

## Source
Skill pattern
