import { z } from "zod";

export const NoteSchema = z.object({
  id: z.string(),
  title: z.string(),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
  body: z.string(),
});
export type Note = z.infer<typeof NoteSchema>;

export const MemoryFactSchema = z.object({
  id: z.string(),
  fact: z.string(),
  source: z.string().optional(),
  project: z.string().optional(),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
});
export type MemoryFact = z.infer<typeof MemoryFactSchema>;

export const DecisionSchema = z.object({
  id: z.string(),
  title: z.string(),
  context: z.string(),
  decision: z.string(),
  consequences: z.string().optional(),
  project: z.string().optional(),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
});
export type Decision = z.infer<typeof DecisionSchema>;

export const AssetSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.enum(["code", "prompt", "research", "other"]).default("other"),
  project: z.string().optional(),
  version: z.number().int().positive().default(1),
  tags: z.array(z.string()).default([]),
  createdAt: z.string(),
  updatedAt: z.string(),
  content: z.string(),
});
export type Asset = z.infer<typeof AssetSchema>;

export interface FactSearchResult {
  fact: MemoryFact;
  score: number;
  matchType: "semantic" | "keyword";
}

export interface TeachingFeedback {
  summary: string;
  antiPatterns: Array<{
    pattern: string;
    detail: string;
    refs: string[];
  }>;
  generatedAt: string;
}
