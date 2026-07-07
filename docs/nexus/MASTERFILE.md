# R&D NEXUS MASTERFILE v1.1

**Owner:** Prime · R&D Collective
**Date:** 2026-07-07
**Version:** v1.1 (Nexus Only)
**Purpose:** Focused Masterfile for Claude Code work on R&D Nexus

This file contains **only Nexus-related** content. It is kept clean and straightforward for efficient use with Claude Code.

> **Superseded by [`docs/MASTERFILE.md`](../MASTERFILE.md) (v2.4)**, which
> covers both R&D Forge and R&D Nexus. This file is kept for historical
> reference on the decisions made while building Nexus v0.1.

---

## 1. Purpose of R&D Nexus

R&D Nexus is the **shared memory and knowledge operating system** for R&D Collective.

It serves as:
- Long-term memory store
- Semantic search engine
- Knowledge graph
- Asset & decision repository
- Teaching & reflection layer
- Cross-app intelligence layer

Nexus is designed to work with **any app or AI** (via MCP or HTTP), not just R&D Forge.

---

## 2. Core Responsibilities

- Store and retrieve memory facts with embeddings
- Maintain a knowledge graph with meaningful relationships
- Provide semantic + hybrid search
- Log and surface important decisions
- Store and version assets (code, prompts, research)
- Deliver teaching feedback and anti-pattern detection
- Support cross-app memory and intelligence
- Enable reflection and continuous learning

---

## 3. Architecture

**Type:** Hybrid MCP + HTTP Server

- **MCP stdio transport** — Compatible with Claude, Cursor, and other AI tools
- **HTTP API** (port 3456) — Used by R&D Forge and future apps
- **Storage:** Markdown files with frontmatter + LanceDB for vector search

**Key Features Implemented:**
- LanceDB with connection pooling
- Real embeddings using `@xenova/transformers`
- Semantic result caching (with cosine similarity threshold)
- Smart Index Selector (HNSW or IVF-PQ)
- Auto re-indexing + scheduled re-indexing
- Health check endpoint (`GET /health`)
- Startup pre-warm utility

---

## 4. Implemented MCP Tools

- `nexus_list_notes`
- `nexus_read_note`
- `nexus_write_note`
- `nexus_save_fact`
- `nexus_recall_facts` (semantic + keyword)
- `nexus_log_decision`
- `nexus_get_decisions`
- `nexus_save_asset`
- `nexus_get_assets`
- `nexus_get_teaching_feedback`

---

## 5. Weaviate Schema (Future Direction)

**Main Classes:**
- `MemoryFact`
- `Decision`
- `Asset`
- `Lesson`
- `Project`

**Key Cross-References:**
- `relatedTo`
- `dependsOn`
- `project`
- `referencesDecision`
- `referencesAsset`

Weaviate is planned as the medium-to-long term vector database due to its strong native support for knowledge graphs and hybrid search.

---

## 6. Claude Code Quick Start

### Recommended Prompt Template

```markdown
You are an expert senior developer helping build R&D Nexus.

Reference: Use this Nexus Masterfile (v1.1) as the single source of truth.

Task: [Describe the specific task clearly]

Files to modify: [List exact files]

Constraints:
- Follow the Core Engineering Rules
- One responsibility per file
- Keep code clean and well-commented
- Add proper error handling
- Make changes testable

Output:
1. Short explanation (2-3 sentences)
2. Code changes with file paths
3. Any new files needed
4. Testing notes
```

---

## Implementation status (v0.1, first build)

Implemented under [`apps/nexus`](../../apps/nexus) (path updated post-move; see docs/MASTERFILE.md):

- Hybrid MCP (stdio) + HTTP (`:3456`) server in one process, per §3.
- Markdown + frontmatter storage for notes, facts, decisions, assets.
- LanceDB-backed semantic search over facts, with:
  - a smart index selector (brute force below 1k rows, HNSW up to 200k, IVF_PQ beyond),
  - a cosine-similarity-threshold semantic result cache,
  - write-counter-triggered reindexing plus a scheduled background reindex.
- Embeddings via `@huggingface/transformers` (the maintained successor to
  `@xenova/transformers`; same `pipeline("feature-extraction", ...)` API) —
  see the package README for why this substitution was made.
- All 10 MCP tools from §4, mirrored as HTTP routes.
- `GET /health` and a startup pre-warm step that loads the embedding model
  before serving traffic.

Not yet implemented (deliberately out of scope for v0.1):
- Weaviate / knowledge graph cross-references (§5) — still the documented
  future direction, no code against it yet.
- Cross-app intelligence layer beyond the shared HTTP API.

See [`apps/nexus/README.md`](../../apps/nexus/README.md) for setup,
environment variables, and the full tool/route list.
