#!/bin/bash

# ════════════════════════════════════════════════════════════
# 🤖 MCP Server Generator
# Creates a new MCP Server from the template
# ════════════════════════════════════════════════════════════

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if server name is provided
if [ -z "$1" ]; then
  echo -e "${RED}❌ Error: Server name is required${NC}"
  echo -e "${YELLOW}Usage: $0 <server-name>${NC}"
  echo -e "${YELLOW}Example: $0 weather${NC}"
  exit 1
fi

SERVER_NAME="$1"
SERVER_DIR="repositories/mcp-${SERVER_NAME}"
TEMPLATE_DIR="repositories/mcp-template"

# Check if template exists
if [ ! -d "$TEMPLATE_DIR" ]; then
  echo -e "${RED}❌ Error: Template directory not found: $TEMPLATE_DIR${NC}"
  exit 1
fi

# Check if server already exists
if [ -d "$SERVER_DIR" ]; then
  echo -e "${RED}❌ Error: Server already exists: $SERVER_DIR${NC}"
  exit 1
fi

echo -e "${BLUE}🚀 Creating new MCP Server: ${SERVER_NAME}${NC}"
echo ""

# Copy template
echo -e "${YELLOW}📁 Copying template...${NC}"
cp -r "$TEMPLATE_DIR" "$SERVER_DIR"

# Update package.json
echo -e "${YELLOW}📝 Updating package.json...${NC}"
sed -i '' "s/@repositories\/mcp-template/@repositories\/mcp-${SERVER_NAME}/g" "$SERVER_DIR/package.json"
sed -i '' "s/Template for creating new MCP Servers/MCP ${SERVER_NAME^} Server/g" "$SERVER_DIR/package.json"

# Update env.ts
echo -e "${YELLOW}⚙️  Updating configuration...${NC}"
sed -i '' "s/mcp-template/mcp-${SERVER_NAME}/g" "$SERVER_DIR/src/config/env.ts"

# Update README
echo -e "${YELLOW}📄 Updating README...${NC}"
cat > "$SERVER_DIR/README.md" <<EOF
# MCP ${SERVER_NAME^} Server

MCP Server for ${SERVER_NAME} operations.

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Development
npm run dev

# Build
npm run build

# Production
npm start
\`\`\`

## 🛠️ Tools

Add your tools in \`src/mcp/tools/\`

## 📝 Adding New Tools

1. Create tool file: \`src/mcp/tools/your-tool.ts\`
2. Register in \`src/mcp/tools/index.ts\`
3. Restart the server

## 🐳 Docker

\`\`\`bash
docker build -t mcp-${SERVER_NAME} .
docker run -p 3000:3000 mcp-${SERVER_NAME}
\`\`\`

## 📚 Documentation

See main project README for architecture details.
EOF

echo ""
echo -e "${GREEN}✅ MCP Server created successfully!${NC}"
echo ""
echo -e "${BLUE}📂 Location: ${SERVER_DIR}${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo -e "  1. cd ${SERVER_DIR}"
echo -e "  2. npm install"
echo -e "  3. Add your tools in src/mcp/tools/"
echo -e "  4. Update src/mcp/tools/index.ts"
echo -e "  5. Add to docker-compose.yml"
echo -e "  6. Add to config/mcp-servers.json"
echo ""
echo -e "${GREEN}🎉 Happy coding!${NC}"
