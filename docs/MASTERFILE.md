# R&D FORGE + R&D NEXUS MASTERFILE v2.4

**Owner:** Prime · R&D Collective
**Date:** 2026-07-07
**Version:** v2.4
**Status:** Integrated Principles + Architecture + Implementation + Weaviate Strategy

This is the current single source of truth for both **R&D Forge** and **R&D Nexus**.
It supersedes [`docs/nexus/MASTERFILE.md`](nexus/MASTERFILE.md) (v1.1, Nexus-only),
which is kept for historical reference on the decisions made while building the
Nexus v0.1 implementation in [`artifacts/nexus`](../artifacts/nexus).

---

## 1. Core Principles

- Simplicity over complexity
- Reuse before creating
- One source of truth
- Automate repetitive work
- Optimize for long-term maintainability

---

## 2. Core Engineering Rules

1. Reuse before creating.
2. One responsibility per file.
3. One responsibility per service.
4. Verify before committing.
5. Keep modules small and composable.
6. Shared logic belongs in the SDK.
7. No duplicate code or utilities.
8. Business logic never belongs in the UI.
9. Every feature must be testable.
10. Every important decision is documented.
11. Prefer configuration over hardcoding.
12. Build offline-first whenever practical.
13. Security is enabled by default.
14. Measure performance before optimizing.
15. Automate anything repeated more than twice.
16. Delete obsolete code instead of hiding it.
17. Favor readable code over clever code.
18. Every module has a clear owner.
19. If a feature increases complexity without meaningful value, reject it.
20. Leave the codebase cleaner than you found it.

---

## 3. Repository Structure

```
R&D Collective/
├── apps/
│   ├── forge/                    # R&D Forge (Expo/React Native - Execution Layer)
│   │   ├── app/                  # Main app screens and navigation
│   │   ├── lib/                  # Forge-specific logic (agent, memory, nexus client)
│   │   └── components/           # Reusable UI components
│   │
│   └── nexus/                    # R&D Nexus (Node.js MCP + HTTP Server)
│       ├── src/
│       │   ├── index.ts          # Main server entry (MCP + HTTP)
│       │   ├── tools/            # MCP tool handlers (notes, memory, decisions, etc.)
│       │   ├── types.ts          # Data models
│       │   └── utils/            # Helper functions
│       ├── notes/                # Markdown notes storage
│       ├── memory/               # Memory facts storage
│       ├── decisions/            # Decision logs
│       ├── assets/               # Code, prompts, research assets
│       └── models/               # Embedding models (e.g. ONNX)
│
├── packages/
│   ├── sdk/                      # Shared SDK (used by Forge, Nexus, and future apps)
│   │   ├── core/                 # Core types, interfaces, and standards
│   │   ├── memory/               # Memory abstractions & interfaces
│   │   ├── events/                # Event bus and event types
│   │   ├── verification/         # Verification & reflection logic
│   │   ├── security/              # Security utilities
│   │   └── utils/                 # Shared utilities
│   │
│   ├── engine/                    # Execution engine (agent loop, planning, etc.)
│   │
│   └── core/                      # Foundational standards and configurations
│
├── docs/                          # Documentation and architecture notes
├── tests/                         # Tests for all packages and apps
└── scripts/                       # Build, migration, and utility scripts
```

---

## 4. Module Ownership

| Module     | Primary Responsibility      |
|------------|-----------------------------|
| **Forge**  | Build / Execution           |
| **Nexus**  | Memory + Knowledge          |
| **Engine** | Execution runtime           |
| **SDK**    | Shared logic & interfaces   |
| **Core**   | Standards & foundational types |

---

## 5. Two-App Architecture

### R&D Forge (Execution Layer)
- Personal AI Development OS (internal, never sold)
- Built with Expo/React Native (Android-first)
- Focus: AI workspace, planning, verification, teaching, session management

### R&D Nexus (Memory OS)
- Shared memory and knowledge system
- Runs as hybrid MCP + HTTP server
- Supports long-term memory, semantic search, knowledge graph, asset storage, decision logging, and cross-app intelligence

**Design Rule:** Forge and Nexus can operate **independently** or **together**.

---

## 6. Core Architecture

### Principles
- Modular
- AI-provider agnostic
- Offline-first
- Event-driven
- Testable
- Replaceable
- Observable
- Secure-by-default
- Scalable
- Founder-absent maintainable

### Event Flow
Forge → Event Bus → Nexus → Automation → Knowledge Graph

### Plugin Lifecycle
- `initialize()`
- `execute()`
- `healthCheck()`
- `shutdown()`

