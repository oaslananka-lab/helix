# Security Policy

## Supported Versions

| Version | Supported |
| --- | --- |
| Latest | Yes |
| Earlier than 1.0 | No |

## Reporting a Vulnerability

Do not open a public issue for security vulnerabilities.

Use GitHub Private Vulnerability Reporting for `oaslananka/helix` or contact the maintainer directly. Include the vulnerability description, reproduction steps, impact, and any suggested fix.

## Security Model

Gateway:

- Agent WebSocket connections authenticate with per-agent keys from `AGENT_KEYS_JSON`.
- MCP POST calls can be protected with `INTERNAL_BEARER_TOKEN`.
- Rate limiting, IP whitelist support, structured logs, Prometheus metrics, and OpenTelemetry tracing are available.

Agent:

- Filesystem tools validate paths against configured repository roots.
- Runner and privileged tool groups are opt-in.
- Tool output is capped.
- Audit logging redacts configured sensitive values.
- Concurrency limits prevent unbounded in-flight calls.

Transport:

- Production traffic should use TLS: `https://` for MCP and `wss://` for agent WebSockets.
- The agent initiates outbound connections and does not require inbound internet access.
- Docker socket mounting is optional and should be used only for trusted deployments.
