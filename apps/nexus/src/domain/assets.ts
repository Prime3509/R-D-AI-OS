import { assetsDir, ensureDataDirs } from "../core/paths.js";
import { listMarkdownRecords, readMarkdownRecord, writeMarkdownRecord } from "../core/storage.js";
import { AssetSchema, type Asset } from "../core/types.js";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toAsset(record: { id: string; frontmatter: Record<string, unknown>; body: string }): Asset {
  return AssetSchema.parse({
    id: record.id,
    name: record.frontmatter.name,
    kind: record.frontmatter.kind ?? "other",
    project: record.frontmatter.project,
    version: record.frontmatter.version ?? 1,
    tags: record.frontmatter.tags ?? [],
    createdAt: record.frontmatter.createdAt,
    updatedAt: record.frontmatter.updatedAt,
    content: record.body,
  });
}

export interface SaveAssetInput {
  name: string;
  content: string;
  kind?: Asset["kind"];
  project?: string;
  tags?: string[];
}

/** Saving an asset with an already-used name updates it in place and bumps `version`. */
export async function saveAsset(input: SaveAssetInput): Promise<Asset> {
  ensureDataDirs();
  const id = slugify(input.name);
  const now = new Date().toISOString();
  const existing = await readMarkdownRecord(assetsDir, id);

  const asset = AssetSchema.parse({
    id,
    name: input.name,
    kind: input.kind ?? "other",
    project: input.project,
    version: ((existing?.frontmatter.version as number | undefined) ?? 0) + 1,
    tags: input.tags ?? [],
    createdAt: (existing?.frontmatter.createdAt as string | undefined) ?? now,
    updatedAt: now,
    content: input.content,
  });

  await writeMarkdownRecord(
    assetsDir,
    id,
    {
      name: asset.name,
      kind: asset.kind,
      project: asset.project,
      version: asset.version,
      tags: asset.tags,
      createdAt: asset.createdAt,
      updatedAt: asset.updatedAt,
    },
    asset.content,
  );
  return asset;
}

export interface GetAssetsInput {
  project?: string;
  kind?: Asset["kind"];
}

export async function getAssets(input: GetAssetsInput = {}): Promise<Asset[]> {
  const records = await listMarkdownRecords(assetsDir);
  return records
    .map(toAsset)
    .filter((a) => (input.project ? a.project === input.project : true))
    .filter((a) => (input.kind ? a.kind === input.kind : true))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}
