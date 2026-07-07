import { Router } from "express";
import { z } from "zod";
import { saveAsset, getAssets } from "../../domain/assets.js";

export const assetsRouter = Router();

const listQuerySchema = z.object({
  project: z.string().optional(),
  kind: z.enum(["code", "prompt", "research", "other"]).optional(),
});

assetsRouter.post("/assets", async (req, res) => {
  res.status(201).json(await saveAsset(req.body));
});

assetsRouter.get("/assets", async (req, res) => {
  const parsed = listQuerySchema.safeParse(req.query);
  if (!parsed.success) return void res.status(400).json({ error: parsed.error.message });
  res.json(await getAssets(parsed.data));
});
