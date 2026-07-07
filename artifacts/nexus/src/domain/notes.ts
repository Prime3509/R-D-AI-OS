import { nanoid } from "nanoid";
import { notesDir, ensureDataDirs } from "../core/paths.js";
import { listMarkdownRecords, readMarkdownRecord, writeMarkdownRecord } from "../core/storage.js";
import { NoteSchema, type Note } from "../core/types.js";

function toNote(record: { id: string; frontmatter: Record<string, unknown>; body: string }): Note {
  return NoteSchema.parse({
    id: record.id,
    title: record.frontmatter.title,
    tags: record.frontmatter.tags ?? [],
    createdAt: record.frontmatter.createdAt,
    updatedAt: record.frontmatter.updatedAt,
    body: record.body,
  });
}

export async function listNotes(): Promise<Note[]> {
  const records = await listMarkdownRecords(notesDir);
  return records.map(toNote).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function readNote(id: string): Promise<Note | null> {
  const record = await readMarkdownRecord(notesDir, id);
  return record ? toNote(record) : null;
}

export interface WriteNoteInput {
  id?: string;
  title: string;
  body: string;
  tags?: string[];
}

export async function writeNote(input: WriteNoteInput): Promise<Note> {
  ensureDataDirs();
  const now = new Date().toISOString();
  const existing = input.id ? await readMarkdownRecord(notesDir, input.id) : null;
  const id = input.id ?? nanoid(10);

  const note = NoteSchema.parse({
    id,
    title: input.title,
    tags: input.tags ?? [],
    createdAt: (existing?.frontmatter.createdAt as string | undefined) ?? now,
    updatedAt: now,
    body: input.body,
  });

  await writeMarkdownRecord(
    notesDir,
    id,
    { title: note.title, tags: note.tags, createdAt: note.createdAt, updatedAt: note.updatedAt },
    note.body,
  );
  return note;
}
