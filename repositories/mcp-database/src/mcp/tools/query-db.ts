import { z } from "zod";
import logger from "@shared/logger";

/**
 * Tool Schema
 */
export const queryDbSchema = z.object({
  query: z.string().describe("SQL query to execute (SELECT only)"),
  params: z.array(z.any()).optional().describe("Query parameters for prepared statements"),
});

export type QueryDbInput = z.infer<typeof queryDbSchema>;

/**
 * Tool Metadata
 */
export const queryDbMetadata = {
  name: "query_database",
  description: "Execute a SELECT SQL query on the database. Only read operations are allowed.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "SQL query to execute (SELECT only)",
      },
      params: {
        type: "array",
        description: "Query parameters for prepared statements",
        items: {
          type: ["string", "number", "boolean", "null"],
        },
      },
    },
    required: ["query"],
  },
};

/**
 * Tool Handler
 */
export async function queryDbHandler(input: QueryDbInput) {
  logger.info({ query: input.query }, "Executing query_database");

  try {
    // Validate it's a SELECT query
    const normalizedQuery = input.query.trim().toUpperCase();
    if (!normalizedQuery.startsWith("SELECT")) {
      throw new Error("Only SELECT queries are allowed. Use insert_record or update_record for mutations.");
    }

    // TODO: Replace with actual database client (pg, mysql2, etc.)
    // For now, return mock data
    const mockResult = {
      rows: [
        { id: 1, name: "Example Row 1", created_at: new Date().toISOString() },
        { id: 2, name: "Example Row 2", created_at: new Date().toISOString() },
      ],
      rowCount: 2,
      query: input.query,
      params: input.params || [],
    };

    logger.info({ rowCount: mockResult.rowCount }, "query_database executed successfully");

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(mockResult, null, 2),
        },
      ],
    };
  } catch (error) {
    logger.error({ error }, "Error executing query_database");
    throw error;
  }
}
