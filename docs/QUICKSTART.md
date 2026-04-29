# Quick Start

## Local Development

```bash
pnpm install
pnpm build
pnpm test
```

Run the gateway:

```bash
AGENT_KEYS_JSON='{"local-agent":"change-this-secret-min-32-chars"}' pnpm --filter @helix/gateway dev
```

Run the agent in another shell:

```bash
AGENT_ID=local-agent \
AGENT_NAME="Local Agent" \
GATEWAY_WS_URL=ws://localhost:3000/agent/ws \
AGENT_KEY=change-this-secret-min-32-chars \
REPO_ROOTS_JSON='["."]' \
pnpm --filter @helix/agent dev
```

Gateway health:

```bash
curl http://localhost:3000/health_check
```

Agent dashboard, when enabled:

```bash
DASHBOARD_ENABLED=true pnpm --filter @helix/agent dev
curl http://localhost:3001/health
```

## Docker Compose Example

The example stack is in `examples/docker-compose/docker-compose.yml`.

```bash
cd examples/docker-compose
docker compose up -d
```
