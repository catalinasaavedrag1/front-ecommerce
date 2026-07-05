import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  // En GitHub Pages el sitio se sirve bajo /<repo>/; en local, bajo /.
  base: process.env.GITHUB_PAGES === 'true' ? '/front-ecommerce/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      // Shim de navegación: bajo Vite '@/nav' usa react-router-dom
      // (src/nav/vite.tsx); bajo Next el default es next/navigation.
      '@/nav': path.resolve(__dirname, './src/nav/vite.tsx'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true,
    // Proxy de dev hacia el web-bff-service (evita CORS en local).
    // Con VITE_BFF_URL=/api/web-bff las llamadas pasan por aquí.
    proxy: {
      '/api/web-bff': {
        target: process.env.BFF_PROXY_TARGET ?? 'http://localhost:3080',
        changeOrigin: true,
      },
    },
  },
})
