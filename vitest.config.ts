import { defineConfig } from 'vitest/config'
import path from 'node:path'

/**
 * Pruebas de la capa de integración con el BFF: adaptadores, utilidades de
 * disponibilidad y clientes API. Son pruebas de contrato y de reglas de
 * presentación — no levantan navegador ni microservicios.
 */
export default defineConfig({
  resolve: {
    alias: {
      '@/nav': path.resolve(__dirname, './src/nav/vite.tsx'),
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
})
