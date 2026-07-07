import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const packageRoot = path.resolve(fileURLToPath(import.meta.url), "..", "..", "..");

export const dataDir = process.env.NEXUS_DATA_DIR
  ? path.resolve(process.env.NEXUS_DATA_DIR)
  : path.join(packageRoot, "data");

export const notesDir = path.join(dataDir, "notes");
export const factsDir = path.join(dataDir, "facts");
export const decisionsDir = path.join(dataDir, "decisions");
export const assetsDir = path.join(dataDir, "assets");
export const vectorDbDir = path.join(dataDir, "vectordb");
export const cacheDir = process.env.NEXUS_CACHE_DIR
  ? path.resolve(process.env.NEXUS_CACHE_DIR)
  : path.join(packageRoot, ".cache");

export function ensureDataDirs(): void {
  for (const dir of [notesDir, factsDir, decisionsDir, assetsDir, vectorDbDir, cacheDir]) {
    mkdirSync(dir, { recursive: true });
  }
}
