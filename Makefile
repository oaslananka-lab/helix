.PHONY: install build test lint typecheck clean dev docker-gateway docker-agent docker-all release help

install:
	pnpm install

build: install
	pnpm build

dev: install
	pnpm dev

test: install
	pnpm test

lint: install
	pnpm lint

typecheck: install
	pnpm typecheck

clean:
	pnpm clean

docker-gateway:
	docker build -f packages/gateway/Dockerfile -t ghcr.io/oaslananka-lab/helix/gateway:latest .

docker-agent:
	docker build -f packages/agent/Dockerfile -t ghcr.io/oaslananka-lab/helix/agent:latest .

docker-all: docker-gateway docker-agent

release:
	pnpm changeset
	pnpm changeset version
	git add -A
	git commit -m "chore: version packages"
	pnpm changeset publish

help:
	@echo "Helix monorepo targets:"
	@echo "  install       Install workspace dependencies"
	@echo "  build         Build all packages"
	@echo "  dev           Start packages in dev mode"
	@echo "  test          Run package tests"
	@echo "  lint          Lint packages"
	@echo "  typecheck     Typecheck packages"
	@echo "  docker-all    Build Gateway and Agent images"
	@echo "  release       Version and publish packages with Changesets"
