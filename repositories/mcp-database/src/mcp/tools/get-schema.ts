import { z } from "zod";
import logger from "@shared/logger";

/**
 * Tool Schema
 */
export const getSchemaSchema = z.object({
  table: z.string().optional().describe("Specific table name (optional, returns all if not provided)"),
});

export type GetSchemaInput = z.infer<typeof getSchemaSchema>;

/**
 * Tool Metadata
 */
export const getSchemaMetadata = {
  name: "get_database_schema",
  description: "Get database schema information for tables and columns",
  inputSchema: {
    type: "object",
    properties: {
      table: {
        type: "string",
        description: "Specific table name (optional, returns all if not provided)",
      },
    },
  },
};

/**
 * Tool Handler
 */
export async function getSchemaHandler(input: GetSchemaInput) {
  logger.info({ table: input.table }, "Executing get_database_schema");

  try {
    // TODO: Replace with actual database schema query
    // For now, return mock schema
    const mockSchema = {
      database: "mydb",
      tables: [
        {
          name: "users",
          columns: [
            { name: "id", type: "integer", nullable: false, primaryKey: true },
            { name: "name", type: "varchar(255)", nullable: false },
            { name: "email", type: "varchar(255)", nullable: false },
            { name: "created_at", type: "timestamp", nullable: false },
          ],
        },
        {
          name: "posts",
          columns: [
            { name: "id", type: "integer", nullable: false, primaryKey: true },
            { name: "user_id", type: "integer", nullable: false },
            { name: "title", type: "varchar(255)", nullable: false },
            { name: "content", type: "text", nullable: true },
            { name: "created_at", type: "timestamp", nullable: false },
          ],
        },
      ],
    };

    // Filter by table if specified
    const result = input.table
      ? {
          ...mockSchema,
          tables: mockSchema.tables.filter((t) => t.name === input.table),
        }
      : mockSchema;

    logger.info({ tableCount: result.tables.length }, "get_database_schema executed successfully");

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    logger.error({ error }, "Error executing get_database_schema");
    throw error;
  }
}
