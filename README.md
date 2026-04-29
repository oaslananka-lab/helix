# Helix

Production-grade MCP agent ecosystem: a VPS-side gateway, a local machine agent, and shared protocol contracts in one pnpm monorepo.

[![CI](https://github.com/oaslananka-lab/helix/actions/workflows/ci.yml/badge.svg)](https://github.com/oaslananka-lab/helix/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-brightgreen)](package.json)
[![MCP](https://img.shields.io/badge/protocol-MCP-purple)](https://modelcontextprotocol.io)

## What Helix Does

Helix connects AI assistants and MCP clients to tools running on your own machines without exposing those machines directly to the internet.

```text
AI client
  |
  | HTTPS + MCP SSE
  v
@helix/gateway on a VPS
  |
  | WebSocket
  v
@helix/agent on a local machine
```

## Packages

| Package | Path | Purpose |
| --- | --- | --- |
| `@helix/gateway` | `packages/gateway` | MCP SSE server, agent registry, routing, admin UI, metrics, and tracing |
| `@helix/agent` | `packages/agent` | Local tool host for git, Docker, Kubernetes, database, CLI, filesystem, network, and plugin tools |
| `@helix/shared` | `packages/shared` | Shared protocol schemas, TypeScript types, helpers, and error classes |

## Repositories

| Repository | Role |
| --- | --- |
| `github.com/oaslananka/helix` | Canonical source repository |
| `github.com/oaslananka-lab/helix` | Active CI/CD mirror, releases, and GHCR image publishing |

The workflow files are guarded so they run only in `oaslananka-lab/helix`.

## Quick Start

Install dependencies and build the workspace:

```bash
pnpm install
pnpm build
```

Run package tests:

```bash
pnpm test
```

Start the gateway during development:

```bash
pnpm --filter @helix/gateway dev
```

Start the agent during development:

```bash
pnpm --filter @helix/agent dev
```

## Docker Images

Release workflows publish multi-arch images to GHCR:

```text
ghcr.io/oaslananka-lab/helix/gateway:<tag>
ghcr.io/oaslananka-lab/helix/agent:<tag>
```

Local builds use the repository root as Docker context:

```bash
docker build -f packages/gateway/Dockerfile -t helix-gateway:local .
docker build -f packages/agent/Dockerfile -t helix-agent:local .
```

## Configuration Notes

The gateway expects `AGENT_KEYS_JSON`, not the legacy `AGENT_KEYS` spelling:

```bash
AGENT_KEYS_JSON={"my-home-pc":"change-this-secret-min-32-chars"}
INTERNAL_BEARER_TOKEN=change-this-bearer-token-min-32-chars
```

The agent connects outbound to the gateway:

```bash
AGENT_ID=my-home-pc
AGENT_NAME=Home PC
GATEWAY_WS_URL=wss://gateway.example.com/agent/ws
AGENT_KEY=change-this-secret-min-32-chars
REPO_ROOTS_JSON=["/home/user/projects"]
```

## Documentation

| Document | Purpose |
| --- | --- |
| [docs/QUICKSTART.md](docs/QUICKSTART.md) | End-to-end local setup |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Production deployment notes |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Package and protocol architecture |
| [SECURITY.md](SECURITY.md) | Security model and vulnerability reporting |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Development workflow |
| [CHANGELOG.md](CHANGELOG.md) | Release history |

## License

MIT. See [LICENSE](LICENSE).
