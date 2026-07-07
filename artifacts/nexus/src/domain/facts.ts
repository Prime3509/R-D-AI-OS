import { nanoid } from "nanoid";
import { factsDir, ensureDataDirs } from "../core/paths.js";
import { listMarkdownRecords, writeMarkdownRecord, deleteMarkdownRecord } from "../core/storage.js";
import { MemoryFactSchema, type MemoryFact, type FactSearchResult } from "../core/types.js";
import { getEmbedder } from "../core/embeddings.js";
import { upsertFact, deleteFact as deleteFactVector, searchFactsByVector } from "../core/vectorstore.js";
import { SemanticResultCache } from "../core/cache.js";

const searchCache = new SemanticResultCache();

function toFact(record: { id: string; frontmatter: Record<string, unknown>; body: string }): MemoryFact {
  return MemoryFactSchema.parse({
    id: record.id,
    fact: record.body,
    source: record.frontmatter.source,
    project: record.frontmatter.project,
    tags: record.frontmatter.tags ?? [],
    createdAt: record.frontmatter.createdAt,
  });
}

export interface SaveFactInput {
  fact: string;
  source?: string;
  project?: string;
  tags?: string[];
}

export async function saveFact(input: SaveFactInput): Promise<MemoryFact> {
  ensureDataDirs();
  const id = nanoid(10);
  const createdAt = new Date().toISOString();

  const record = MemoryFactSchema.parse({
    id,
    fact: input.fact,
    source: input.source,
    project: input.project,
    tags: input.tags ?? [],
    createdAt,
  });

  await writeMarkdownRecord(
    factsDir,
    id,
    { source: record.source, project: record.project, tags: record.tags, createdAt: record.createdAt },
    record.fact,
  );

  const embedding = await getEmbedder().embed(record.fact);
  await upsertFact({
    id,
    text: record.fact,
    vector: embedding,
    project: record.project ?? "",
    tags: JSON.stringify(record.tags),
    source: record.source ?? "",
    createdAt: record.createdAt,
  });
  searchCache.clear();

  return record;
}

export async function deleteFact(id: string): Promise<void> {
  await deleteMarkdownRecord(factsDir, id);
  await deleteFactVector(id);
  searchCache.clear();
}

export interface RecallFactsInput {
  query: string;
  mode?: "semantic" | "keyword" | "hybrid";
  limit?: number;
  project?: string;
}

async function recallByKeyword(query: string, limit: number, project?: string): Promise<FactSearchResult[]> {
  const records = await listMarkdownRecords(factsDir);
  const needle = query.toLowerCase();
  return records
    .map(toFact)
    .filter((fact) => (project ? fact.project === project : true))
    .filter((fact) => fact.fact.toLowerCase().includes(needle))
    .slice(0, limit)
    .map((fact) => ({ fact, score: 1, matchType: "keyword" as const }));
}

async function recallBySemantic(query: string, limit: number, project?: string): Promise<FactSearchResult[]> {
  const embedding = await getEmbedder().embed(query);

  const cached = searchCache.get(embedding);
  if (cached) return project ? cached.filter((h) => h.fact.project === project) : cached;

  const vectorHits = await searchFactsByVector(embedding, Math.max(limit * 3, limit));
  const results: FactSearchResult[] = vectorHits
    .filter((hit) => hit.id !== "__seed__")
    .map((hit) => ({
      fact: MemoryFactSchema.parse({
        id: hit.id,
        fact: hit.text,
        source: hit.source || undefined,
        project: hit.project || undefined,
        tags: JSON.parse(hit.tags || "[]"),
        createdAt: hit.createdAt,
      }),
      // cosine distance in [0, 2] -> similarity in [0, 1]
      score: 1 - hit._distance / 2,
      matchType: "semantic" as const,
    }));

  searchCache.set(embedding, results);
  return (project ? results.filter((r) => r.fact.project === project) : results).slice(0, limit);
}

export async function recallFacts(input: RecallFactsInput): Promise<FactSearchResult[]> {
  const limit = input.limit ?? 10;
  const mode = input.mode ?? "hybrid";

  if (mode === "keyword") return recallByKeyword(input.query, limit, input.project);
  if (mode === "semantic") return recallBySemantic(input.query, limit, input.project);

  const [semantic, keyword] = await Promise.all([
    recallBySemantic(input.query, limit, input.project),
    recallByKeyword(input.query, limit, input.project),
  ]);
  const seen = new Set<string>();
  const merged: FactSearchResult[] = [];
  for (const result of [...semantic, ...keyword]) {
    if (seen.has(result.fact.id)) continue;
    seen.add(result.fact.id);
    merged.push(result);
  }
  return merged.sort((a, b) => b.score - a.score).slice(0, limit);
}
