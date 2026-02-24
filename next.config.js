/** @type {import('next').NextConfig} */
const basePath = process.env.BASE_PATH || '';
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
};

module.exports = nextConfig;