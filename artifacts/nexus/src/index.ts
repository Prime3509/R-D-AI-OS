#!/usr/bin/env node
import { ensureDataDirs } from "./core/paths.js";
import { startMcpStdioServer } from "./mcp/server.js";
import { startHttpServer } from "./http/server.js";
import { prewarm } from "./core/prewarm.js";
import { scheduleFactsReindexing } from "./core/vectorstore.js";

type Mode = "mcp" | "http" | "both";

function resolveMode(): Mode {
  const argMode = process.argv.find((a) => a.startsWith("--mode="))?.split("=")[1];
  const mode = argMode ?? process.env.NEXUS_MODE ?? "both";
  if (mode !== "mcp" && mode !== "http" && mode !== "both") {
    throw new Error(`invalid mode '${mode}' (expected mcp | http | both)`);
  }
  return mode;
}

async function main(): Promise<void> {
  ensureDataDirs();
  const mode = resolveMode();

  // MCP stdio and the HTTP listener are independent transports and can run
  // in the same process; only stdout is reserved (for MCP JSON-RPC framing),
  // so all logging below goes to stderr via console.error.
  //
  // Pre-warming the embedding model takes several seconds and has no bearing
  // on transport startup (e.g. /health), so it runs in the background instead
  // of delaying readiness; the embedder's lazy singleton already coalesces
  // concurrent callers onto the same in-flight load.
  prewarm().catch((err) => console.error("[nexus] pre-warm failed:", err));
  scheduleFactsReindexing();

  if (mode === "mcp" || mode === "both") {
    await startMcpStdioServer();
    console.error("[nexus] MCP stdio server ready");
  }
  if (mode === "http" || mode === "both") {
    startHttpServer();
  }
}

main().catch((err) => {
  console.error("[nexus] fatal startup error:", err);
  process.exitCode = 1;
});
