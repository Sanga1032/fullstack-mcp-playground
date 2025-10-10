import {
  getHealthMetadata,
  getHealthHandler,
  getHealthSchema,
} from "./get-health";
import {
  getMetricsMetadata,
  getMetricsHandler,
  getMetricsSchema,
} from "./get-metrics";
import {
  getConfigMetadata,
  getConfigHandler,
  getConfigSchema,
} from "./get-config";

/**
 * Tool Registry: Export all tools for MCP Core
 */
export const tools = [
  {
    metadata: getHealthMetadata,
    handler: getHealthHandler,
    schema: getHealthSchema,
  },
  {
    metadata: getMetricsMetadata,
    handler: getMetricsHandler,
    schema: getMetricsSchema,
  },
  {
    metadata: getConfigMetadata,
    handler: getConfigHandler,
    schema: getConfigSchema,
  },
];

/**
 * Get tool metadata for MCP Server
 */
export function getToolsMetadata() {
  return tools.map((tool) => tool.metadata);
}

/**
 * Execute a tool by name
 */
export async function executeTool(name: string, args: unknown) {
  const tool = tools.find((t) => t.metadata.name === name);

  if (!tool) {
    throw new Error(`Tool '${name}' not found`);
  }

  // Validate input
  const validatedInput = tool.schema.parse(args);

  // Execute handler
  return await tool.handler(validatedInput as any);
}
