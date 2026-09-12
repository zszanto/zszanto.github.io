# Academic Personal Website

A small, content-driven academic site built with **Next.js 15 (App Router) + React 19 + TypeScript + Tailwind CSS** and exported as a fully static site — no server, no database, no API keys. Drop the build output on any static host.

All content lives in JSON files under `data/`. To update the site, edit JSON.

---

## Local development

Run the dev server with the helper script — it wraps `docker compose up
--build`, so you don't need Node installed on the host. All configuration
(port, container name, env) lives in `docker-compose.yml`:

```bash
./run.sh             # http://localhost:20020 (Ctrl-C to stop)
```

## Deployment

Every push to `master` auto-deploys: `.github/workflows/deploy.yml` builds
the static export (`npm run build` → `out/`) and publishes it to GitHub
Pages at https://zszanto.github.io.

The previous Hugo Academic site is preserved on the `old-hugo-academic`
branch (and tag of the same name).
