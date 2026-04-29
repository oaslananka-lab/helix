# Contributing to Helix

## Prerequisites

- Node.js 20 or newer
- pnpm 9 or newer
- Docker for image builds

## Setup

```bash
git clone https://github.com/oaslananka/helix.git
cd helix
pnpm install
pnpm build
```

## Common Commands

```bash
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm --filter @helix/gateway dev
pnpm --filter @helix/agent dev
```

## Package Layout

```text
packages/shared   Shared protocol schemas and errors
packages/gateway  VPS-side MCP gateway
packages/agent    Local machine agent
```

Build order matters: `@helix/shared` is consumed by both runtime packages. Root scripts handle that ordering.

## Changesets

Public package behavior changes should include a Changeset:

```bash
pnpm changeset
```

## Pull Requests

- Keep changes focused.
- Add or update tests for behavior changes.
- Run `pnpm lint`, `pnpm typecheck`, and `pnpm test`.
- Update docs when configuration, public APIs, Docker images, or operational behavior changes.
