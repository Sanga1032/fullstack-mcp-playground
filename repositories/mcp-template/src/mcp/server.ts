import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { getToolsMetadata, executeTool } from "./tools/index.js";
import logger from "@shared/logger";
import { env } from "@config/env";

/**
 * Create and configure MCP Server
 */
export function createMCPServer() {
  const server = new Server(
    {
      name: env.SERVICE_NAME,
      version: "0.1.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  /**
   * Handler: List available tools
   */
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    const tools = getToolsMetadata();
    logger.info({ toolCount: tools.length }, "Listing tools");
    return { tools };
  });

  /**
   * Handler: Execute a tool
   */
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    logger.info({ toolName: name, args }, "Calling tool");

    try {
      const result = await executeTool(name, args || {});
      return result;
    } catch (error) {
      logger.error({ error, toolName: name }, "Tool execution failed");
      throw error;
    }
  });

  return server;
}

/**
 * Start MCP Server with stdio transport
 */
export async function startMCPServer() {
  const server = createMCPServer();
  const transport = new StdioServerTransport();

  logger.info({ service: env.SERVICE_NAME }, "Starting MCP Server (stdio)");

  await server.connect(transport);

  logger.info("MCP Server connected and ready");
}
