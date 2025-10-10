// src/infra/http/server.ts
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import pinoHttp from "pino-http";
import { env, getCorsOrigin } from "@config/env";
import logger from "@shared/logger";
import { randomUUID } from "node:crypto";

const IGNORE = new Set<string>([
  //"/health",
  "/favicon.ico",
  "/apple-touch-icon.png",
  "/apple-touch-icon-precomposed.png",
]);

export function buildServer() {
  const app = express();

  app.disable("x-powered-by");
  app.use(cors({ origin: getCorsOrigin(), credentials: true }));
  app.use(cookieParser());
  app.use(express.json());
  app.disable("x-powered-by");

  // ✅ pino-http request id + logging (keeps your previous options)
  app.use(
    pinoHttp({
      logger,
      genReqId: () => randomUUID(),
      redact: { paths: ["req.headers.cookie"], censor: "[redacted]" },
      autoLogging: {
        ignore: (req) =>
          new Set([
            "/favicon.ico",
            "/apple-touch-icon.png",
            "/apple-touch-icon-precomposed.png",
          ]).has(req.url ?? req.originalUrl ?? ""),
      },
      serializers: {
        req: (req) => ({
          id: (req as any).id,
          method: req.method,
          url: req.url,
        }),
        res: (res) => ({ statusCode: res.statusCode }),
      },
    })
  );

  // health (already)
  app.get("/health", (_req, res) =>
    res.json({ ok: true, service: env.SERVICE_NAME })
  );

  // readiness (expand later to check DB/cache/etc)
  app.get("/ready", (_req, res) => res.json({ ready: true }));

  // MCP SSE endpoint
  app.get("/mcp", async (req, res) => {
    const { handleMCPSSE } = await import("@mcp/server");
    await handleMCPSSE(req, res);
  });

  // 404
  app.use((_req, res) => res.status(404).json({ error: "Not Found" }));

  // error handler
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    logger.info({ port: env.PORT, host: env.BACKEND_DOMAIN }, "HTTP server up")
  );
}
