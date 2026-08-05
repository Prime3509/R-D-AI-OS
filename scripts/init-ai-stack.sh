#!/usr/bin/env bash
set -euo pipefail

echo "→ Creating .claude structure..."
mkdir -p .claude/skills scripts

echo "→ Writing CLAUDE.md..."
cat > .claude/CLAUDE.md << 'EOF'
# Project AI Operating System

## Core Stack (locked in)
- **gstack** (Garry Tan) – primary engineering, design, QA, shipping layer
- **Superpowers** – forces planning + TDD + systematic debugging before any code
- **Marketing Skills** – growth, CRO, SEO, copy, ads, launches, pricing
- **Social Media Skills** – complete content system (voice, posts, reels, thumbnails, research)
- **i-have-adhd** – every response must be action-first, numbered, and concrete

## Mandatory Rules
1. Any new product, feature, or idea → start with gstack `/office-hours` or `/plan-ceo-review` (money filter first).
2. All web browsing → only gstack `/browse`. Never use `mcp__claude-in-chrome__*` tools.
3. Before writing substantial code → Superpowers must run (brainstorm → plan → TDD).
4. All marketing / growth / monetization work → load Marketing Skills.
5. All content / social / audience work → load Social Media Skills (run voice-builder first if needed).
6. Every single response must lead with the next concrete action (i-have-adhd style). No buried answers.

## Primary Money-First Workflow
1. `/office-hours` or `/plan-ceo-review`     → validate revenue path & kill weak ideas
2. `/plan-eng-review`                       → clean architecture
3. `/design-consultation` or `/design-shotgun` + `/design-html` → UI that converts
4. Superpowers plan + TDD
5. `/review` + `/qa` (use `/browse` for real browser testing)
6. `/ship` or `/land-and-deploy`
7. `/retro` after launch → compound learning

## Available gstack Commands
/office-hours /plan-ceo-review /plan-eng-review /plan-design-review
/design-consultation /design-shotgun /design-html /design-review
/review /ship /land-and-deploy /canary /benchmark
/browse /connect-chrome /qa /qa-only
/setup-browser-cookies /setup-deploy /setup-gbrain
/retro /investigate /document-release /document-generate
/codex /cso /autoplan /plan-devex-review /devex-review
/careful /freeze /guard /unfreeze /gstack-upgrade /learn

## Money Filter (apply on every plan)
Does this create:
- a sellable product,
- recurring revenue, or
- a content asset that compounds into audience + income?

If not, stop and re-scope.
EOF

echo "→ Writing AGENTS.md..."
cat > .claude/AGENTS.md << 'EOF'
# AI Stack

This repository runs on a hardened Claude Code stack:

- **gstack** (primary engineering + design + QA + shipping)
- **Superpowers** (plan & debug before code)
- **Marketing Skills** (growth & monetization)
- **Social Media Skills** (content engine)
- **i-have-adhd** (action-first responses)

Full rules and command list live in `.claude/CLAUDE.md`.

All major product work must go through the gstack specialist commands.
Start every new idea with `/plan-ceo-review` or `/office-hours`.
EOF

echo "→ Done."
echo "Global skills must still be installed once on the machine (see AI_STACK_BOOTSTRAP.md)."
echo "Then open Claude Code and run: /plan-ceo-review"
