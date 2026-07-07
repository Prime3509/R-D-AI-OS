import { describe, it, expect, beforeEach, afterAll } from "vitest";
import { rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";
import {
  writeMarkdownRecord,
  readMarkdownRecord,
  listMarkdownRecords,
  deleteMarkdownRecord,
} from "../src/core/storage.js";

const dir = path.join(os.tmpdir(), `nexus-storage-test-${Date.now()}`);

beforeEach(() => {
  rmSync(dir, { recursive: true, force: true });
});
afterAll(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe("markdown record storage", () => {
  it("round-trips frontmatter and body", async () => {
    await writeMarkdownRecord(dir, "abc", { title: "Hello", tags: ["a", "b"] }, "body text");
    const record = await readMarkdownRecord(dir, "abc");
    expect(record).toEqual({ id: "abc", frontmatter: { title: "Hello", tags: ["a", "b"] }, body: "body text" });
  });

  it("drops undefined frontmatter fields instead of throwing", async () => {
    await expect(
      writeMarkdownRecord(dir, "opt", { title: "T", project: undefined }, "body"),
    ).resolves.not.toThrow();
    const record = await readMarkdownRecord(dir, "opt");
    expect(record?.frontmatter).toEqual({ title: "T" });
  });

  it("returns null for a missing record", async () => {
    expect(await readMarkdownRecord(dir, "missing")).toBeNull();
  });

  it("lists all records in a directory", async () => {
    await writeMarkdownRecord(dir, "one", { title: "One" }, "1");
    await writeMarkdownRecord(dir, "two", { title: "Two" }, "2");
    const records = await listMarkdownRecords(dir);
    expect(records.map((r) => r.id).sort()).toEqual(["one", "two"]);
  });

  it("returns an empty list for a directory that doesn't exist yet", async () => {
    expect(await listMarkdownRecords(path.join(dir, "nope"))).toEqual([]);
  });

  it("deletes a record", async () => {
    await writeMarkdownRecord(dir, "gone", { title: "Gone" }, "body");
    expect(await deleteMarkdownRecord(dir, "gone")).toBe(true);
    expect(await readMarkdownRecord(dir, "gone")).toBeNull();
    expect(await deleteMarkdownRecord(dir, "gone")).toBe(false);
  });
});
