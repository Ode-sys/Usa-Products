# data-fetching

Handle app data access, remote calls, and integration flow in Expo apps.

## When to use
When an Expo or React Native app needs to fetch data from a REST API, GraphQL endpoint, or local storage.

## Patterns

### REST with fetch
```typescript
const data = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
  .then(r => r.json());
```

### React Query (recommended)
Use @tanstack/react-query for caching, background refresh, and loading states.

### Offline-first
Use expo-sqlite or MMKV for local caching. Sync on reconnect.

### Error handling
Always handle network errors, 4xx, and 5xx separately. Show user-friendly messages.

## Rules
- Never store tokens in AsyncStorage without encryption.
- Always cancel in-flight requests on component unmount.
- Use AbortController for fetch cancellation.

## Source
Expo (expo/skills)
