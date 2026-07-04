/**
 * Configuración de entorno del front.
 *
 * La única variable que decide el "modo" de la app es la URL del BFF:
 *   - vacía / ausente  → modo maqueta (datos de `src/data/*`)
 *   - con valor        → modo conectado (datos del web-bff-service)
 *
 * F0 de la migración a Next.js: lectura DUAL de la variable, compatible con
 * ambos mundos durante la transición.
 *   - Vite (hoy):      VITE_BFF_URL              (import.meta.env)
 *   - Next server:     WEB_BFF_INTERNAL_URL      (red interna, prioridad)
 *                      ?? NEXT_PUBLIC_WEB_BFF_URL
 *   - Next client:     NEXT_PUBLIC_WEB_BFF_URL
 * Nota Next: los accesos a process.env.NEXT_PUBLIC_* deben ser LITERALES
 * (Next los reemplaza estáticamente en el bundle del browser) — por eso no
 * hay lookup dinámico de claves aquí.
 */

type MaybeEnv = Record<string, string | undefined> | undefined

/** import.meta.env existe solo bajo Vite; bajo Next es undefined. */
const viteEnv = (import.meta as unknown as { env?: MaybeEnv }).env

function resolveBffUrl(): string {
  // 1) Vite (build actual)
  if (viteEnv?.VITE_BFF_URL !== undefined) return viteEnv.VITE_BFF_URL ?? ''
  // 2) Node/Next (accesos literales, ver nota arriba)
  if (typeof process !== 'undefined' && process.env) {
    if (typeof window === 'undefined') {
      // Server: preferir la URL interna (sin pasar por el edge)
      return process.env.WEB_BFF_INTERNAL_URL ?? process.env.NEXT_PUBLIC_WEB_BFF_URL ?? ''
    }
    return process.env.NEXT_PUBLIC_WEB_BFF_URL ?? ''
  }
  return ''
}

/** Base del web-bff-service, sin barra final. '' cuando no está configurada. */
export const BFF_BASE_URL: string = resolveBffUrl().trim().replace(/\/$/, '')

/** true si el front está configurado para hablar con el BFF. */
export function isBffEnabled(): boolean {
  return BFF_BASE_URL.length > 0
}

/** Timeout por request al BFF (ms). Sobre-escribible con VITE_BFF_TIMEOUT_MS. */
export const BFF_TIMEOUT_MS: number = Number(viteEnv?.VITE_BFF_TIMEOUT_MS ?? 8000) || 8000

/** Locale y moneda por defecto que el front declara al BFF. */
export const LOCALE = 'es-CL'
export const CURRENCY = 'CLP'
