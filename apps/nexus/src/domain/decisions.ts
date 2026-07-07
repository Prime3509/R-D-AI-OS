import { nanoid } from "nanoid";
import { decisionsDir, ensureDataDirs } from "../core/paths.js";
import { listMarkdownRecords, writeMarkdownRecord } from "../core/storage.js";
import { DecisionSchema, type Decision } from "../core/types.js";

function toDecision(record: { id: string; frontmatter: Record<string, unknown>; body: string }): Decision {
  return DecisionSchema.parse({
    id: record.id,
    title: record.frontmatter.title,
    context: record.frontmatter.context,
    decision: record.body,
    consequences: record.frontmatter.consequences,
    project: record.frontmatter.project,
    tags: record.frontmatter.tags ?? [],
    createdAt: record.frontmatter.createdAt,
  });
}

export interface LogDecisionInput {
  title: string;
  context: string;
  decision: string;
  consequences?: string;
  project?: string;
  tags?: string[];
}

export async function logDecision(input: LogDecisionInput): Promise<Decision> {
  ensureDataDirs();
  const id = nanoid(10);
  const createdAt = new Date().toISOString();

  const record = DecisionSchema.parse({
    id,
    title: input.title,
    context: input.context,
    decision: input.decision,
    consequences: input.consequences,
    project: input.project,
    tags: input.tags ?? [],
    createdAt,
  });

  await writeMarkdownRecord(
    decisionsDir,
    id,
    {
      title: record.title,
      context: record.context,
      consequences: record.consequences,
      project: record.project,
      tags: record.tags,
      createdAt: record.createdAt,
    },
    record.decision,
  );
  return record;
}

export interface GetDecisionsInput {
  project?: string;
  limit?: number;
}

export async function getDecisions(input: GetDecisionsInput = {}): Promise<Decision[]> {
  const records = await listMarkdownRecords(decisionsDir);
  const decisions = records
    .map(toDecision)
    .filter((d) => (input.project ? d.project === input.project : true))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return input.limit !== undefined ? decisions.slice(0, input.limit) : decisions;
}
