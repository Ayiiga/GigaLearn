#!/usr/bin/env bash
# Static export for GitHub Pages (no middleware or API routes).
set -euo pipefail
cd "$(dirname "$0")/.."

MIDDLEWARE_BACKUP=""
API_BACKUP=""

cleanup() {
  if [ -n "$MIDDLEWARE_BACKUP" ] && [ -f "$MIDDLEWARE_BACKUP" ]; then
    mv "$MIDDLEWARE_BACKUP" src/middleware.ts
  fi
  if [ -n "$API_BACKUP" ] && [ -d "$API_BACKUP/api" ]; then
    mv "$API_BACKUP/api" src/app/api
  fi
}
trap cleanup EXIT

if [ -f src/middleware.ts ]; then
  MIDDLEWARE_BACKUP="$(mktemp)"
  mv src/middleware.ts "$MIDDLEWARE_BACKUP"
fi

if [ -d src/app/api ]; then
  API_BACKUP="$(mktemp -d)"
  mv src/app/api "$API_BACKUP/api"
fi

export GITHUB_PAGES=true
export NEXT_PUBLIC_GITHUB_PAGES=true
export NEXT_PUBLIC_BASE_PATH="${NEXT_PUBLIC_BASE_PATH:-}"

npx next build
