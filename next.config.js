/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  images: { unoptimized: true },
  basePath: '/freestyle-lab',
  assetPrefix: '/freestyle-lab/',
  trailingSlash: true,
}

module.exports = nextConfig
