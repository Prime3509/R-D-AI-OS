#!/usr/bin/env bash
set -euo pipefail

echo "→ Creating .claude structure..."
mkdir -p .claude/skills scripts

echo "→ Writing production CLAUDE.md..."
cat > .claude/CLAUDE.md << 'EOF'
# Project AI Operating System v2

## Core Stack (locked in forever)
- **gstack** (Garry Tan) – primary engineering, design, QA, security, shipping layer
- **Superpowers** – forces brainstorm → plan → TDD → systematic debugging before any code
- **Marketing Skills** – growth, CRO, SEO, copy, ads, launches, pricing, retention
- **Social Media Skills** – complete content system (voice-builder, posts, reels, thumbnails, niche research)
- **i-have-adhd** – every response must be action-first, numbered, concrete, and free of buried answers
- **Humanizer** – strips AI tells from all customer-facing copy

## Mandatory Rules (non-negotiable)
1. Any new product, feature, or idea → start with gstack `/office-hours` or `/plan-ceo-review` (money filter first).
2. All web browsing → only gstack `/browse`. Never use `mcp__claude-in-chrome__*` tools.
3. Before writing any substantial code → Superpowers must run (brainstorm → written plan → TDD).
4. All marketing / growth / monetization work → load Marketing Skills.
5. All content / social / audience work → load Social Media Skills (run `voice-builder` first if voice.md does not exist).
6. Every single response must lead with the next concrete action (i-have-adhd style). No fluff, no buried answers.
7. All customer-facing copy (landing pages, emails, posts, ads) → run through Humanizer before shipping.

## Primary Money-First Workflow
1. `/office-hours` or `/plan-ceo-review`     → validate revenue path & kill weak ideas fast
2. `/plan-eng-review`                       → clean, scalable architecture
3. `/design-consultation` or `/design-shotgun` + `/design-html` → UI that converts
4. Superpowers plan + TDD
5. `/review` + `/qa` (use `/browse` for real browser testing)
6. `/ship` or `/land-and-deploy`
7. `/retro` after launch → compound learning into the next product

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
Does this create at least one of:
- a sellable product or SaaS
- recurring revenue
- a content asset that compounds into audience + income

If the answer is no → stop and re-scope immediately.

## Response Style (always on)
- Lead with the next concrete action
- Number multi-step work
- End with one clear next step
- Give specific time estimates when possible
- Make wins visible
- Never bury the answer
EOF

echo "→ Writing AGENTS.md..."
cat > .claude/AGENTS.md << 'EOF'
# AI Stack v2

This repository runs on a hardened, money-first Claude Code stack:

- **gstack** → primary engineering + design + QA + shipping
- **Superpowers** → plan & debug before code
- **Marketing Skills** → growth & monetization
- **Social Media Skills** → content & audience engine
- **i-have-adhd** → action-first responses
- **Humanizer** → clean customer-facing copy

Full rules and command list live in `.claude/CLAUDE.md`.

All major product work must go through the gstack specialist commands.
Start every new idea with `/plan-ceo-review` or `/office-hours`.
EOF

echo "→ Writing MEMORY.md..."
cat > .claude/MEMORY.md << 'EOF'
# Project Memory & Context

## Key Principles
1. Every idea filtered through money lens first
2. Action-first, numbered responses (i-have-adhd)
3. All shipping goes through gstack commands
4. Content compounds into passive income streams
5. No fluff, no buried answers

## Next Steps
1. Run global skill installs from AI_STACK_BOOTSTRAP_v2.md
2. Execute `/plan-ceo-review` on first product idea
3. Feed every major decision through money filter
EOF

chmod +x scripts/init-ai-stack.sh 2>/dev/null || true

echo "✓ Done."
echo ""
echo "Next steps:"
echo "1. Install global skills (see AI_STACK_BOOTSTRAP_v2.md section 1)"
echo "2. Open Claude Code"
echo "3. Type: /plan-ceo-review"
echo ""
echo "File tree created:"
echo ".claude/"
echo "  ├── CLAUDE.md"
echo "  ├── AGENTS.md"
echo "  ├── MEMORY.md"
echo "  └── skills/"
echo "scripts/"
echo "  └── init-ai-stack.sh"
