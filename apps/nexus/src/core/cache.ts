import type { FactSearchResult } from "./types.js";

interface CacheEntry {
  embedding: number[];
  scope: string;
  results: FactSearchResult[];
  expiresAt: number;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    const ai = a[i] ?? 0;
    const bi = b[i] ?? 0;
    dot += ai * bi;
    normA += ai * ai;
    normB += bi * bi;
  }
  if (normA === 0 || normB === 0) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Caches search results keyed by query embedding rather than query text, so
 * paraphrases of the same question ("what's our auth strategy" vs "how do we
 * handle auth") reuse the same cached result once their cosine similarity
 * clears `threshold`.
 */
export class SemanticResultCache {
  private entries: CacheEntry[] = [];

  constructor(
    private readonly threshold = 0.98,
    private readonly ttlMs = 5 * 60_000,
    private readonly maxEntries = 200,
  ) {}

  /** `scope` distinguishes cache entries for different query scopes (e.g. project) that share a query embedding. */
  get(embedding: number[], scope = ""): FactSearchResult[] | null {
    const now = Date.now();
    let best: { entry: CacheEntry; similarity: number } | null = null;
    for (const entry of this.entries) {
      if (entry.expiresAt <= now || entry.scope !== scope) continue;
      const similarity = cosineSimilarity(embedding, entry.embedding);
      if (similarity >= this.threshold && (!best || similarity > best.similarity)) {
        best = { entry, similarity };
      }
    }
    return best ? best.entry.results : null;
  }

  set(embedding: number[], results: FactSearchResult[], scope = ""): void {
    const now = Date.now();
    this.entries = this.entries.filter((e) => e.expiresAt > now);
    this.entries.push({ embedding, scope, results, expiresAt: now + this.ttlMs });
    if (this.entries.length > this.maxEntries) {
      this.entries.splice(0, this.entries.length - this.maxEntries);
    }
  }

  clear(): void {
    this.entries = [];
  }
}
