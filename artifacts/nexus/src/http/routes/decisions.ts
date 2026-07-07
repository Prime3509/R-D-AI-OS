import { Router } from "express";
import { logDecision, getDecisions } from "../../domain/decisions.js";

export const decisionsRouter = Router();

decisionsRouter.post("/decisions", async (req, res) => {
  res.status(201).json(await logDecision(req.body));
});

decisionsRouter.get("/decisions", async (req, res) => {
  const { project, limit } = req.query;
  res.json(
    await getDecisions({
      project: project ? String(project) : undefined,
      limit: limit ? Number(limit) : undefined,
    }),
  );
});
