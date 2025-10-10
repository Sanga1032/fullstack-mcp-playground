import "dotenv/config";
import { z } from "zod";

const Env = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(8000),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("debug"),
  SERVICE_NAME: z.string().default("mcp-core"),
  TRAEFIK_DOMAIN: z.string(),
  FRONTEND_DOMAIN: z.string(),
  BACKEND_DOMAIN: z.string(),
  CORS_ORIGIN: z.string().optional(), // override manual (coma-separado)
});

export const env = Env.parse(process.env);

export function getCorsOrigin(): true | string[] {
  // Si CORS_ORIGIN está seteado, úsalo tal cual
  if (env.CORS_ORIGIN?.trim()) {
    return env.CORS_ORIGIN.split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  // Por defecto permitir el frontend local (http, puerto 3000)
  return [`http://${env.FRONTEND_DOMAIN}:3000`];
}
