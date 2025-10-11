# 🤖 Fullstack MCP Playground

<p align="center">
  <img src="./assets/banner-003.png" alt="Fullstack MCP Playground — Leonobitech" width="100%" />
</p>

**Build end-to-end fullstack AI applications with the Model Context Protocol (MCP) and Claude as the LLM engine.**

A production-ready template featuring **microservices architecture for MCP Servers**, where each server exposes specialized tools that AI agents can use. The frontend acts as the **MCP Host**, orchestrating multiple servers and providing a chat interface powered by Claude.

**FROM LOCALHOST TO PRODUCTION — BUILT LIKE A HACKER**

<p align="center"> <!-- Repo metrics --> <a href="https://github.com/leonobitech/fullstack-infrastructure-blueprint/stargazers"> <img src="https://img.shields.io/github/stars/leonobitech/fullstack-infrastructure-blueprint?style=flat-square" alt="GitHub stars" /> </a> <a href="https://github.com/leonobitech/fullstack-infrastructure-blueprint/network/members"> <img src="https://img.shields.io/github/forks/leonobitech/fullstack-infrastructure-blueprint?style=flat-square" alt="GitHub forks" /> </a> <a href="https://github.com/leonobitech/fullstack-infrastructure-blueprint/issues"> <img src="https://img.shields.io/github/issues/leonobitech/fullstack-infrastructure-blueprint?style=flat-square" alt="Open issues" /> </a> <a href="https://github.com/leonobitech/fullstack-infrastructure-blueprint/blob/main/LICENSE"> <img src="https://img.shields.io/github/license/leonobitech/fullstack-infrastructure-blueprint?style=flat-square" alt="License" /> </a> <img src="https://img.shields.io/github/last-commit/leonobitech/fullstack-infrastructure-blueprint?style=flat-square" alt="Last commit" /> <br/> <!-- Tech badges --> <a href="https://www.docker.com/"> <img src="https://img.shields.io/badge/Docker-ready-blue.svg?style=flat-square" alt="Docker" /> </a> <a href="https://traefik.io/"> <img src="https://img.shields.io/badge/Traefik-3.x-green.svg?style=flat-square" alt="Traefik 3.x" /> </a> <a href="https://github.com/FiloSottile/mkcert"> <img src="https://img.shields.io/badge/HTTPS-mkcert-orange.svg?style=flat-square" alt="HTTPS mkcert" /> </a> <img src="https://img.shields.io/badge/status-stable-success.svg?style=flat-square" alt="Status: stable" /> </p>

---

## 🧠 Overview

