/**
 * Claves de almacenamiento del front, en un solo lugar para evitar strings
 * mágicos repartidos. `AppContext` y la capa `api/` comparten estas claves.
 *
 * F0 de la migración a Next.js (ver docs/PLAN-MIGRACION-NEXTJS.md): todo el
 * acceso a localStorage pasa por wrappers seguros para SSR — en el servidor
 * (`window` no existe) devuelven null y no escriben. Así `lib/` y `api/`
 * pueden ejecutarse en server components sin explotar.
 */
export const STORAGE_KEYS = {
  /** Cliente logueado (JSON `Customer`). Fuente del canal B2C/B2B. */
  CUSTOMER: 'mimbral.customer',
  /** Comuna de despacho seleccionada (JSON string). */
  COMUNA: 'mimbral.comuna',
  /** Preferencia B2B de visualización de precios. */
  PRICE_VIEW: 'mimbral.priceview',
  /** Token del cliente logueado (Bearer). */
  TOKEN: 'mimbral.token',
  /** Sesión anónima persistente por navegador (contexto del BFF). */
  SESSION_ID: 'mimbral.bff.session',
  /** cartId activo devuelto por el BFF. */
  CART_ID: 'mimbral.bff.cartId',
  /** Registro de productos vivos (del BFF) para resolver por SKU. */
  PRODUCTS: 'mimbral.bff.products',
} as const

/** true si hay almacenamiento de navegador disponible (false en SSR). */
export function hasBrowserStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

/** Lee un string de localStorage; null en SSR o si no existe. */
export function storageGet(key: string): string | null {
  if (!hasBrowserStorage()) return null
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

/** Escribe (o borra con null) un string en localStorage; no-op en SSR. */
export function storageSet(key: string, value: string | null): void {
  if (!hasBrowserStorage()) return
  try {
    if (value === null) window.localStorage.removeItem(key)
    else window.localStorage.setItem(key, value)
  } catch {
    /* cuota llena o storage bloqueado: se ignora */
  }
}

/** Lee y parsea un valor JSON de localStorage; null si no existe o está corrupto. */
export function readJSON<T>(key: string): T | null {
  try {
    const raw = storageGet(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}