### Key Services
- ProjectService
- MemoryService
- PlanningService
- TeachingService
- VerificationService
- DecisionService
- WorkflowService
- AnalyticsService

**Dependency Rule:** UI → Services → SDK → Infrastructure

---

## 7. Memory & Intelligence System

### Memory Types
- Working Memory
- Episodic Memory
- Semantic Memory
- Procedural Memory
- Strategic Memory

### Memory Lifecycle
Capture → Verify → Embed → Store → Link → Score → Retrieve → Update → Archive

### Knowledge Graph Relationships
- `depends_on`
- `created_by`
- `improves`
- `duplicates`
- `references`
- `replaces`
- `related_to`

### Confidence Model
- Confidence Score
- Freshness
- Usage Count
- Source Count
- Verification Status

### Memory Aging
- **Hot** — Frequently accessed
- **Warm** — Occasionally accessed
- **Cold** — Rarely accessed
- **Archive** — Long-term / low relevance

### Reflection Process
- What worked?
- What failed?
- What improved?
- What should change?
- What became reusable?

### Retrieval Pipeline
Intent → Semantic Search → Knowledge Graph → Ranking → Confidence → Response → Reflection

### Engineering Goals
- Continuous learning
- Durable memory
- Cross-app intelligence
- Minimal duplication
- High-confidence retrieval

---

## 8. Vector Database Strategy

### Current Implementation
- **LanceDB** is used as the primary vector database
- Features implemented:
  - Connection pooling
  - Semantic result caching (with cosine similarity threshold)
  - Real embeddings via `@huggingface/transformers` (the maintained successor
    to `@xenova/transformers`; same `pipeline("feature-extraction", ...)` API —
    see [`artifacts/nexus/README.md`](../artifacts/nexus/README.md) for why)
  - Smart Index Selector (HNSW / IVF-PQ)
  - Auto re-indexing + scheduled re-indexing
  - Health checks and pre-warm utilities

### Future Direction
- **Weaviate** is planned as the medium-to-long term vector database
- Reasons: Superior native Knowledge Graph support, excellent hybrid search, and strong cross-reference capabilities

### Weaviate Schema (High-Level)

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

---

## 9. Current Implementation Status

### R&D Nexus (MCP Server)
Implemented under [`artifacts/nexus`](../artifacts/nexus) (v0.1, not yet moved to
the `apps/nexus` path this masterfile specifies — see the note below):
- Hybrid MCP + HTTP architecture, in one process
- Full 10-tool set implemented (list/read/write notes, save/recall facts,
  log/get decisions, save/get assets, teaching feedback), mirrored as HTTP routes
- LanceDB with vector search + semantic caching (project-scoped)
- Real embeddings via `@huggingface/transformers`
- Smart Index Selector (HNSW / IVF-PQ)
- Auto re-indexing (write-triggered, fire-and-forget) + scheduled re-indexing
- Teaching Layer with anti-pattern detection (undocumented consequences,
  decision churn, code smells)
- Health check endpoint + startup pre-warm

### R&D Forge
**Not started.** No `apps/forge` Expo/React Native app exists in this repo yet.
Building it — an AI workspace with planning, verification, teaching, and
session management — is a substantial, separate effort from what's been built
so far and hasn't been scoped or confirmed.

### Repository structure gap
This masterfile's §3 structure (`apps/forge`, `apps/nexus`, `packages/sdk`,
`packages/engine`, `packages/core`) is the target layout. The repo currently
has `artifacts/nexus` (per the pre-existing `docs/ARCHITECTURE.md` convention)
and no `packages/*` or `apps/forge` yet. Moving `artifacts/nexus` →
`apps/nexus` and extracting a `packages/sdk` are structural changes with real
blast radius (mid-review on an open PR, no consumers of a shared SDK exist
yet to justify extraction) and haven't been executed pending confirmation of
scope and sequencing.

---

## 10. Next Priorities

1. Expand Teaching Layer with more contextual rules
2. Improve multi-file planning verification
3. Build real inter-app connectors via Nexus
4. Begin Weaviate integration planning and schema migration
5. Further optimize embedding performance and caching

---

## 11. Version History

- **v2.4** — Added Weaviate schema design + cross-references + vector database migration strategy
- **v2.3** — Integrated engineering principles + full architecture
- **v2.2** — Strong engineering rules and repository structure
- **v1.4.3** — Full Nexus MCP implementation + optimizations
- **v1.1 (Nexus only)** — see [`docs/nexus/MASTERFILE.md`](nexus/MASTERFILE.md)

---

**—— Consolidated into [R&D FORGE + R&D NEXUS] Masterfile v2.4 · Ready for next phase.**
