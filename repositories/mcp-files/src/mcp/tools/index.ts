import {
  exampleToolMetadata,
  exampleToolHandler,
  exampleToolSchema,
  type ExampleToolInput,
} from "./example-tool";

/**
 * Tool Registry: Export all tools
 */
export const tools = [
  {
    metadata: exampleToolMetadata,
    handler: exampleToolHandler,
    schema: exampleToolSchema,
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
