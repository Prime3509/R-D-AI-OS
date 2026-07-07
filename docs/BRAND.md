# Resist & Defy Collective — Brand & Company Masterfile

**Owner:** Prime
**Scope:** Company identity, mission, and product roster for the Resist &
Defy Collective — the parent brand this monorepo (R-D-AI-OS) serves. This is
distinct from [`docs/MASTERFILE.md`](MASTERFILE.md), which covers only the
R&D Forge + R&D Nexus AI-tooling sub-systems.

This file consolidates and supersedes several overlapping/conflicting Drive
drafts (Brand Bible, Manifesto Bible, Manifesto Plug-In, Brand Brief — see
Provenance) into one current source of truth, per the "one source of truth"
and "no duplicate documentation" engineering rules in `docs/MASTERFILE.md`.

---

## 1. Identity

- **Name:** Resist & Defy ("R&D Collective", short form "R$D")
- **Tagline:** *"Hustle Smarter Not Harder."*
- **Secondary line:** *"Hustle Smarter Not Harder. Resist & Defy."*
- **Manifesto refrain:** *"We resist limitation. We defy expectation."* /
  *"We believe intelligence beats grind. Systems beat chaos. Ownership beats
  dependence."*
- **Mission:** *"We research the systems that keep people broke, distracted,
  or ashamed of the grind. Then we build tools, apps, clothing, and content
  that let the culture defy those limits."*
- **Founder's core belief:** *"People should have more control over their
  future... This is not a company built around products. It is a company
  built around people. The products will evolve. The mission will not."*
- **Founder:** Prime (Rocklin, CA → Global Hustle)

## 2. Voice & Design Direction

- **Voice:** blunt, industrial, confident, high-output, clean, anti-fluff.
- **Design:** premium dark mode, industrial/street/utility feel. WIP status
  is intentional and should be visible. No stock imagery, no filler text.

## 3. Core Values

Resilience · Ownership · Intelligence · Culture · Collective · Authenticity ·
Innovation · Freedom.

## 4. Product Roster

| Product | Status in this repo | Description |
|---|---|---|
| **R&D Nexus** | 🟢 In development ([`apps/nexus`](../apps/nexus)) | Shared memory & knowledge OS — see `docs/MASTERFILE.md` |
| **R&D Forge** | 🔴 Not started | AI dev workspace, Expo/React Native — see `docs/MASTERFILE.md` |
| **FlowPay** (formerly GigFlow) | ⚪ External, not in this repo | Gig income tracking, tax automation, wealth-building app (offline-first, Expo/React Native) |
| **GhostKey** (formerly CheatFlow/FloatKey) | ⚪ External, not in this repo | Universal floating overlay keyboard/automation layer for Android |
| **Sin Vergüenza** | ⚪ External, not in this repo | Aztec/Mayan-rooted streetwear line, Shopify print-on-demand |
| **CreamPicks** (C.R.E.A.M. Picks) | ⚪ External, not in this repo | Gamified investment/dividend-picks app — flagged for App Store Guideline 5.3 (gambling) compliance review |
| **Guerrero** | ⚫ Reserved — do not build | Sub-brand concept only, internal mention |
| R&D Media / Academy / Labs / Ventures / Capital | ⚫ Aspirational | Future umbrella divisions, not products yet |

## 5. Documentation governance

Carried over from the Brand Brief's versioning protocol, since it's a
concrete process rule not yet captured anywhere else in this repo's docs:

- MAJOR.MINOR version bumps are tied to identity changes (major) vs. copy
  changes (minor); every bump gets a changelog entry.
- **Stale-check rule:** before acting on any brand/masterfile doc, check
  whether a newer version exists first.

## 6. FlowPay technical notes (reference only)

No FlowPay code exists in this repo. These corrections came out of a
2026-07-01 audit of the FlowPay build in the separate Drive project and are
kept here in case FlowPay work ever starts in this monorepo:

- Correct import is `@supabase/supabase-js` (not
  `@supabase/supabase-onetime-or-managed`, which doesn't exist).
- RevenueCat's REST endpoint is
  `https://api.revenuecat.com/v1/subscribers/{app_user_id}` (a bare
  `https://revenuecat.com{appUserId}` is malformed).
- RevenueCat silently no-ops inside Expo Go — a real dev build is required
  to test purchases.
- Google Play requires 12 testers over 14 days for new personal developer
  accounts before a production release.
- Android API level 36 target deadline: Aug 31, 2026.

## 7. Provenance

Consolidated from the "R$DCollective" Google Drive folder:
`RD-Collective-Brand-Brief-v1.1.md` (2026-07-05, most current for naming and
product status — e.g. the GigFlow→FlowPay and CheatFlow/FloatKey→GhostKey
renames), `RD_Collective_Brand_Bible_Founder_Handbook_v4.md` (fullest
manifesto/values/founder-letter content), `R&D_Collective_Manifesto_Bible_v1.1.md`,
and `R&D_Collective_Manifesto_PlugIn_v1.2.md`. The FlowPay technical notes
came from `R and D Collective AI Operating System_ Consolidation Audit and.md`
(2026-07-01).

Separately reviewed and **not** incorporated here: `RD_Collective_Master_v5.1.0.md`
/ `v5.0.0.md` (cover a landing-page/marketing site for this same brand — a
different artifact, not company identity) and a parallel, unmerged
engineering-process track (`R&D_Collective_Master_v4.1.0_Optimized.md`,
`R&D_Collective_AI-OS_Master_Directive_v4.0.md`, `R&D-Collective-AI-OS_v0.2.0_Full.md`
— GodMode/L99/OODA process rules and a general tech stack). As of the source
documents' own dates, those two sub-lineages hadn't been reconciled with each
other yet in Drive; nothing in either conflicts with or belongs in
`docs/MASTERFILE.md`, which is scoped to Forge + Nexus only.
