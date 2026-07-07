import { readFile, writeFile, readdir, unlink, mkdir } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

export interface MarkdownRecord {
  id: string;
  frontmatter: Record<string, unknown>;
  body: string;
}

function recordPath(dir: string, id: string): string {
  return path.join(dir, `${id}.md`);
}

export async function writeMarkdownRecord(
  dir: string,
  id: string,
  frontmatter: Record<string, unknown>,
  body: string,
): Promise<void> {
  const cleanFrontmatter = Object.fromEntries(
    Object.entries(frontmatter).filter(([, value]) => value !== undefined),
  );
  const file = matter.stringify(body, cleanFrontmatter);
  await mkdir(dir, { recursive: true });
  await writeFile(recordPath(dir, id), file, "utf-8");
}

export async function readMarkdownRecord(dir: string, id: string): Promise<MarkdownRecord | null> {
  try {
    const raw = await readFile(recordPath(dir, id), "utf-8");
    const parsed = matter(raw);
    return { id, frontmatter: parsed.data, body: parsed.content.trim() };
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

export async function listMarkdownRecords(dir: string): Promise<MarkdownRecord[]> {
  let files: string[];
  try {
    files = await readdir(dir);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }

  const records = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map((f) => readMarkdownRecord(dir, path.basename(f, ".md"))),
  );
  return records.filter((r): r is MarkdownRecord => r !== null);
}

export async function deleteMarkdownRecord(dir: string, id: string): Promise<boolean> {
  try {
    await unlink(recordPath(dir, id));
    return true;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return false;
    throw err;
  }
}
