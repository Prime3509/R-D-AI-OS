import { Router } from "express";
import { listNotes, readNote, writeNote } from "../../domain/notes.js";

export const notesRouter = Router();

notesRouter.get("/notes", async (_req, res) => {
  res.json(await listNotes());
});

notesRouter.get("/notes/:id", async (req, res) => {
  const note = await readNote(req.params.id);
  if (!note) return void res.status(404).json({ error: `note '${req.params.id}' not found` });
  res.json(note);
});

notesRouter.post("/notes", async (req, res) => {
  const note = await writeNote(req.body);
  res.status(201).json(note);
});
