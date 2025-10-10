import { z } from "zod";
import logger from "@shared/logger";

/**
 * Tool Schema: Define input validation
 */
export const exampleToolSchema = z.object({
  message: z.string().describe("A message to echo back"),
});

export type ExampleToolInput = z.infer<typeof exampleToolSchema>;

/**
 * Tool Metadata: Used by MCP Server to expose this tool
 */
export const exampleToolMetadata = {
  name: "example_tool",
  description: "An example tool that echoes back a message",
  inputSchema: {
    type: "object",
    properties: {
      message: {
        type: "string",
        description: "A message to echo back",
      },
    },
    required: ["message"],
  },
};

/**
 * Tool Handler: Actual implementation
 */
export async function exampleToolHandler(input: ExampleToolInput) {
  logger.info({ input }, "Executing example_tool");

  try {
    // Your business logic here
    const result = {
      echo: input.message,
      timestamp: new Date().toISOString(),
      processed: true,
    };

    logger.info({ result }, "example_tool executed successfully");

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    logger.error({ error }, "Error executing example_tool");
    throw error;
  }
}
