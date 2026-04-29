# Helix Architecture

Helix is split into three workspace packages.

## Gateway

`@helix/gateway` runs on a VPS or other public host. It exposes MCP over SSE and receives outbound WebSocket connections from agents. It owns:

- MCP JSON-RPC handling.
- Agent authentication and registry.
- Tool namespace routing.
- Circuit breaker state.
- Admin UI.
- Metrics and tracing.

## Agent

`@helix/agent` runs on a local machine. It connects outbound to the gateway and registers available tools. It owns:

- Tool registration and execution.
- Filesystem, git, Docker, Kubernetes, database, network, CLI, and MCP proxy tool groups.
- Policy controls and output limits.
- Audit logging.
- Dashboard UI.
- Plugin loading.

## Shared

`@helix/shared` owns the protocol contract between gateway and agent:

- Registration messages.
- Ping and pong messages.
- Tool call requests and results.
- Capability updates.
- Stream chunks.
- Validation helpers.
- Shared error classes.

Gateway and agent keep compatibility by importing protocol definitions through local facade modules that re-export `@helix/shared`.

## Data Flow

```text
MCP client
  -> POST /sse tools/call
  -> gateway routes to agent WebSocket
  -> agent executes local tool
  -> agent sends call_result
  -> gateway returns MCP result
```

## CI/CD Split

`oaslananka/helix` is the canonical source repository. `oaslananka-lab/helix` is the active automation repository. Workflows include repository guards so accidental pushes to the canonical repository do not run CI/CD jobs there.
