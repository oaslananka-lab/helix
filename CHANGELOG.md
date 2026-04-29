# Changelog

All notable changes to this project will be documented in this file.

## 1.1.0 - 2026-04-29

### Added

- Monorepo structure combining the gateway and agent codebases.
- `@helix/shared` with shared protocol schemas, TypeScript types, helpers, and error classes.
- pnpm workspace configuration.
- Root CI/CD workflows guarded for `oaslananka-lab/helix`.
- Multi-stage Dockerfiles that build from the monorepo root and include shared package artifacts.
- Root documentation, examples, issue templates, PR template, and Changesets configuration.

### Changed

- Gateway package renamed from `mcp-gateway` to `@helix/gateway`.
- Agent package renamed from `helix-home-agent` to `@helix/agent`.
- Protocol definitions are re-exported from `@helix/shared` by both runtime packages.
- Docker image names target `ghcr.io/oaslananka-lab/helix/gateway` and `ghcr.io/oaslananka-lab/helix/agent`.

## 1.0.0 - 2026-03-29

### Added

- Initial standalone gateway and agent implementations.
- MCP SSE gateway with WebSocket agent aggregation.
- Local agent tool registry, plugin loading, dashboard, and audit logging.
