import { Router } from "express";
import { z } from "zod";
import { logDecision, getDecisions } from "../../domain/decisions.js";

export const decisionsRouter = Router();

const listQuerySchema = z.object({
  project: z.string().optional(),
  limit: z.coerce.number().int().positive().optional(),
});

decisionsRouter.post("/decisions", async (req, res) => {
  res.status(201).json(await logDecision(req.body));
});

decisionsRouter.get("/decisions", async (req, res) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) return void res.status(400).json({ error: parsed.error.message });
  res.json(await getDecisions(parsed.data));
});
