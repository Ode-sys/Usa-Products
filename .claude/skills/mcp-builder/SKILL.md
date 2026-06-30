# mcp-builder

Create Model Context Protocol servers and tool integrations for agents.

## When to use
When extending Claude or another LLM agent with custom tools, data sources, or external service integrations via the MCP standard.

## Process
1. Define the tools the MCP server will expose: name, description, input schema, output schema.
2. Scaffold the server using the MCP Python SDK or TypeScript SDK.
3. Implement each tool handler with proper error handling and typed responses.
4. Add a resources section if the server exposes readable data.
5. Test with the MCP inspector or Claude Code.
6. Document the server in a README with setup instructions.

## MCP tool definition template
```json
{
  "name": "tool_name",
  "description": "Clear description for the LLM",
  "inputSchema": { "type": "object", "properties": {}, "required": [] }
}
```

## Source
Anthropic (anthropics/skills)
