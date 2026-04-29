# @helix/gateway

VPS-side MCP gateway for Helix.

The gateway exposes MCP over SSE, accepts outbound WebSocket connections from `@helix/agent`, routes tool calls by namespace, and provides health, metrics, tracing, and an admin UI.

## Development

Run from the monorepo root:

```bash
pnpm install
pnpm --filter @helix/gateway build
pnpm --filter @helix/gateway test
pnpm --filter @helix/gateway dev
```

## Runtime Configuration

```bash
PORT=3000
PUBLIC_URL=https://gateway.example.com
AGENT_KEYS_JSON={"local-agent":"change-this-secret-min-32-chars"}
INTERNAL_BEARER_TOKEN=change-this-bearer-token-min-32-chars
```

`AGENT_KEYS_JSON` maps each agent ID to the key that agent must provide when it registers.

## Endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /health_check` | Gateway health and connected-agent summary |
| `GET /metrics` | Prometheus metrics |
| `GET /sse` | MCP SSE stream |
| `POST /sse` | MCP JSON-RPC requests |
| `GET /agent/ws` | Agent WebSocket upgrade path |
| `GET /admin-ui` | Browser admin UI |

## Docker

Build from the monorepo root:

```bash
docker build -f packages/gateway/Dockerfile -t helix-gateway:local .
```

Published images are released from `oaslananka-lab/helix`:

```text
ghcr.io/oaslananka-lab/helix/gateway:<tag>
```
