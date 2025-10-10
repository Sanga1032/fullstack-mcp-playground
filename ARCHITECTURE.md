# 🏗️ Architecture Documentation

## Overview

This document describes the architecture of the Fullstack MCP Playground - a microservices-based platform for building AI agents powered by Claude and the Model Context Protocol (MCP).

---

## 🎯 Key Concepts

### Model Context Protocol (MCP)

MCP is a protocol that allows AI models (like Claude) to interact with external tools and data sources. It consists of three main components:

1. **MCP Client** - The AI agent (Claude) that uses tools
2. **MCP Host** - Orchestrates connections to multiple servers (our Frontend)
3. **MCP Servers** - Expose tools, resources, and prompts (our Backend microservices)

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                 │
│                     https://app.localhost                            │
└─────────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      TRAEFIK (Reverse Proxy)                         │
│  • HTTPS Termination                                                │
│  • Domain Routing (*.localhost)                                     │
│  • Load Balancing                                                   │
└─────────────────────────────────────────────────────────────────────┘
                  ↓                              ↓
    ┌─────────────────────────┐    ┌──────────────────────────────┐
    │   FRONTEND (Port 3000)  │    │  MCP SERVERS (Ports 8000+)   │
    │   = MCP HOST            │    │  = MCP SERVERS               │
    └─────────────────────────┘    └──────────────────────────────┘
                  ↓                              ↑
    ┌─────────────────────────┐                 │
    │   ANTHROPIC CLAUDE API  │                 │
    │   (External)            │                 │
    └─────────────────────────┘                 │
                  ↓                              │
              [Tool Calls] ──────────────────────┘
```

---

## 📦 Component Details

### 1. Frontend (MCP Host)

**Technology:** Next.js 15 + TypeScript + React 19

**Location:** `repositories/frontend/`

**Port:** 3000

**Responsibilities:**
- UI for chat interface and server management
- MCP Host Orchestrator (connects to multiple MCP servers)
- Claude API client integration
- Tool call routing and execution
- Real-time streaming of AI responses

**Key Files:**
```
src/
├── lib/
│   ├── mcp/
│   │   ├── orchestrator.ts      # Multi-server connection manager
│   │   ├── server-registry.ts   # Loads config/mcp-servers.json
│   │   └── types.ts             # TypeScript interfaces
│   └── claude/
│       └── client.ts            # Anthropic SDK wrapper
├── components/
│   ├── mcp/
│   │   └── server-selector.tsx  # UI to enable/disable servers
│   └── chat/
│       └── (chat components)
└── app/
    └── (dashboard)/
        ├── chat/                # Chat interface
        └── servers/             # Server management UI
```

**Flow:**
1. User sends message in chat
2. Orchestrator gathers tools from all enabled MCP servers
3. Claude client sends message + tools to Anthropic API
4. Claude decides to use a tool
5. Frontend calls the appropriate MCP server
6. Result is sent back to Claude
7. Claude generates final response
8. Response streams to user

---

### 2. MCP Core Server

**Technology:** Node.js + Express + TypeScript

**Location:** `repositories/core/`

**Port:** 8000

**Endpoint:** `https://api.localhost/mcp`

**Tools:**
- `get_health` - Returns system health status
- `get_metrics` - Returns CPU/memory metrics
- `get_config` - Returns service configuration

**Architecture:**
```
src/
├── mcp/
│   ├── server.ts           # MCP Server implementation (SSE transport)
│   └── tools/
│       ├── get-health.ts   # Tool: health check
│       ├── get-metrics.ts  # Tool: system metrics
│       ├── get-config.ts   # Tool: configuration
│       └── index.ts        # Tool registry
├── infra/http/
│   └── server.ts           # Express HTTP server + /mcp endpoint
├── config/
│   └── env.ts              # Environment variables
└── shared/
    └── logger.ts           # Pino logger
```

---

### 3. MCP Database Server

**Technology:** Node.js + Express + TypeScript

**Location:** `repositories/mcp-database/`

**Port:** 8001

**Endpoint:** `https://api.localhost/mcp-db`

**Tools:**
- `query_database` - Execute SELECT queries
- `insert_record` - Insert data into tables
- `get_database_schema` - Retrieve table schemas

**Use Cases:**
- Claude can query databases based on user questions
- Insert records based on user commands
- Explore database structure

---

### 4. MCP Files Server

**Technology:** Node.js + Express + TypeScript

**Location:** `repositories/mcp-files/`

**Port:** 8002

**Endpoint:** `https://api.localhost/mcp-files`

**Tools:**
- `example_tool` - Template tool (to be customized)

**Extensible for:**
- File read/write operations
- Directory listing
- File search
- Content indexing

---

### 5. MCP Template

**Location:** `repositories/mcp-template/`

**Purpose:** Boilerplate for creating new MCP servers

**Usage:**
```bash
./scripts/create-mcp-server.sh my-new-server
```

**Structure:**
```
mcp-template/
├── src/
│   ├── mcp/
│   │   ├── server.ts          # MCP Server base
│   │   └── tools/
│   │       ├── example-tool.ts
│   │       └── index.ts
│   ├── config/
│   └── shared/
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## 🔄 Data Flow

### Tool Call Sequence

```
1. User Input
   ↓
