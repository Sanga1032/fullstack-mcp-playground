import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3000),
  SERVICE_NAME: z.string().default("mcp-database"),
  LOG_LEVEL: z.string().default("info"),
  CORS_ORIGIN: z.string().default("https://app.localhost"),
  DATABASE_URL: z.string().optional().default("postgresql://localhost:5432/mydb"),
});

export const env = envSchema.parse(process.env);

export function getCorsOrigin(): string | string[] {
  const origin = env.CORS_ORIGIN;
  if (origin.includes(",")) {
    return origin.split(",").map((o) => o.trim());
  }
  return origin;
}
