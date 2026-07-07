import express, { type ErrorRequestHandler } from "express";
import { healthRouter } from "./routes/health.js";
import { notesRouter } from "./routes/notes.js";
import { factsRouter } from "./routes/facts.js";
import { decisionsRouter } from "./routes/decisions.js";
import { assetsRouter } from "./routes/assets.js";
import { teachingRouter } from "./routes/teaching.js";

const DEFAULT_PORT = 3456;

export function createHttpApp() {
  const app = express();
  app.use(express.json());

  app.use(healthRouter);
  app.use(notesRouter);
  app.use(factsRouter);
  app.use(decisionsRouter);
  app.use(assetsRouter);
  app.use(teachingRouter);

  const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
    console.error("[nexus] request error:", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "internal error" });
  };
  app.use(errorHandler);

  return app;
}

export function startHttpServer(port = Number(process.env.NEXUS_HTTP_PORT ?? DEFAULT_PORT)) {
  const app = createHttpApp();
  return app.listen(port, () => {
    console.error(`[nexus] HTTP API listening on port ${port}`);
  });
}
