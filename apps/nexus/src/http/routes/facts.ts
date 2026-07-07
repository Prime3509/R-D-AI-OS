import { Router } from "express";
import { z } from "zod";
import { saveFact, recallFacts } from "../../domain/facts.js";

export const factsRouter = Router();

const recallQuerySchema = z.object({
  query: z.string().min(1),
  mode: z.enum(["semantic", "keyword", "hybrid"]).optional(),
  limit: z.coerce.number().int().positive().optional(),
  project: z.string().optional(),
});

factsRouter.post("/facts", async (req, res) => {
  const fact = await saveFact(req.body);
  res.status(201).json(fact);
});

factsRouter.get("/facts/recall", async (req, res) => {
  const parsed = recallQuerySchema.safeParse(req.query);
  if (!parsed.success) return void res.status(400).json({ error: parsed.error.message });
  res.json(await recallFacts(parsed.data));
});
