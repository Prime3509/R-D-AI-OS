import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { listNotes, readNote, writeNote } from "../domain/notes.js";
import { saveFact, recallFacts } from "../domain/facts.js";
import { logDecision, getDecisions } from "../domain/decisions.js";
import { saveAsset, getAssets } from "../domain/assets.js";
import { getTeachingFeedback } from "../domain/teaching.js";

function json(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

export function createNexusMcpServer(): McpServer {
  const server = new McpServer({ name: "rd-nexus", version: "0.1.0" });

  server.registerTool(
    "nexus_list_notes",
    { description: "List all notes stored in Nexus, most recently updated first." },
    async () => json(await listNotes()),
  );

  server.registerTool(
    "nexus_read_note",
    {
      description: "Read a single note by id.",
      inputSchema: { id: z.string().describe("Note id") },
    },
    async ({ id }) => {
      const note = await readNote(id);
      return note ? json(note) : json({ error: `note '${id}' not found` });
    },
  );

  server.registerTool(
    "nexus_write_note",
    {
      description: "Create or update a note. Pass an existing id to update it, omit it to create a new note.",
      inputSchema: {
        id: z.string().optional().describe("Existing note id to update"),
        title: z.string(),
        body: z.string(),
        tags: z.array(z.string()).optional(),
      },
    },
    async (args) => json(await writeNote(args)),
  );

  server.registerTool(
    "nexus_save_fact",
    {
      description: "Save a memory fact with an embedding for later semantic recall.",
      inputSchema: {
        fact: z.string(),
        source: z.string().optional(),
        project: z.string().optional(),
        tags: z.array(z.string()).optional(),
      },
    },
    async (args) => json(await saveFact(args)),
  );

  server.registerTool(
    "nexus_recall_facts",
    {
      description: "Recall memory facts via semantic search, keyword search, or both (hybrid, default).",
      inputSchema: {
        query: z.string(),
        mode: z.enum(["semantic", "keyword", "hybrid"]).optional(),
        limit: z.number().int().positive().optional(),
        project: z.string().optional(),
      },
    },
    async (args) => json(await recallFacts(args)),
  );

  server.registerTool(
    "nexus_log_decision",
    {
      description: "Log a decision with its context, the decision itself, and (optionally) its consequences.",
      inputSchema: {
        title: z.string(),
        context: z.string(),
        decision: z.string(),
        consequences: z.string().optional(),
        project: z.string().optional(),
        tags: z.array(z.string()).optional(),
      },
    },
    async (args) => json(await logDecision(args)),
  );

  server.registerTool(
    "nexus_get_decisions",
    {
      description: "List logged decisions, most recent first.",
      inputSchema: {
        project: z.string().optional(),
        limit: z.number().int().positive().optional(),
      },
    },
    async (args) => json(await getDecisions(args)),
  );

  server.registerTool(
    "nexus_save_asset",
    {
      description: "Save a versioned asset (code, prompt, or research). Re-saving the same name bumps its version.",
      inputSchema: {
        name: z.string(),
        content: z.string(),
        kind: z.enum(["code", "prompt", "research", "other"]).optional(),
        project: z.string().optional(),
        tags: z.array(z.string()).optional(),
      },
    },
    async (args) => json(await saveAsset(args)),
  );

  server.registerTool(
    "nexus_get_assets",
    {
      description: "List saved assets, optionally filtered by project or kind.",
      inputSchema: {
        project: z.string().optional(),
        kind: z.enum(["code", "prompt", "research", "other"]).optional(),
      },
    },
    async (args) => json(await getAssets(args)),
  );

  server.registerTool(
    "nexus_get_teaching_feedback",
    {
      description: "Surface teaching feedback and anti-patterns detected across logged decisions and assets.",
      inputSchema: { project: z.string().optional() },
    },
    async (args) => json(await getTeachingFeedback(args)),
  );

  return server;
}

export async function startMcpStdioServer(): Promise<void> {
  const server = createNexusMcpServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}
