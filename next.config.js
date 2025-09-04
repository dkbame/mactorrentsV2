/** @type {import('next').NextConfig} */
const nextConfig = {
  // No output export - we need API routes for the tracker
  images: {
    unoptimized: true
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig
