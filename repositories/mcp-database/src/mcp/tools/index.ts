import {
  queryDbMetadata,
  queryDbHandler,
  queryDbSchema,
} from "./query-db";
import {
  insertRecordMetadata,
  insertRecordHandler,
  insertRecordSchema,
} from "./insert-record";
import {
  getSchemaMetadata,
  getSchemaHandler,
  getSchemaSchema,
} from "./get-schema";

/**
 * Tool Registry: Export all tools for MCP Database
 */
export const tools = [
  {
    metadata: queryDbMetadata,
    handler: queryDbHandler,
    schema: queryDbSchema,
  },
  {
    metadata: insertRecordMetadata,
    handler: insertRecordHandler,
    schema: insertRecordSchema,
  },
  {
    metadata: getSchemaMetadata,
    handler: getSchemaHandler,
    schema: getSchemaSchema,
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
