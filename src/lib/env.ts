/**
 * Configuración de entorno del front.
 *
 * La única variable que decide el "modo" de la app es `VITE_BFF_URL`:
 *   - vacía / ausente  → modo maqueta (datos de `src/data/*`)
 *   - con valor        → modo conectado (datos del web-bff-service)
 *
 * En dev conviene `VITE_BFF_URL=/api/web-bff` para que el proxy de
 * `vite.config.ts` reenvíe a `http://localhost:3080` y evite CORS.
 */

/** Base del web-bff-service, sin barra final. '' cuando no está configurada. */
export const BFF_BASE_URL: string = ((import.meta.env.VITE_BFF_URL as string | undefined) ?? '')
  .trim()
  .replace(/\/$/, '')

/** true si el front está configurado para hablar con el BFF. */
export function isBffEnabled(): boolean {
  return BFF_BASE_URL.length > 0
}

/** Timeout por request al BFF (ms). Puede sobreescribirse con VITE_BFF_TIMEOUT_MS. */
export const BFF_TIMEOUT_MS: number = Number(import.meta.env.VITE_BFF_TIMEOUT_MS ?? 8000) || 8000

/** Locale y moneda por defecto que el front declara al BFF. */
export const LOCALE = 'es-CL'
export const CURRENCY = 'CLP'
