import { startMCPServer } from "./mcp/server.js";
import logger from "./shared/logger.js";

/**
 * Main entry point for MCP Server
 */
async function main() {
  try {
    await startMCPServer();
  } catch (error) {
    logger.error({ error }, "Failed to start MCP Server");
    process.exit(1);
  }
}

main();
