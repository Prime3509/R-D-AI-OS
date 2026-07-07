# R&D Nexus

Shared memory and knowledge operating system for R&D Collective. Nexus is a
hybrid **MCP (stdio) + HTTP** server: the same domain logic is exposed as MCP
tools for AI clients (Claude, Cursor, etc.) and as a REST API for other apps
(e.g. R&D Forge).

See [`docs/MASTERFILE.md`](../../docs/MASTERFILE.md) for the full spec this
package implements against (the Nexus-only [v1.1 doc](../../docs/nexus/MASTERFILE.md)
is kept for historical reference).

## Storage model

- **Markdown + frontmatter** (via `gray-matter`) for notes, facts, decisions,
  and assets — human-readable files under `NEXUS_DATA_DIR` (default: `./data`).
- **LanceDB** for vector search over facts. A `facts` table stores each fact's
  embedding alongside its id/project/tags so semantic recall doesn't have to
  re-scan markdown files.

## Quick start

```bash
cd apps/nexus
pnpm install
pnpm run build

# Hybrid mode (MCP stdio + HTTP on :3456) — the default
pnpm start

# Or run a single transport
pnpm run start:mcp
pnpm run start:http
```

On first use, the embedding model (`Xenova/all-MiniLM-L6-v2` by default) is
downloaded from the Hugging Face Hub and cached under `.cache/`; after that,
embedding runs fully offline.

### Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `NEXUS_DATA_DIR` | `./data` | Root dir for markdown storage + the LanceDB table |
| `NEXUS_CACHE_DIR` | `./.cache` | Embedding model cache |
| `NEXUS_HTTP_PORT` | `3456` | HTTP API port |
| `NEXUS_MODE` | `both` | `mcp` \| `http` \| `both` — overridden by `--mode=` |
| `NEXUS_EMBEDDING_MODEL` | `Xenova/all-MiniLM-L6-v2` | Any transformers.js feature-extraction model |

## MCP client configuration

```json
{
  "mcpServers": {
    "rd-nexus": {
      "command": "node",
      "args": ["/absolute/path/to/apps/nexus/dist/index.js", "--mode=mcp"]
    }
  }
}
```

### Tools

`nexus_list_notes`, `nexus_read_note`, `nexus_write_note`, `nexus_save_fact`,
`nexus_recall_facts`, `nexus_log_decision`, `nexus_get_decisions`,
`nexus_save_asset`, `nexus_get_assets`, `nexus_get_teaching_feedback`.

## HTTP API

| Method & path | Purpose |
|---|---|
| `GET /health` | Liveness check |
| `GET /notes`, `GET /notes/:id`, `POST /notes` | Notes |
| `POST /facts`, `GET /facts/recall?query=&mode=&limit=&project=` | Facts |
| `POST /decisions`, `GET /decisions?project=&limit=` | Decisions |
| `POST /assets`, `GET /assets?project=&kind=` | Assets |
| `GET /teaching-feedback?project=` | Anti-pattern / teaching feedback |

## Development

```bash
pnpm run dev         # tsx watch
pnpm run typecheck
pnpm test            # vitest, uses a mocked embedder — no network needed
```

## Known limitation

This was built in a network-restricted sandbox where the Hugging Face Hub
(model download) is not reachable, so the embedding pipeline itself could not
be smoke-tested end-to-end here. Storage, LanceDB vector search, the HTTP API,
and all domain logic were verified directly with a deterministic mock embedder
(see `tests/`). On a machine with normal internet access, the first
`saveFact`/`recallFacts` call will download the model automatically.
