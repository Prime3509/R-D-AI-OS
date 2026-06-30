# R-D-AI-OS Architecture

  ## Overview

  R-D-AI-OS is the parent monorepo and platform backbone for all Resist & Defy Collective systems.

  ## Stack

  | Layer | Technology |
  |-------|-----------|
  | API Server | Express 5 + TypeScript |
  | Database | PostgreSQL + Drizzle ORM |
  | Validation | Zod v4 |
  | Package Manager | pnpm workspaces |
  | Infra | Replit (dev) → cloud deploy |

  ## System Diagram

  ```
  ┌─────────────────────────────────────────┐
  │           R-D-AI-OS Platform            │
  │                                         │
  │  ┌──────────┐    ┌──────────────────┐   │
  │  │ API      │◄──►│ PostgreSQL DB    │   │
  │  │ Server   │    └──────────────────┘   │
  │  └──────────┘                           │
  │       │                                 │
  │  ┌────▼─────┐    ┌──────────────────┐   │
  │  │ Integra- │◄──►│ GitHub / Notion  │   │
  │  │ tions    │    │ Airtable/Discord │   │
  │  └──────────┘    └──────────────────┘   │
  └─────────────────────────────────────────┘
  ```

  ## Key Decisions

  - **Contract-first API** — OpenAPI spec defines the contract; code generated from it
  - **Monorepo** — sub-systems share types, schemas, and utilities via `lib/*` packages
  - **Zod validation** — all inputs/outputs validated at the boundary
  - **Integration-first** — third-party services via Replit Connectors (no raw API keys in code)

  ## Adding a New Sub-System

  1. Create a new package under `artifacts/` or `lib/`
  2. Define its API contract in OpenAPI
  3. Run codegen: `pnpm --filter @workspace/api-spec run codegen`
  4. Wire into the shared router
  