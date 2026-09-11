.PHONY: dev build start lint typecheck format format-check check install clean reset help

dev: ## Start the Next.js development server
	npm run dev

build: ## Build for production (includes TS type-check via Next.js)
	npm run build

start: ## Start the production server (requires a prior build)
	npm run start

lint: ## Lint with ESLint
	npm run lint -- --ignore-pattern ".next/**"

typecheck: ## Type-check with TypeScript (no emit)
	npx tsc --noEmit

format: ## Format all files with Prettier (writes changes)
	npm run format

format-check: ## Verify formatting without writing changes
	npm run format:check

check: lint typecheck format-check ## Run all quality gates (lint + typecheck + format check)

install: ## Install dependencies from lock-file
	npm ci

clean: ## Remove node_modules and Next.js build artifacts
	rm -rf node_modules .next out

reset: clean install ## Full clean + reinstall
	@echo "✓ Reset complete — run 'make dev' to start"

# ── Help ─────────────────────────────────────────────────────────────────────

help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-16s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help