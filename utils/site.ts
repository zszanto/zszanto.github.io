/**
 * Single source of truth for site-wide metadata.
 *
 * `NEXT_PUBLIC_SITE_URL` overrides the default in CI, e.g.
 *   NEXT_PUBLIC_SITE_URL=https://zszanto.github.io next build
 */
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') ||
  'https://zszanto.github.io'

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
