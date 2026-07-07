import { Router } from "express";
import { saveFact, recallFacts } from "../../domain/facts.js";

export const factsRouter = Router();

factsRouter.post("/facts", async (req, res) => {
  const fact = await saveFact(req.body);
  res.status(201).json(fact);
});

factsRouter.get("/facts/recall", async (req, res) => {
  const { query, mode, limit, project } = req.query;
  const results = await recallFacts({
    query: String(query ?? ""),
    mode: mode as "semantic" | "keyword" | "hybrid" | undefined,
    limit: limit ? Number(limit) : undefined,
    project: project ? String(project) : undefined,
  });
  res.json(results);
});
