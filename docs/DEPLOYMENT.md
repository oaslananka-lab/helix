# Deployment

## Gateway

Deploy `@helix/gateway` to a public VPS behind TLS.

Required environment:

```bash
PORT=3000
PUBLIC_URL=https://gateway.example.com
AGENT_KEYS_JSON={"my-home-pc":"change-this-secret-min-32-chars"}
INTERNAL_BEARER_TOKEN=change-this-bearer-token-min-32-chars
```

Docker:

```bash
docker run -d --name helix-gateway \
  --restart unless-stopped \
  -p 3000:3000 \
  --env-file gateway.env \
  ghcr.io/oaslananka-lab/helix/gateway:latest
```

Health check:

```bash
curl https://gateway.example.com/health_check
```

## Agent

Run the agent on the machine that owns the tools.

Required environment:

```bash
AGENT_ID=my-home-pc
AGENT_NAME=Home PC
GATEWAY_WS_URL=wss://gateway.example.com/agent/ws
AGENT_KEY=change-this-secret-min-32-chars
REPO_ROOTS_JSON=["/home/user/projects"]
```

Docker:

```bash
docker run -d --name helix-agent \
  --restart unless-stopped \
  --env-file agent.env \
  -v /home/user/projects:/home/user/projects:ro \
  ghcr.io/oaslananka-lab/helix/agent:latest
```

Mount `/var/run/docker.sock` only when Docker tools are explicitly needed and the agent is trusted.

## Release Flow

Push an annotated tag such as `v1.1.0` to `oaslananka-lab/helix` to build multi-arch images, generate SBOMs, and create a GitHub Release.
