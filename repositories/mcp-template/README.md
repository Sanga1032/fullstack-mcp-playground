# MCP Template Server

Base template for creating new MCP Servers in the fullstack-mcp-playground.

## 🚀 Quick Start

### Development
```bash
npm install
npm run dev
```

### Production
```bash
npm run build
npm start
```

## 🛠️ How to Create a New MCP Server

1. Copy this template:
```bash
cp -r repositories/mcp-template repositories/mcp-your-name
cd repositories/mcp-your-name
```

2. Update `package.json`:
```json
{
  "name": "@repositories/mcp-your-name",
  "description": "Your MCP Server description"
}
```

3. Update `src/config/env.ts`:
```typescript
SERVICE_NAME: z.string().default("mcp-your-name"),
```

4. Create your tools in `src/mcp/tools/`:
```typescript
// src/mcp/tools/your-tool.ts
export const yourToolMetadata = {
  name: "your_tool",
  description: "What your tool does",
  inputSchema: { /* ... */ }
};

export async function yourToolHandler(input: YourToolInput) {
  // Implementation
}
```

5. Register your tool in `src/mcp/tools/index.ts`:
```typescript
import { yourToolMetadata, yourToolHandler, yourToolSchema } from "./your-tool";

export const tools = [
  {
    metadata: yourToolMetadata,
    handler: yourToolHandler,
    schema: yourToolSchema,
  },
  // ... other tools
];
```

6. Add to `docker-compose.yml`:
```yaml
mcp-your-name:
  build: ./repositories/mcp-your-name
  environment:
    - SERVICE_NAME=mcp-your-name
  networks:
    - leonobitech-net
```

7. Test it!
```bash
npm run dev
```

## 📂 Structure

```
mcp-template/
├── src/
│   ├── mcp/
│   │   ├── server.ts          # MCP Server setup
│   │   └── tools/
│   │       ├── example-tool.ts # Example tool
│   │       └── index.ts        # Tool registry
│   ├── config/
│   │   └── env.ts             # Environment config
│   ├── shared/
│   │   └── logger.ts          # Logging
│   └── index.ts               # Entry point
├── Dockerfile
├── package.json
└── tsconfig.json
```

## 🔧 Available Tools

- `example_tool` - Echoes back a message

## 📚 MCP Protocol

This server implements the [Model Context Protocol](https://modelcontextprotocol.io/):
- **Tools**: Functions that Claude can execute
- **Resources**: Data that Claude can access
- **Prompts**: Reusable prompt templates

## 🐳 Docker

```bash
docker build -t mcp-template .
docker run -p 3000:3000 mcp-template
```

## 📝 License

MIT © 2025 Leonobitech
