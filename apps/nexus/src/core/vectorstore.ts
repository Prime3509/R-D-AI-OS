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
      // Dimension comes from a real embed call (not a hardcoded constant) so the
      // schema always matches whatever NEXUS_EMBEDDING_MODEL actually produces.
      // Note: swapping models against an existing data dir still requires a
      // fresh NEXUS_DATA_DIR — LanceDB's vector column has a fixed width.
      const probeVector = await getEmbedder().embed("nexus-schema-init");
      const seedRow: FactRow = {
        id: "__seed__",
        text: "",
        vector: new Array(probeVector.length).fill(0),
        project: "",
        tags: "[]",
        source: "",
        createdAt: new Date(0).toISOString(),
      };
      const table = await db.createTable(FACTS_TABLE, [seedRow]);
      await table.delete("id = '__seed__'");
      return table;
    })().catch((err) => {
      // Don't cache a permanently-rejected promise: a transient failure (e.g.
      // two processes racing to create the table on first boot) would
      // otherwise wedge the facts subsystem for the rest of the process.
      factsTablePromise = null;
      throw err;
    });
  }
  return factsTablePromise;
}

export async function upsertFact(row: FactRow): Promise<void> {
  const table = await getFactsTable();
  await table.mergeInsert("id").whenMatchedUpdateAll().whenNotMatchedInsertAll().execute([row]);

  writesSinceReindex += 1;
  if (writesSinceReindex >= REINDEX_WRITE_INTERVAL) {
    writesSinceReindex = 0;
    // Fire-and-forget: an ANN index rebuild can take a while and shouldn't
    // block the caller's write.
    ensureVectorIndex(table, VECTOR_COLUMN).catch((err) =>
      console.error("[nexus] write-triggered reindex failed:", err),
    );
  }
}

export async function deleteFact(id: string): Promise<boolean> {
  const table = await getFactsTable();
  const escapedId = id.replace(/'/g, "''");
  const existed = (await table.countRows(`id = '${escapedId}'`)) > 0;
  await table.delete(`id = '${escapedId}'`);
  return existed;
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

export async function searchFactsByVector(
  embedding: number[],
  limit: number,
  project?: string,
): Promise<VectorSearchHit[]> {
  const table = await getFactsTable();
  let query = table.query().nearestTo(embedding).distanceType("cosine");
  if (project) query = query.where(`project = '${project.replace(/'/g, "''")}'`);
  const rows = (await query.limit(limit).toArray()) as VectorSearchHit[];
  return rows;
}

export async function reindexFactsNow(): Promise<void> {
  const table = await getFactsTable();
  writesSinceReindex = 0;
  await ensureVectorIndex(table, VECTOR_COLUMN);
}

let scheduledReindexTimer: NodeJS.Timeout | null = null;

/**
 * Periodically re-evaluates the facts index in the background. `writesSinceReindex`
 * is an in-memory, per-process counter, so it resets on restart and is tracked
 * independently by every process in a horizontally-scaled deployment — this
 * scheduled sweep is the backstop that keeps the index current in either case.
 */
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