This is a **fullstack template for building AI-powered applications** using the [Model Context Protocol (MCP)](https://modelcontextprotocol.io/). It demonstrates how to:

- **Create multiple MCP Servers** as microservices (database, files, custom tools)
- **Build an MCP Host** (frontend) that connects to multiple servers
- **Integrate Claude AI** to consume tools from all connected servers
- **Scale horizontally** by adding new MCP servers without touching existing code

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (Next.js) = MCP HOST                  │
│  • UI (Chat, Server Management)                             │
│  • MCP Orchestrator (connects to multiple servers)          │
│  • Claude Client (consumes tools from all servers)          │
└─────────────────────────────────────────────────────────────┘
          ↕                ↕                ↕
    [HTTPS/SSE]      [HTTPS/SSE]      [HTTPS/SSE]
          ↕                ↕                ↕
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ MCP Server   │  │ MCP Server   │  │ MCP Server   │
│   CORE       │  │  DATABASE    │  │   FILES      │
│ (health,     │  │ (query,      │  │ (read,       │
│  metrics,    │  │  insert,     │  │  write,      │
│  config)     │  │  schema)     │  │  list)       │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 🚀 Quick Start

### 1. Prerequisites

- Docker & Docker Compose
- Node.js 22+
- Anthropic API Key ([Get one here](https://console.anthropic.com/))
- mkcert (for local HTTPS)

### 2. Clone and Configure

```bash
git clone https://github.com/leonobitech/fullstack-mcp-playground.git
cd fullstack-mcp-playground

cp .env.example .env
# Add your Anthropic API key to .env
```

### 3. Setup HTTPS

```bash
cd traefik/certs
mkcert "*.localhost" localhost 127.0.0.1 ::1
mv _wildcard.localhost+3.pem dev-local.pem
mv _wildcard.localhost+3-key.pem dev-local-key.pem
cd ../..
```

### 4. Start

```bash
docker network create leonobitech-net
docker compose up -d --build
```

### 5. Access

- **Frontend:** https://app.localhost
- **Core API:** https://api.localhost
- **Traefik:** https://traefik.localhost

---

## 🔧 Creating New MCP Servers

```bash
# Generate new server
./scripts/create-mcp-server.sh weather

cd repositories/mcp-weather
npm install

# Add tools in src/mcp/tools/
# Register in docker-compose.yml and config/mcp-servers.json
```

---

## 📂 Structure

```
fullstack-mcp-playground/
├── config/
│   └── mcp-servers.json          # Server registry
├── repositories/
│   ├── core/                     # MCP Core Server
│   ├── mcp-database/             # MCP Database Server
│   ├── mcp-files/                # MCP Files Server
│   ├── mcp-template/             # Template
│   └── frontend/                 # MCP Host (Next.js)
├── scripts/
│   └── create-mcp-server.sh      # Generator CLI
├── traefik/                      # Proxy config
├── docker-compose.yml
└── .env.example
```

---

## 🛠️ Available MCP Servers

### Core (`mcp-core`)

- `get_health` - System health
- `get_metrics` - CPU/memory metrics
- `get_config` - Configuration

### Database (`mcp-database`)

- `query_database` - SQL SELECT
- `insert_record` - Insert data
- `get_database_schema` - Table schemas

### Files (`mcp-files`)

- `example_tool` - Template tool

---

## 🧪 Testing the Application

### 1. Get Your Anthropic API Key

You need a Claude API key to test the AI agent:

1. Go to [Anthropic Console](https://console.anthropic.com/)
2. Sign up or log in (this is separate from Claude Pro subscription)
3. Get $5 in free API credits (enough for extensive testing)
4. Create an API key
5. Add it to your `.env` file:

```bash
ANTHROPIC_API_KEY=sk-ant-api03-...
```

6. Restart the frontend container:

```bash
docker compose restart frontend
```

### 2. Access the Chat Interface

Open your browser and go to:
- **Chat:** https://app.localhost/chat
- **Server Management:** https://app.localhost/servers

### 3. Available Tools - What Really Works

#### ✅ REAL Functional Tools (mcp-core)

The `mcp-core` server exposes **3 real tools** that interact with the actual running Node.js process:

---

##### 🩺 **Tool 1: `get_health`**

**What it does:**
- Returns real-time health status of the mcp-core service
- Shows actual uptime (how long the service has been running)
- Displays real memory usage (heap and RSS)
- Provides timestamp and service name

**Real data returned:**
```json
{
  "status": "healthy",
  "uptime": "142s",
  "memory": {
    "heapUsed": "45MB",    // Real heap memory used
    "heapTotal": "67MB",   // Real total heap allocated
    "rss": "89MB"          // Real resident set size
  },
  "timestamp": "2025-10-10T...",
  "service": "mcp-core"
}
```

**Example questions to test:**
```
¿Cuál es el estado de salud del sistema?
How long has the core service been running?
Show me the current memory usage
Is the system healthy?
Check mcp-core health and memory
```

---

##### 📊 **Tool 2: `get_metrics`**

**What it does:**
- Returns real CPU usage metrics from the Node.js process
- Shows actual memory consumption in bytes
- Can filter by metric type: `cpu`, `memory`, or `all`
- Provides timestamp for each reading

**Input parameter:**
- `metric` (optional): `"cpu"` | `"memory"` | `"all"` (default: `"all"`)

**Real data returned:**
```json
{
  "timestamp": "2025-10-10T...",
  "cpu": {
    "user": 156789,      // Real CPU microseconds in user mode
    "system": 34567      // Real CPU microseconds in system mode
  },
  "memory": {
    "heapUsed": 47185920,    // Real bytes
    "heapTotal": 70254592,   // Real bytes
    "rss": 93450240,         // Real bytes
    "external": 1234567      // Real bytes
  }
}
```

**Example questions to test:**
```
Muéstrame las métricas del sistema
What's the current CPU usage?
Get memory metrics only
Show me all metrics
How much memory is the core service using?
Get CPU and memory metrics
```

---

##### ⚙️ **Tool 3: `get_config`**

**What it does:**
- Returns actual service configuration from environment variables
- Shows Node.js version, platform, and architecture
- Displays service name, environment, and port
- Returns CORS settings and log level
- **Safe**: No secrets exposed (passwords, API keys filtered out)

**Real data returned:**
```json
{
  "service": "mcp-core",
  "environment": "production",
  "port": 3333,
  "logLevel": "info",
  "corsOrigin": "https://app.localhost",
  "version": "0.1.0",
  "nodeVersion": "v22.x.x",    // Real Node.js version
  "platform": "linux",          // Real platform (docker)
  "arch": "x64"                 // Real architecture
}
```

**Example questions to test:**
```
¿Cuál es la configuración del servicio?
What Node.js version is running?
Show me the service configuration
What port is mcp-core using?
Get environment settings
What's the CORS origin configured?
```

---

#### 🔧 Mock Tools (mcp-database) - Not Yet Functional

| Tool                  | Status                                                   |
|-----------------------|----------------------------------------------------------|
| `query_database`      | 🟡 Returns **mock data** (TODO: connect real PostgreSQL) |
| `insert_record`       | 🟡 Returns **mock data** (TODO: connect real PostgreSQL) |
| `get_database_schema` | 🟡 Returns **mock data** (TODO: connect real PostgreSQL) |

These tools are placeholders. You can use them to test the flow, but they return fake data until a real database is connected.

### 4. Complete Testing Guide

Copy and paste these prompts into the chat to test each tool:

#### 🧪 Test Individual Tools

**Test `get_health`:**
```
¿Cuál es el estado de salud del sistema? Muéstrame el uptime y memoria.
```
```
What's the current system health? Show me uptime and memory usage.
```
**Expected:** Claude uses `get_health` → Returns real uptime (e.g., "142s") and memory usage

---

**Test `get_metrics`:**
```
Muéstrame las métricas de CPU y memoria del sistema.
```
```
Show me the current CPU and memory metrics in detail.
```
**Expected:** Claude uses `get_metrics` → Returns real CPU microseconds and memory bytes

---

**Test `get_config`:**
```
¿Qué configuración tiene el servicio? ¿Qué versión de Node está corriendo?
```
```
What's the service configuration? What Node.js version is running?
```
**Expected:** Claude uses `get_config` → Returns real Node version, platform, and settings

---

#### 🚀 Test Advanced Scenarios

**Test Multiple Tools in One Request:**
```
Dame un reporte completo del sistema: salud, métricas y configuración.
```
```
Give me a complete system report with health, metrics, and configuration.
```
**Expected:** Claude uses all 3 tools (`get_health`, `get_metrics`, `get_config`) and compiles a comprehensive report

---

**Test Tool with Parameters:**
```
Get only memory metrics, not CPU.
```
**Expected:** Claude uses `get_metrics` with parameter `{"metric": "memory"}`

---

**Test Conversational Flow:**
```
Check the system health. If memory is over 100MB, also get the full metrics.
```
**Expected:** Claude uses `get_health` first, analyzes the result, then decides whether to call `get_metrics`

---

**Test in Spanish:**
```
Dime cuánto tiempo lleva corriendo el servicio mcp-core y cuánta memoria está usando.
```
**Expected:** Claude understands Spanish, uses `get_health`, and responds in Spanish with real data

### 5. What You Should See

1. **Message from you** appears on the left
2. **"Thinking..."** indicator shows Claude is processing
3. **Tool execution** indicators show which tools Claude is using
4. **Final response** from Claude with the data from the tools
5. **Tools panel** on the right shows all available tools from enabled servers

### 6. How the Flow Works

```
You: "Check system health"
  ↓
Frontend → Claude API (with available tools)
  ↓
Claude decides to use: get_health
  ↓
Frontend → MCP Orchestrator → mcp-core server
  ↓
Tool executes: Returns real uptime + memory
  ↓
Frontend → Claude API (with tool result)
  ↓
Claude: "The system has been running for 142 seconds with 45MB heap usage..."
```

### 7. Enable/Disable Servers

Go to https://app.localhost/servers to:
- Toggle servers on/off
- See which tools each server provides
- Watch the available tools in the chat update in real-time

**Example:** Disable `mcp-core` → Chat now has only database tools (mock)

### 8. Cost Estimate

Testing is **very cheap**:
- ~$0.002 per conversation (including tool calls)
- $5 free credits = ~2,500 test conversations
- Most prompts cost less than 1 cent

---

## 📖 Next Steps

Now that you've verified the end-to-end flow works:

1. **Create real MCP servers** (weather, email, calendar, etc.)
2. **Replace mock database tools** with real PostgreSQL queries
3. **Build custom tools** specific to your use case
4. **Toggle servers** to give the agent different capabilities

The "gallery" concept is ready: create new servers, enable/disable them from the UI, and watch your AI agent gain new superpowers!

---

## 🐳 Docker Commands

```bash
docker compose up -d              # Start
docker compose up -d --build      # Rebuild
docker compose logs -f mcp-core   # Logs
docker compose down               # Stop
```

---

## 🔐 Environment Variables

| Variable            | Description               |
| ------------------- | ------------------------- |
| `ANTHROPIC_API_KEY` | Claude API key (required) |
| `FRONTEND_DOMAIN`   | Frontend hostname         |
| `BACKEND_DOMAIN`    | Backend hostname          |
| `DATABASE_URL`      | Database connection       |

---

## 📜 License

MIT © 2025 — Leonobitech

---

<p align="center">
  <strong>🥷 Leonobitech Dev Team</strong><br/>
  <a href="https://www.leonobitech.com">www.leonobitech.com</a><br/>
  Made with 🧠 and AI love 🤖
</p>
