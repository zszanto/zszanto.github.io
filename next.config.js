/** @type {import('next').NextConfig} */
// basePath/assetPrefix are configurable so the same build works for a user-page
// (https://<user>.github.io/) and a project-page (https://<user>.github.io/<repo>/).
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    // Static export cannot use the Next image optimizer.
    unoptimized: true,
  },
}

module.exports = nextConfig
