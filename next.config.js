
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Enable React strict mode for better developer experience
  reactStrictMode: true,
}

module.exports = nextConfig
