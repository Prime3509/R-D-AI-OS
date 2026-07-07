import { getEmbedder } from "./embeddings.js";

/**
 * Loads the embedding model once at startup so the first real request isn't
 * the one paying for the (multi-second) model load.
 */
export async function prewarm(): Promise<void> {
  await getEmbedder().embed("nexus startup pre-warm");
}
