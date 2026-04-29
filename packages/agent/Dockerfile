FROM node:20-alpine AS builder
WORKDIR /workspace

RUN apk add --no-cache git ripgrep docker-cli
RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/agent/package.json ./packages/agent/

RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile --filter @helix/shared --filter @helix/agent; else pnpm install --filter @helix/shared --filter @helix/agent; fi

COPY packages/shared/tsconfig.json ./packages/shared/
COPY packages/shared/src ./packages/shared/src
COPY packages/agent/tsconfig.json ./packages/agent/
COPY packages/agent/src ./packages/agent/src
COPY packages/agent/plugins ./packages/agent/plugins

RUN pnpm --filter @helix/shared build
RUN pnpm --filter @helix/agent build

FROM node:20-alpine AS runner
LABEL org.opencontainers.image.source="https://github.com/oaslananka/helix"
LABEL org.opencontainers.image.description="Helix Agent - local machine tool exposure"
LABEL org.opencontainers.image.licenses="MIT"

RUN apk add --no-cache git ripgrep docker-cli
RUN addgroup -S helix && adduser -S helix -G helix
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/agent/package.json ./packages/agent/

RUN if [ -f pnpm-lock.yaml ]; then pnpm install --prod --frozen-lockfile --filter @helix/shared --filter @helix/agent; else pnpm install --prod --filter @helix/shared --filter @helix/agent; fi

COPY --from=builder /workspace/packages/shared/dist ./packages/shared/dist
COPY --from=builder /workspace/packages/agent/dist ./packages/agent/dist
COPY --from=builder /workspace/packages/agent/plugins ./packages/agent/plugins

USER helix

ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD node -e "process.exit(0)"

CMD ["node", "packages/agent/dist/index.js"]
