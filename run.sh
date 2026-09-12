#!/usr/bin/env bash
# run.sh — start the Next.js dev server (Ctrl-C to stop).
#
# Thin wrapper around docker compose. All configuration — image, container
# name, port (20020, override with DEV_PORT=...), env — lives in
# docker-compose.yml, the single source of truth.

set -euo pipefail

# Run from the repo root regardless of the caller's current directory.
cd "$(dirname "${BASH_SOURCE[0]}")"

exec docker compose up --build "$@"
