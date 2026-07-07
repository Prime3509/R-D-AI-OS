import { cacheDir } from "./paths.js";

export interface Embedder {
  embed(text: string): Promise<number[]>;
}

const DEFAULT_MODEL = process.env.NEXUS_EMBEDDING_MODEL ?? "Xenova/all-MiniLM-L6-v2";

type FeatureExtractionPipeline = (
  text: string,
  options: { pooling: "mean"; normalize: boolean },
) => Promise<{ data: Float32Array | number[] }>;

/**
 * Local sentence-embedding model loaded on demand via transformers.js.
 * The model is downloaded once from the Hugging Face Hub and cached under
 * `cacheDir`; subsequent calls run fully offline.
 */
class TransformersEmbedder implements Embedder {
  private pipelinePromise: Promise<FeatureExtractionPipeline> | null = null;

  private async getPipeline(): Promise<FeatureExtractionPipeline> {
    if (!this.pipelinePromise) {
      this.pipelinePromise = (async () => {
        const { pipeline, env } = await import("@huggingface/transformers");
        env.cacheDir = cacheDir;
        return (await pipeline("feature-extraction", DEFAULT_MODEL)) as unknown as FeatureExtractionPipeline;
      })();
    }
    return this.pipelinePromise;
  }

  async embed(text: string): Promise<number[]> {
    const extractor = await this.getPipeline();
    const output = await extractor(text, { pooling: "mean", normalize: true });
    return Array.from(output.data);
  }
}

let singleton: Embedder | null = null;

export function getEmbedder(): Embedder {
  if (!singleton) singleton = new TransformersEmbedder();
  return singleton;
}

/** Test/CI seam: swap in a deterministic embedder that needs no model download. */
export function setEmbedder(embedder: Embedder): void {
  singleton = embedder;
}
