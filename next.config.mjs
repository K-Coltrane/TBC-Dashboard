/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  // SWC minification is enabled by default in Next.js 16, no need to specify
  // Fix workspace root warning
  turbopack: {
    root: process.cwd(),
  },
  // Netlify will handle the output automatically via @netlify/plugin-nextjs
}

export default nextConfig
