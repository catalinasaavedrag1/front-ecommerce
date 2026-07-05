/**
 * Estado de sesión que el front envía como contexto al BFF.
 *
 * - `sessionId`: identidad anónima estable por navegador. El BFF la usa para
 *   asociar carrito y comportamiento antes del login.
 * - `cartId`: referencia al carrito abierto en cart-service (vía BFF).
 *
 * Ambos persisten en localStorage (wrappers seguros de `storage.ts`). En SSR
 * no hay navegador: `sessionId()` devuelve '' y el cliente HTTP omite el
 * header. En la F4 de la migración a Next.js la sesión pasa a cookies
 * (`lib/cookies.ts`) para que el servidor también la conozca.
 */
import { STORAGE_KEYS, hasBrowserStorage, storageGet, storageSet } from './storage'

/** Sesión anónima estable por navegador. '' en SSR (sin sesión que enviar). */
export function sessionId(): string {
  if (!hasBrowserStorage()) return ''
  let id = storageGet(STORAGE_KEYS.SESSION_ID)
  if (!id) {
    id = crypto.randomUUID()
    storageSet(STORAGE_KEYS.SESSION_ID, id)
  }
  return id
}

/** cartId activo (o null si aún no hay carrito en el BFF / estamos en SSR). */
export function getCartId(): string | null {
  return storageGet(STORAGE_KEYS.CART_ID)
}

/** Fija/limpia el cartId activo (no-op en SSR). */
export function setCartId(id: string | null): void {
  storageSet(STORAGE_KEYS.CART_ID, id)
}
