# 🚀 Setup Instructions

Complete setup guide for the Fullstack MCP Playground.

## 📋 Prerequisites

- **Docker Desktop** (or Docker Engine + Docker Compose)
- **Node.js 22+** and npm
- **mkcert** for local HTTPS certificates
- **Anthropic API Key** from https://console.anthropic.com/

---

## 🔧 Step-by-Step Setup

### 1. Install Dependencies for MCP Servers

```bash
# MCP Core Server
cd repositories/core
npm install
cd ../..

# MCP Database Server
cd repositories/mcp-database
npm install
cd ../..

# MCP Files Server
cd repositories/mcp-files
npm install
cd ../..

# Frontend (MCP Host)
cd repositories/frontend
npm install
cd ../..
```

### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env and add your Anthropic API key
nano .env
```

Add this line to `.env`:
```
ANTHROPIC_API_KEY=sk-ant-your-actual-key-here
```

### 3. Setup Local HTTPS Certificates

```bash
# Install mkcert (macOS)
brew install mkcert
mkcert -install

# Or on Linux
# sudo apt install mkcert
# mkcert -install

# Generate certificates
cd traefik/certs
mkcert "*.localhost" localhost 127.0.0.1 ::1

# Rename generated files
mv _wildcard.localhost+3.pem dev-local.pem
mv _wildcard.localhost+3-key.pem dev-local-key.pem

cd ../..
```

### 4. Create Docker Network

```bash
docker network create leonobitech-net
```

### 5. Build and Start Services

```bash
# Build all images and start containers
docker compose up -d --build

# Monitor logs
docker compose logs -f

# Check status
docker compose ps
```

Expected output:
```
NAME           IMAGE                  STATUS
traefik        traefik:latest         Up (healthy)
mcp-core       core:v1.0.0           Up
mcp-database   mcp-database:v1.0.0   Up
mcp-files      mcp-files:v1.0.0      Up
frontend       frontend:v1.0.0        Up
```

### 6. Verify Services

Open in your browser:

- **Frontend (MCP Host):** https://app.localhost
- **MCP Core API:** https://api.localhost/health
- **Traefik Dashboard:** https://traefik.localhost

---

## 🧪 Testing Individual Services

### Test MCP Core Server

```bash
cd repositories/core
npm run dev

# In another terminal
curl http://localhost:8000/health
```

### Test Frontend

```bash
cd repositories/frontend
npm run dev

# Visit http://localhost:3000
```

---

## 🔍 Troubleshooting

### Certificate Issues

If you see SSL errors:
```bash
cd traefik/certs
rm *.pem
mkcert "*.localhost" localhost 127.0.0.1 ::1
mv _wildcard.localhost+3.pem dev-local.pem
mv _wildcard.localhost+3-key.pem dev-local-key.pem
docker compose restart traefik
```

### Port Conflicts

If ports 80 or 443 are in use:
```bash
# Find what's using the port
sudo lsof -i :80
sudo lsof -i :443

# Stop Docker containers
docker compose down

# Free the ports, then restart
docker compose up -d
```

### MCP Server Not Showing Tools

1. Check server logs:
```bash
docker compose logs mcp-core
docker compose logs mcp-database
```

2. Verify server is registered in `config/mcp-servers.json`

3. Check frontend orchestrator initialization:
```bash
docker compose logs frontend
```

### Missing Dependencies

If you see module errors:
```bash
# Reinstall all dependencies
cd repositories/core && npm ci && cd ../..
cd repositories/mcp-database && npm ci && cd ../..
cd repositories/mcp-files && npm ci && cd ../..
cd repositories/frontend && npm ci && cd ../..

# Rebuild containers
docker compose down
docker compose up -d --build
```

---

## 🎯 Next Steps

1. **Add your Anthropic API key** to `.env`
2. **Create a new MCP server**: `./scripts/create-mcp-server.sh my-server`
3. **Visit the chat interface**: https://app.localhost/chat
4. **Manage servers**: https://app.localhost/servers

---

## 📚 Additional Resources

- [MCP Documentation](https://modelcontextprotocol.io/)
- [Claude API Docs](https://docs.anthropic.com/)
- [Docker Compose Reference](https://docs.docker.com/compose/)
- [Traefik Documentation](https://doc.traefik.io/traefik/)

---

**Need help?** Open an issue on GitHub or contact the Leonobitech team.
