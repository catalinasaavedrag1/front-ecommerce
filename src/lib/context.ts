/**
 * Contexto de la petición que el front adjunta al BFF.
 *
 * Se lee del estado persistido (las mismas claves que usa `AppContext`), así
 * cualquier función de `api/` puede componer el contexto sin necesitar props
 * de React ni recibirlo por parámetro. El canal B2C/B2B se DERIVA del cliente
 * logueado: empresa ⇒ b2b; en cualquier otro caso ⇒ b2c.
 *
 * Qué mandamos y por qué (alineado con lo que el BFF realmente lee):
 *   - x-sales-channel: 'web' (B2C) | 'b2b' (B2B)  ← mecanismo real del BFF
 *   - x-session-id, authorization, x-cart-id, x-store-id, x-locale, x-currency
 *   - x-commune: contexto de despacho (el BFF debe poblar `location`; ver gap
 *     en docs/CONTRATOS-BFF.md — hoy lo enviamos igual, es forward-compatible)
 *
 * Lo que NO mandamos: x-customer-id / x-price-list-id. El BFF los deriva del
 * JWT; enviarlos desde el cliente sería inseguro e inútil.
 */
import type { Customer } from '@/types'
import { STORAGE_KEYS, readJSON } from './storage'

export type Channel = 'web-b2c' | 'web-b2b'

export interface RequestContext {
  /** Canal de venta que entiende el BFF: 'web' (B2C) | 'b2b' (B2B). */
  salesChannel: 'web' | 'b2b'
  /** Canal lógico para uso del front (analítica, ramas de UI). */
  channel: Channel
  /** Comuna de despacho seleccionada, si existe. */
  commune?: string
}

/** Cliente logueado persistido (o null si anónimo). */
export function currentCustomer(): Customer | null {
  return readJSON<Customer>(STORAGE_KEYS.CUSTOMER)
}

/** Arma el contexto actual desde el estado persistido. */
export function requestContext(): RequestContext {
  const customer = currentCustomer()
  const isB2b = customer?.type === 'b2b'
  const commune = readJSON<string>(STORAGE_KEYS.COMUNA) ?? undefined
  return {
    salesChannel: isB2b ? 'b2b' : 'web',
    channel: isB2b ? 'web-b2b' : 'web-b2c',
    commune: commune || undefined,
  }
}
