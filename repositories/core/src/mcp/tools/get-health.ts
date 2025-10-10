import { z } from "zod";
import logger from "@shared/logger";

/**
 * Tool Schema: No input required
 */
export const getHealthSchema = z.object({});

export type GetHealthInput = z.infer<typeof getHealthSchema>;

/**
 * Tool Metadata
 */
export const getHealthMetadata = {
  name: "get_health",
  description: "Get system health status including uptime, memory usage, and service status",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

/**
 * Tool Handler
 */
export async function getHealthHandler(input: GetHealthInput) {
  logger.info("Executing get_health");

  try {
    const uptime = process.uptime();
    const memoryUsage = process.memoryUsage();

    const result = {
      status: "healthy",
      uptime: `${Math.floor(uptime)}s`,
      memory: {
        heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
        rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
      },
      timestamp: new Date().toISOString(),
      service: "mcp-core",
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(result, null, 2),
        },
      ],
    };
  } catch (error) {
    logger.error({ error }, "Error executing get_health");
    throw error;
  }
}
