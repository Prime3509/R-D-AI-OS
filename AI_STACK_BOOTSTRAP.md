# AI Engineering Stack Bootstrap
### gstack + Superpowers + Marketing Skills + Social Media Skills + i-have-adhd

**One-file setup for every future repo.**  
Optimized for shipping apps → generating revenue → building passive income.

Copy this entire file into the root of any GitHub repository as `AI_STACK_BOOTSTRAP.md`.  
Then tell GitHub AI (or any coding agent):

> Read AI_STACK_BOOTSTRAP.md and fully initialize the stack. Create every file and folder exactly as specified. Commit when done.

---

## 1. Global Skill Installs (run once on your machine)

```bash
# 1. gstack (Garry Tan – virtual engineering team)
git clone --single-branch --depth 1 https://github.com/garrytan/gstack.git ~/.claude/skills/gstack
cd ~/.claude/skills/gstack && ./setup

# 2. Superpowers (plans & debugs before writing code)
# Preferred (Claude Code plugin)
# /plugin marketplace add obra/superpowers-marketplace
# /plugin install superpowers@superpowers-marketplace

# Manual fallback
git clone --depth 1 https://github.com/obra/superpowers.git ~/.claude/skills/superpowers

# 3. Marketing Skills (Corey Haines – 40+ growth skills)
npx skills add coreyhaines31/marketingskills
# or
git clone --depth 1 https://github.com/coreyhaines31/marketingskills.git ~/.claude/skills/marketingskills

# 4. Social Media Skills (Charlie Hills – full content engine)
git clone --depth 1 https://github.com/charlie947/social-media-skills.git ~/.claude/skills/social-media-skills
# or
npx skills add charlie947/social-media-skills

# 5. i-have-adhd (action-first, zero buried answers)
claude plugin marketplace add ayghri/i-have-adhd
claude plugin install i-have-adhd@i-have-adhd

# Optional: make ADHD mode always-on
touch ~/.claude/.i-have-adhd-always
```

---

## 2. Project Structure to Create

```
.claude/
├── CLAUDE.md          ← main operating system (full content below)
├── AGENTS.md          ← short note for collaborators
└── skills/            ← optional local copies / symlinks
    ├── gstack
    ├── superpowers
    ├── marketingskills
    ├── social-media-skills
    └── i-have-adhd
```

---

## 3. Full CLAUDE.md Content

Create `.claude/CLAUDE.md` with **exactly** this content:

```markdown
# Project AI Operating System

## Core Stack (locked in)
- **gstack** (Garry Tan) – primary engineering, design, QA, and shipping layer
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
/office-hours
/plan-ceo-review
/plan-eng-review
/plan-design-review
/design-consultation
/design-shotgun
/design-html
/design-review
/review
/ship
/land-and-deploy
/canary
/benchmark
/browse
/connect-chrome
/qa
/qa-only
/setup-browser-cookies
/setup-deploy
/setup-gbrain
/retro
/investigate
/document-release
/document-generate
/codex
/cso
/autoplan
/plan-devex-review
/devex-review
/careful
/freeze
/guard
/unfreeze
/gstack-upgrade
/learn

## Money Filter (apply on every plan)
Does this create:
- a sellable product,
- recurring revenue, or
- a content asset that compounds into audience + income?

If not, stop and re-scope.
```

---

## 4. AGENTS.md Content

Create `.claude/AGENTS.md` with this content:

```markdown
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
```

---

## 5. Optional One-Click Init Script

Create `scripts/init-ai-stack.sh`:

```bash
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
```

Make it executable:
```bash
chmod +x scripts/init-ai-stack.sh
```

---

## 6. Recommended First Commands After Setup

```text
/plan-ceo-review
```
Prompt example:
```
Run /plan-ceo-review on [your idea].
Focus hard on: fastest path to first paying customer, passive income potential, and what we can ship in the next 7–14 days.
```

Then:
```text
/plan-eng-review
/design-shotgun
/qa
/ship
```

---

## 7. GitHub AI One-Shot Prompt

Paste this into GitHub AI / Copilot Chat / any coding agent:

```
Read the file AI_STACK_BOOTSTRAP.md in this repository.

Fully initialize the AI engineering stack:

1. Create the folder structure .claude/ and scripts/
2. Write the complete .claude/CLAUDE.md exactly as specified
3. Write the complete .claude/AGENTS.md exactly as specified
4. Create scripts/init-ai-stack.sh with the content provided and make it executable
5. Do not change any of the wording in CLAUDE.md or AGENTS.md

When finished, show me the file tree of what you created and confirm the stack is ready.
```

---

## End of Bootstrap File

This single file contains everything needed to lock the full money-making AI stack into any repository for current and future work.