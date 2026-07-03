/**
 * Claves de almacenamiento del front, en un solo lugar para evitar strings
 * mágicos repartidos. `AppContext` y la capa `api/` comparten estas claves.
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

/** Lee y parsea un valor JSON de localStorage; null si no existe o está corrupto. */
export function readJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}