2. Frontend: MCP Orchestrator
   • Aggregates tools from all enabled servers
   • Formats tools for Claude API
   ↓
3. Claude API
   • Processes user message
   • Decides to use a tool
   • Returns tool_use content block
   ↓
4. Frontend: Tool Execution
   • Parses tool_use block
   • Routes to correct MCP server
   • Calls server's MCP endpoint
   ↓
5. MCP Server
   • Validates input with Zod schema
   • Executes tool handler
   • Returns result
   ↓
6. Frontend → Claude API
   • Sends tool result
   • Claude generates final response
   ↓
7. User sees response
```

### Example Flow

**User:** "What's the current CPU usage?"

1. Frontend sends to Claude with all tools
2. Claude sees `mcp-core/get_metrics` tool
3. Claude returns: `tool_use: get_metrics({ metric: "cpu" })`
4. Frontend calls `https://api.localhost/mcp` with tool call
5. MCP Core executes `get_metrics` handler
6. Returns: `{ cpu: { user: 1234, system: 5678 } }`
7. Frontend sends result to Claude
8. Claude responds: "Current CPU usage is..."

---

## 🌐 Network Architecture

### Docker Network

All services run in a single Docker network: `leonobitech-net`

This allows containers to communicate by service name:
- `frontend` container can reach `mcp-core:8000`
- `mcp-database` can reach `mcp-core:8000`

### Traefik Routing

| URL | Service | Container | Port |
|-----|---------|-----------|------|
| `https://app.localhost` | Frontend | frontend | 3000 |
| `https://api.localhost` | MCP Core | mcp-core | 8000 |
| `https://api.localhost/mcp-db` | MCP Database | mcp-database | 8001 |
| `https://api.localhost/mcp-files` | MCP Files | mcp-files | 8002 |
| `https://traefik.localhost` | Dashboard | traefik | 8080 |

---

## 🔐 Security Considerations

### HTTPS

- **Local:** mkcert certificates for `*.localhost`
- **Production:** Let's Encrypt (ACME) via Traefik

### API Keys

- Anthropic API key stored in `.env`
- Not exposed to frontend (server-side only)

### CORS

Each MCP server has CORS configured to only allow:
```
CORS_ORIGIN=https://app.localhost
```

### Input Validation

All tools use **Zod schemas** for runtime type validation:

```typescript
export const queryDbSchema = z.object({
  query: z.string(),
  params: z.array(z.any()).optional(),
});
```

---

## 📈 Scalability

### Horizontal Scaling

Add new MCP servers without modifying existing code:

1. Create new server: `./scripts/create-mcp-server.sh weather`
2. Add to `docker-compose.yml`
3. Add to `config/mcp-servers.json`
4. Restart

### Independent Deployment

Each MCP server is a separate container:
- Update one server without touching others
- Scale individual servers based on load
- Different servers can use different technologies

### Load Balancing

Traefik can load balance multiple instances:

```yaml
mcp-database:
  deploy:
    replicas: 3  # Run 3 instances
```

---

## 🧪 Testing Strategy

### Unit Tests (per server)

```bash
cd repositories/mcp-database
npm test
```

### Integration Tests (MCP protocol)

Use MCP Inspector:
```bash
npx @modelcontextprotocol/inspector node repositories/mcp-core/dist/index.mjs
```

### E2E Tests (full flow)

Test via frontend:
1. Enable server in UI
2. Send message that requires tool
3. Verify tool is called
4. Verify response is correct

---

## 🔧 Extension Points

### Adding New Tools

1. Create tool file: `src/mcp/tools/my-tool.ts`
2. Define schema, metadata, handler
3. Register in `src/mcp/tools/index.ts`

### Adding New Servers

1. Use generator: `./scripts/create-mcp-server.sh my-server`
2. Implement tools
3. Register in config and docker-compose

### Custom Transports

Currently using SSE (Server-Sent Events). Can add:
- WebSocket transport
- stdio transport (for local processes)
- HTTP polling

---

## 📊 Monitoring & Logging

### Logging

All services use **Pino** for structured logging:

```typescript
logger.info({ toolName, args }, "Calling tool");
```

View logs:
```bash
docker compose logs -f mcp-core
```

### Health Checks

All services expose `/health` endpoints:
- `https://api.localhost/health`
- Container healthchecks in docker-compose

### Metrics

MCP Core exposes system metrics via `get_metrics` tool.

Future: Prometheus + Grafana integration

---

## 🚀 Future Enhancements

- [ ] Add authentication/authorization
- [ ] Implement conversation persistence (database)
- [ ] Add more MCP servers (email, calendar, etc.)
- [ ] WebSocket support for real-time updates
- [ ] Prometheus metrics export
- [ ] Rate limiting per MCP server
- [ ] Tool usage analytics dashboard
- [ ] Multi-tenant support
- [ ] MCP server marketplace

---

## 📚 References

- [MCP Specification](https://modelcontextprotocol.io/)
- [Anthropic Claude API](https://docs.anthropic.com/)
- [MCP SDK (TypeScript)](https://github.com/modelcontextprotocol/typescript-sdk)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Traefik Proxy](https://doc.traefik.io/traefik/)

---

**Last Updated:** 2025-10-10
**Version:** 1.0.0
**Maintainer:** Leonobitech Dev Team
