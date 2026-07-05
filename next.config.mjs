/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    // Igual que el proxy de Vite: /api/web-bff/* -> BFF local (evita CORS en dev).
    const target = process.env.BFF_PROXY_TARGET ?? 'http://localhost:3080'
    return [{ source: '/api/web-bff/:path*', destination: `${target}/api/web-bff/:path*` }]
  },
}

export default nextConfig
