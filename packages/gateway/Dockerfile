FROM node:25-alpine AS builder
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/gateway/package.json ./packages/gateway/

RUN if [ -f pnpm-lock.yaml ]; then pnpm install --frozen-lockfile --filter @helix/shared --filter @helix/gateway; else pnpm install --filter @helix/shared --filter @helix/gateway; fi

COPY packages/shared/tsconfig.json ./packages/shared/
COPY packages/shared/src ./packages/shared/src
COPY packages/gateway/tsconfig.json ./packages/gateway/
COPY packages/gateway/src ./packages/gateway/src
COPY packages/gateway/public ./packages/gateway/public

RUN pnpm --filter @helix/shared build
RUN pnpm --filter @helix/gateway build

FROM node:25-alpine AS runner
LABEL org.opencontainers.image.source="https://github.com/oaslananka/helix"
LABEL org.opencontainers.image.description="Helix Gateway - MCP aggregation gateway"
LABEL org.opencontainers.image.licenses="MIT"

RUN addgroup -S helix && adduser -S helix -G helix
WORKDIR /workspace

RUN corepack enable && corepack prepare pnpm@10.33.0 --activate

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/
COPY packages/gateway/package.json ./packages/gateway/

RUN if [ -f pnpm-lock.yaml ]; then pnpm install --prod --frozen-lockfile --filter @helix/shared --filter @helix/gateway; else pnpm install --prod --filter @helix/shared --filter @helix/gateway; fi

COPY --from=builder /workspace/packages/shared/dist ./packages/shared/dist
COPY --from=builder /workspace/packages/gateway/dist ./packages/gateway/dist
COPY --from=builder /workspace/packages/gateway/public ./packages/gateway/public

USER helix
EXPOSE 3000

ENV NODE_ENV=production
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:${PORT:-3000}/health_check || exit 1

CMD ["node", "packages/gateway/dist/index.js"]
