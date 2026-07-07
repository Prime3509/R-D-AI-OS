import { Router } from "express";
import { getTeachingFeedback } from "../../domain/teaching.js";

export const teachingRouter = Router();

teachingRouter.get("/teaching-feedback", async (req, res) => {
  const { project } = req.query;
  res.json(await getTeachingFeedback({ project: project ? String(project) : undefined }));
});
