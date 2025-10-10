import express from "express";
import cors from "cors";
import { env, getCorsOrigin } from "@config/env";
import logger from "@shared/logger";
import { handleMCPSSE } from "@mcp/server";

export function buildServer() {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: getCorsOrigin(), credentials: true }));
  app.use(express.json());

  // Health endpoint
  app.get("/health", (_req, res) =>
    res.json({ ok: true, service: env.SERVICE_NAME })
  );

  // Readiness endpoint
  app.get("/ready", (_req, res) => res.json({ ready: true }));

  // MCP SSE endpoint
  app.get("/mcp", async (req, res) => {
    await handleMCPSSE(req, res);
  });

  // 404 handler
  app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

  // Error handler
  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      logger.error({ err }, "Unhandled error");
      res.status(500).json({ error: "Internal Error" });
    }
  );

  return app;
}

export async function start() {
  const app = buildServer();
  app.listen(env.PORT, () =>
    logger.info(
      { port: env.PORT, service: env.SERVICE_NAME },
      "HTTP server up"
    )
  );
}
