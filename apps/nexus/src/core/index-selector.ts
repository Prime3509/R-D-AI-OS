import type { Table } from "@lancedb/lancedb";
import { Index } from "@lancedb/lancedb";

/**
 * Below this row count a brute-force scan is faster than building and
 * maintaining an ANN index, so we skip indexing entirely.
 */
const MIN_ROWS_FOR_INDEX = 1_000;

/**
 * Past this row count IVF_PQ's smaller memory footprint wins over HNSW's
 * higher recall/build cost.
 */
const IVF_PQ_ROW_THRESHOLD = 200_000;

export type SelectedIndexKind = "none" | "hnsw_sq" | "ivf_pq";

export function selectIndexKind(rowCount: number): SelectedIndexKind {
  if (rowCount < MIN_ROWS_FOR_INDEX) return "none";
  if (rowCount < IVF_PQ_ROW_THRESHOLD) return "hnsw_sq";
  return "ivf_pq";
}

/**
 * Creates (or replaces) a vector index on `column` sized to the table's
 * current row count, skipping the call entirely when brute force is still
 * the better choice.
 */
export async function ensureVectorIndex(table: Table, column: string): Promise<SelectedIndexKind> {
  const rowCount = await table.countRows();
  const kind = selectIndexKind(rowCount);
  if (kind === "none") return kind;

  const config =
    kind === "hnsw_sq" ? Index.hnswSq({ distanceType: "cosine" }) : Index.ivfPq({ distanceType: "cosine" });

  await table.createIndex(column, { config, replace: true });
  return kind;
}
