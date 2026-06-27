# claude-api

Work with Claude API patterns, prompts, tools, and integrations.

## When to use
When building applications that call the Anthropic Claude API directly, or when debugging API usage, tool definitions, or prompt engineering.

## Key patterns

### Basic message
```python
import anthropic
client = anthropic.Anthropic()
message = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello"}]
)
```

### Tool use
Define tools with name, description, and input_schema. Claude will call them when appropriate.

### Streaming
Use `client.messages.stream()` for real-time token streaming.

### Caching
Add `cache_control: {"type": "ephemeral"}` to large static context blocks to reduce cost.

## Model IDs (2026)
- claude-sonnet-4-6 (balanced)
- claude-opus-4-8 (most capable)
- claude-haiku-4-5-20251001 (fastest)

## Source
Anthropic (anthropics/skills)
