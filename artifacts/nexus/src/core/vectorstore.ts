import { connect, type Connection, type Table } from "@lancedb/lancedb";
import { vectorDbDir } from "./paths.js";
import { ensureVectorIndex } from "./index-selector.js";
import { getEmbedder } from "./embeddings.js";

export interface FactRow {
  [key: string]: unknown;
  id: string;
  text: string;
  vector: number[];
  project: string;
  tags: string;
  source: string;
  createdAt: string;
}

const FACTS_TABLE = "facts";
const VECTOR_COLUMN = "vector";

/** Writes past this count trigger a re-check of whether the index should be (re)built. */
const REINDEX_WRITE_INTERVAL = 100;

let connectionPromise: Promise<Connection> | null = null;
let factsTablePromise: Promise<Table> | null = null;
let writesSinceReindex = 0;

async function getConnection(): Promise<Connection> {
  if (!connectionPromise) {
    connectionPromise = connect(vectorDbDir);
  }
  return connectionPromise;
}

async function getFactsTable(): Promise<Table> {
  if (!factsTablePromise) {
    factsTablePromise = (async () => {
      const db = await getConnection();
      const names = await db.tableNames();
      if (names.includes(FACTS_TABLE)) {
        return db.openTable(FACTS_TABLE);
      }
      const dims = getEmbedder().dimensions;
      const seedRow: FactRow = {
        id: "__seed__",
        text: "",
        vector: new Array(dims).fill(0),
        project: "",
        tags: "[]",
        source: "",
        createdAt: new Date(0).toISOString(),
      };
      const table = await db.createTable(FACTS_TABLE, [seedRow]);
      await table.delete("id = '__seed__'");
      return table;
    })();
  }
  return factsTablePromise;
}

export async function upsertFact(row: FactRow): Promise<void> {
  const table = await getFactsTable();
  await table.mergeInsert("id").whenMatchedUpdateAll().whenNotMatchedInsertAll().execute([row]);

  writesSinceReindex += 1;
  if (writesSinceReindex >= REINDEX_WRITE_INTERVAL) {
    writesSinceReindex = 0;
    await ensureVectorIndex(table, VECTOR_COLUMN);
  }
}

export async function deleteFact(id: string): Promise<void> {
  const table = await getFactsTable();
  await table.delete(`id = '${id.replace(/'/g, "''")}'`);
}

export interface VectorSearchHit {
  id: string;
  text: string;
  project: string;
  tags: string;
  source: string;
  createdAt: string;
  /** Cosine distance, in [0, 2] — lower is more similar. */
  _distance: number;
}

export async function searchFactsByVector(embedding: number[], limit: number): Promise<VectorSearchHit[]> {
  const table = await getFactsTable();
  const rows = (await table
    .query()
    .nearestTo(embedding)
    .distanceType("cosine")
    .limit(limit)
    .toArray()) as VectorSearchHit[];
  return rows;
}

export async function reindexFactsNow(): Promise<void> {
  const table = await getFactsTable();
  writesSinceReindex = 0;
  await ensureVectorIndex(table, VECTOR_COLUMN);
}

let scheduledReindexTimer: NodeJS.Timeout | null = null;

/** Periodically re-evaluates the facts index in the background (e.g. after bulk imports that bypass `upsertFact`'s write counter). */
export function scheduleFactsReindexing(intervalMs = 30 * 60_000): void {
  if (scheduledReindexTimer) return;
  scheduledReindexTimer = setInterval(() => {
    reindexFactsNow().catch((err) => console.error("[nexus] scheduled reindex failed:", err));
  }, intervalMs);
  scheduledReindexTimer.unref();
}

export function stopScheduledReindexing(): void {
  if (scheduledReindexTimer) {
    clearInterval(scheduledReindexTimer);
    scheduledReindexTimer = null;
  }
}
