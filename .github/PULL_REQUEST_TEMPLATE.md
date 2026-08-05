# Pull Request Template — gstack Checklist

Use this template to ensure every PR follows the gstack workflow and passes the core gating questions.

## Summary
<!-- Describe the change and the motivation. Keep it concise. -->


## Checklist — required for all PRs
Please ensure each item below is completed before requesting review. Unchecked items may block merging.

- [ ] Money angle validated: this change creates a sellable product, recurring revenue, or a compounding content asset (or you have an explicit business justification). See docs/GSTACK.md for the "Money filter" guidance.
- [ ] Plan/CEO review (if applicable): `/office-hours` or `/plan-ceo-review` completed and notes/links included.
- [ ] Engineering review planned/completed: `/plan-eng-review` (link to architecture notes or RFC).
- [ ] Design consulted (if UI/UX changes): `/design-consultation` or `/design-shotgun` completed and design artifacts linked.
- [ ] Tests and QA:
  - [ ] Unit and integration tests added or updated as appropriate.
  - [ ] QA checklist executed: `/qa` or `/qa-only` and results linked.
- [ ] Review: Code review requested and at least one approver assigned according to CODEOWNERS or the team.
- [ ] Documentation: public API, README, or docs updated where applicable.
- [ ] Security & secrets: no secrets or tokens are included in this PR. If infrastructure changes require secrets, list required variables and secure storage steps.

## What changed
<!-- List the main changes made in this PR. Link to issues, RFCs, design docs, or MCP sessions as needed. -->


## How to test
<!-- Steps to reproduce and verify the changes locally or in a staging environment. Include test coverage notes. -->


## Rollout / Rollback plan
<!-- If applicable, describe the rollout strategy (canary, feature flag) and how to rollback. -->


## Links
- gstack guidelines: docs/GSTACK.md
- MCP / Copilot setup (if related): COPILOT_MCP_SETUP.md


Thank you — please ensure all checklist items are completed before requesting final review and merge.