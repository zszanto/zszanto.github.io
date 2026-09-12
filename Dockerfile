# Dockerfile for local development of the academic website.
#
# This project uses Next.js with `output: 'export'` (static site). Production
# is the static export published to GitHub Pages — there is no app server to
# containerize. This image only provides a consistent local dev environment.
#
# Stages:
#   deps  — install npm dependencies (cached on package*.json changes)
#   dev   — `next dev` for local development
#
# Build the dev stage with:
#   docker build --target dev -t zszanto-github-io:dev .

# ---- Pinned base image (single source of truth) ---------------------------
ARG NODE_IMAGE=node:20-alpine

# ---- deps -----------------------------------------------------------------
FROM ${NODE_IMAGE} AS deps
WORKDIR /app

# Install build deps occasionally needed by native modules on Alpine.
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
RUN npm ci

# ---- dev ------------------------------------------------------------------
# Used by `docker compose up`. Source is bind-mounted at runtime,
# so we don't COPY it here — that keeps the image small and rebuilds rare.
FROM ${NODE_IMAGE} AS dev
WORKDIR /app
# WATCHPACK_POLLING / CHOKIDAR_USEPOLLING give reliable file watching when
# the source is bind-mounted on Linux/macOS (inotify can miss events there).
ENV NODE_ENV=development \
    NEXT_TELEMETRY_DISABLED=1 \
    WATCHPACK_POLLING=true \
    CHOKIDAR_USEPOLLING=true

# node (uid 1000) matches the typical host user, so files written to the
# bind-mounted source (next-env.d.ts, tsconfig.tsbuildinfo) stay host-owned
# instead of root-owned. node_modules/.next are chowned so the named volumes
# in docker-compose.yml initialize writable for that user.
COPY --chown=node:node --from=deps /app/node_modules ./node_modules
RUN mkdir -p /app/.next && chown node:node /app /app/.next
USER node

# Default dev port. Compose sets PORT from DEV_PORT and publishes the same
# number on both sides, so the URL Next.js prints in its banner is the real,
# clickable host URL (no internal/external port mismatch).
ENV PORT=20020
EXPOSE 20020
# Bind to 0.0.0.0 so the port is reachable from the host. No -p flag:
# next dev reads the PORT env var.
CMD ["npx", "next", "dev", "-H", "0.0.0.0"]
