import { Router } from "express";
import { saveAsset, getAssets } from "../../domain/assets.js";
import type { Asset } from "../../core/types.js";

export const assetsRouter = Router();

assetsRouter.post("/assets", async (req, res) => {
  res.status(201).json(await saveAsset(req.body));
});

assetsRouter.get("/assets", async (req, res) => {
  const { project, kind } = req.query;
  res.json(
    await getAssets({
      project: project ? String(project) : undefined,
      kind: kind ? (String(kind) as Asset["kind"]) : undefined,
    }),
  );
});
