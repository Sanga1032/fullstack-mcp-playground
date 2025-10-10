import { z } from "zod";
import logger from "@shared/logger";
import { env } from "@config/env";

/**
 * Tool Schema
 */
export const getConfigSchema = z.object({});

export type GetConfigInput = z.infer<typeof getConfigSchema>;

/**
 * Tool Metadata
 */
export const getConfigMetadata = {
  name: "get_config",
  description: "Get current service configuration (safe, no secrets)",
  inputSchema: {
    type: "object",
    properties: {},
  },
};

/**
 * Tool Handler
 */
export async function getConfigHandler(input: GetConfigInput) {
  logger.info("Executing get_config");

  try {
    const config = {
      service: env.SERVICE_NAME,
      environment: env.NODE_ENV,
      port: env.PORT,
      logLevel: env.LOG_LEVEL,
      corsOrigin: env.CORS_ORIGIN,
      version: "0.1.0",
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    };

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(config, null, 2),
        },
      ],
    };
  } catch (error) {
    logger.error({ error }, "Error executing get_config");
    throw error;
  }
}
