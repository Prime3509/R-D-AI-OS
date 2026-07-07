import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { rmSync } from "node:fs";
import path from "node:path";
import os from "node:os";

const dataDir = path.join(os.tmpdir(), `nexus-domain-test-${Date.now()}`);
process.env.NEXUS_DATA_DIR = dataDir;

let notes: typeof import("../src/domain/notes.js");
let facts: typeof import("../src/domain/facts.js");
let decisions: typeof import("../src/domain/decisions.js");
let assets: typeof import("../src/domain/assets.js");
let teaching: typeof import("../src/domain/teaching.js");

beforeAll(async () => {
  const { setEmbedder } = await import("../src/core/embeddings.js");
  setEmbedder({
    dimensions: 8,
    async embed(text: string) {
      const v = new Array(8).fill(0);
      for (let i = 0; i < text.length; i++) v[i % 8] += text.charCodeAt(i) / 255;
      const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
      return v.map((x) => x / norm);
    },
  });
  notes = await import("../src/domain/notes.js");
  facts = await import("../src/domain/facts.js");
  decisions = await import("../src/domain/decisions.js");
  assets = await import("../src/domain/assets.js");
  teaching = await import("../src/domain/teaching.js");
}, 30_000);

afterAll(() => {
  rmSync(dataDir, { recursive: true, force: true });
});

describe("notes", () => {
  it("creates a note and reads it back", async () => {
    const created = await notes.writeNote({ title: "Hello", body: "world", tags: ["t1"] });
    const read = await notes.readNote(created.id);
    expect(read?.title).toBe("Hello");
    expect(read?.tags).toEqual(["t1"]);
  });

  it("updates a note in place when given its id", async () => {
    const created = await notes.writeNote({ title: "V1", body: "first" });
    const updated = await notes.writeNote({ id: created.id, title: "V2", body: "second" });
    expect(updated.id).toBe(created.id);
    expect(updated.createdAt).toBe(created.createdAt);
    expect((await notes.readNote(created.id))?.body).toBe("second");
  });
});

describe("facts + semantic recall", () => {
  it("saves facts and recalls the most similar one first", async () => {
    await facts.saveFact({ fact: "The database layer uses PostgreSQL with Drizzle ORM.", project: "p1" });
    await facts.saveFact({ fact: "The frontend is built with React and Vite.", project: "p1" });

    const results = await facts.recallFacts({ query: "what database do we use", mode: "semantic", limit: 2 });
    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.fact.fact).toMatch(/PostgreSQL/);
    expect(results[0]?.matchType).toBe("semantic");
  });

  it("finds exact substrings via keyword mode even with an unrelated query embedding", async () => {
    await facts.saveFact({ fact: "unique-keyword-marker-xyz appears here", project: "p2" });
    const results = await facts.recallFacts({ query: "unique-keyword-marker-xyz", mode: "keyword", project: "p2" });
    expect(results).toHaveLength(1);
    expect(results[0]?.matchType).toBe("keyword");
  });
});

describe("decisions", () => {
  it("logs and lists decisions newest first", async () => {
    await decisions.logDecision({ title: "First", context: "c", decision: "d" });
    await new Promise((r) => setTimeout(r, 5));
    await decisions.logDecision({ title: "Second", context: "c", decision: "d" });
    const list = await decisions.getDecisions();
    expect(list[0]?.title).toBe("Second");
  });
});

describe("assets", () => {
  it("bumps the version when saving an asset with the same name", async () => {
    const v1 = await assets.saveAsset({ name: "shared-name", content: "v1", kind: "code" });
    const v2 = await assets.saveAsset({ name: "shared-name", content: "v2", kind: "code" });
    expect(v1.id).toBe(v2.id);
    expect(v2.version).toBe(v1.version + 1);
    expect((await assets.getAssets({ kind: "code" })).find((a) => a.id === v1.id)?.content).toBe("v2");
  });
});

describe("teaching feedback", () => {
  it("flags decisions without documented consequences", async () => {
    await decisions.logDecision({ title: "Undocumented one", context: "c", decision: "d", project: "teach-proj" });
    const feedback = await teaching.getTeachingFeedback({ project: "teach-proj" });
    expect(feedback.antiPatterns.some((p) => p.pattern === "undocumented-consequences")).toBe(true);
  });

  it("flags code assets with smell markers", async () => {
    await assets.saveAsset({
      name: "smelly-asset",
      kind: "code",
      project: "teach-proj",
      content: "console.log('debug'); // TODO fix this",
    });
    const feedback = await teaching.getTeachingFeedback({ project: "teach-proj" });
    expect(feedback.antiPatterns.some((p) => p.pattern === "code-smell")).toBe(true);
  });
});
