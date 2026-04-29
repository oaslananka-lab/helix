# @helix/agent

Local machine agent for Helix.

The agent connects outbound to `@helix/gateway`, registers local tools, executes authorized calls, and returns MCP-compatible results. Tool groups include repository access, git, Docker, Kubernetes, database, network, CLI sessions, system info, and plugins.

## Development

Run from the monorepo root:

```bash
pnpm install
pnpm --filter @helix/agent build
pnpm --filter @helix/agent test
pnpm --filter @helix/agent dev
```

## Runtime Configuration

```bash
AGENT_ID=local-agent
AGENT_NAME=Local Agent
GATEWAY_WS_URL=wss://gateway.example.com/agent/ws
AGENT_KEY=change-this-secret-min-32-chars
REPO_ROOTS_JSON=["/home/user/projects"]
```

Feature flags are opt-in:

```bash
ENABLE_RUNNER=false
ENABLE_GIT=true
ENABLE_DOCKER=false
ENABLE_HTTP_FETCH=false
ENABLE_SYSTEM_TOOLS=false
ENABLE_DATABASE=false
ENABLE_KUBERNETES=false
ENABLE_NETWORK=false
ENABLE_MCP_PROXY=false
ENABLE_CLI_TOOLS=false
```

## Dashboard

The dashboard is disabled by default.

```bash
DASHBOARD_ENABLED=true DASHBOARD_PORT=3001 pnpm --filter @helix/agent dev
```

Health endpoint when enabled:

```bash
curl http://localhost:3001/health
```

## Docker

Build from the monorepo root:

```bash
docker build -f packages/agent/Dockerfile -t helix-agent:local .
```

Published images are released from `oaslananka-lab/helix`:

```text
ghcr.io/oaslananka-lab/helix/agent:<tag>
```
