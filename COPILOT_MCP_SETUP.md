# GitHub Copilot MCP Setup

This document describes how to configure GitHub Copilot to use the Supabase MCP server, authenticate the Copilot CLI, and (optionally) install Supabase Agent Skills.

## 1) Add the Supabase MCP server
Run this command locally to register the Supabase MCP server with your Copilot CLI:

```bash
copilot mcp add --transport http supabase "https://mcp.supabase.com/mcp?project_ref=gywvzuoqyrqjyrxfrnzl&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching"
```

Alternatively, add the following JSON to `~/.copilot/mcp-config.json` (Linux/macOS) or `%USERPROFILE%\.copilot\mcp-config.json` (Windows):

```json
{
  "mcpServers": {
    "supabase": {
      "type": "http",
      "url": "https://mcp.supabase.com/mcp?project_ref=gywvzuoqyrqjyrxfrnzl&features=docs%2Caccount%2Cdatabase%2Cdebugging%2Cdevelopment%2Cfunctions%2Cbranching"
    }
  }
}
```

## 2) Authenticate the Copilot CLI with the MCP
Start the interactive authentication flow:

```bash
copilot -i /mcp
```

Follow the on-screen instructions. The CLI may open a browser-based OAuth flow or prompt for a GitHub Personal Access Token (PAT).

### Create a PAT (if prompted)
Create a PAT at:

https://github.com/settings/personal-access-tokens

Recommended guidance:
- Use a descriptive name, e.g. "Copilot MCP client (Supabase)".
- Choose an expiration you are comfortable with (shorter is safer).

Scopes (recommended minimal set):
- For classic tokens: `repo` (or narrower repo scopes), `workflow` (if Copilot will interact with Actions/workflows), and optionally `read:user` / `user:email`.
- For fine-grained tokens: grant repository access only to the repositories Copilot needs (read or read+write as required) and Actions/workflow access for those repos.

Copy the token immediately — GitHub will not show it again — then paste it into the Copilot CLI prompt if requested.

Security: Treat PATs like passwords — do NOT commit them into the repo or share them publicly. Revoke them later from the same settings page when no longer needed.

## 3) (Optional) Install Supabase Agent Skills
If you want Copilot/agents to use Supabase-specific helpers and scripts, install the agent skills locally:

```bash
npx skills add supabase/agent-skills
```

Prerequisites: Node.js + npm installed (Node 14+ recommended).

## 4) Verification & Troubleshooting
- Verify the MCP is registered by inspecting `~/.copilot/mcp-config.json` or by running `copilot mcp` subcommands (e.g., help or list if available).
- If the interactive auth doesn't open a browser, copy the URL the CLI prints and open it manually.
- If authentication fails with 401/403, re-check PAT scopes or generate a new token with broader scopes temporarily to identify missing permissions.
- On Windows PowerShell, wrap the URL argument in single quotes if you encounter quoting issues.

If you'd like, I can also add a PowerShell-specific command snippet or put this file into a `docs/` directory instead. Reply with where you prefer the file to live or if you want the PowerShell variant.
