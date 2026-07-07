# R-D-AI-OS — Resist & Defy Collective

  > The AI-powered operating system and platform hub for the Resist & Defy Collective.

  ## What is R-D-AI-OS?

  R-D-AI-OS is the parent monorepo for all Resist & Defy Collective projects — spanning AI tooling, internal ops, creative systems, and community infrastructure.

  ## Sub-Systems

  | Project | Description | Status |
  |---------|-------------|--------|
  | R-D-AI-OS | Parent platform & shared infrastructure | 🟢 Active |
  | [R&D Nexus](artifacts/nexus) | Shared memory & knowledge OS — hybrid MCP + HTTP server | 🟡 In Development |

  ## Quick Start

  ```bash
  git clone https://github.com/Prime3509/R-D-AI-OS.git
  cd R-D-AI-OS
  ```

  ## Branching Strategy

  See [docs/BRANCHING.md](docs/BRANCHING.md) — short version:
  - `main` — production-ready, protected
  - `dev` — integration branch, all features merge here first  
  - `feature/*` — individual features/tasks
  - `hotfix/*` — urgent production fixes

  ## Contributing

  See [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.

  ## Architecture

  See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design and decisions.

  ---

  © Resist & Defy Collective. All rights reserved.
  