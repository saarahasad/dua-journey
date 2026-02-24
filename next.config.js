/** @type {import('next').NextConfig} */
// Only use basePath in production (e.g. GitHub Pages). Local dev always runs at /
const basePath =
  process.env.NODE_ENV === "production" && process.env.BASE_PATH
    ? process.env.BASE_PATH
    : "";
const nextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
};

module.exports = nextConfig;