import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import type { Request, Response } from "express";
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
 * Handle SSE endpoint for MCP
 */
export async function handleMCPSSE(req: Request, res: Response) {
  logger.info("New MCP SSE connection");

  const server = createMCPServer();
  const transport = new SSEServerTransport("/mcp/message", res);

  await server.connect(transport);

  // Keep connection alive
  req.on("close", () => {
    logger.info("MCP SSE connection closed");
  });
}
