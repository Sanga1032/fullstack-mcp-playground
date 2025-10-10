import { z } from "zod";
import logger from "@shared/logger";

/**
 * Tool Schema
 */
export const getMetricsSchema = z.object({
  metric: z
    .enum(["cpu", "memory", "all"])
    .optional()
    .default("all")
    .describe("Type of metrics to retrieve"),
});

export type GetMetricsInput = z.infer<typeof getMetricsSchema>;

/**
 * Tool Metadata
 */
export const getMetricsMetadata = {
  name: "get_metrics",
  description: "Get system metrics (CPU, memory, or all)",
  inputSchema: {
    type: "object",
    properties: {
      metric: {
        type: "string",
        enum: ["cpu", "memory", "all"],
        description: "Type of metrics to retrieve",
        default: "all",
      },
    },
  },
};

/**
 * Tool Handler
 */
export async function getMetricsHandler(input: GetMetricsInput) {
  logger.info({ input }, "Executing get_metrics");

  try {
    const cpuUsage = process.cpuUsage();
    const memoryUsage = process.memoryUsage();

    const metrics: any = {
      timestamp: new Date().toISOString(),
    };

    if (input.metric === "cpu" || input.metric === "all") {
      metrics.cpu = {
        user: cpuUsage.user,
        system: cpuUsage.system,
      };
    }

    if (input.metric === "memory" || input.metric === "all") {
      metrics.memory = {
        heapUsed: memoryUsage.heapUsed,
        heapTotal: memoryUsage.heapTotal,
        rss: memoryUsage.rss,
        external: memoryUsage.external,
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(metrics, null, 2),
        },
      ],
    };
  } catch (error) {
    logger.error({ error }, "Error executing get_metrics");
    throw error;
  }
}
