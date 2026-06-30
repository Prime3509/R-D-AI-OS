# Branching Strategy

  ## Branch Map

  ```
  main           ← production, protected, requires PR + review
    └── dev      ← integration branch, features land here first
          ├── feature/ai-dashboard
          ├── feature/auth-system
          ├── hotfix/critical-bug   ← hotfixes branch from main, merge to main + dev
          └── ...
  ```

  ## Rules

  | Branch | Branch From | Merge Into | Notes |
  |--------|-------------|------------|-------|
  | `feature/*` | `dev` | `dev` | Standard dev work |
  | `fix/*` | `dev` | `dev` | Non-urgent fixes |
  | `hotfix/*` | `main` | `main` + `dev` | Critical prod fixes only |
  | `chore/*` | `dev` | `dev` | Config, tooling, docs |
  | `release/*` | `dev` | `main` | Release preparation |

  ## Protection Rules (apply to `main`)

  - ✅ Require pull request before merging
  - ✅ Require at least 1 approving review
  - ✅ Dismiss stale reviews on new commits
  - ✅ Require branches to be up to date before merging
  - ❌ Direct pushes to `main` are blocked

  ## Naming Conventions

  ```
  feature/short-descriptive-name
  fix/what-is-being-fixed
  hotfix/critical-issue-name
  chore/what-is-being-done
  release/v1.0.0
  ```
  