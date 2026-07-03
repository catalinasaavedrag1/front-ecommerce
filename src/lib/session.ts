/**
 * Estado de sesión que el front envía como contexto al BFF.
 *
 * - `sessionId`: identidad anónima estable por navegador. El BFF la usa para
 *   asociar carrito y comportamiento antes del login.
 * - `cartId`: referencia al carrito abierto en cart-service (vía BFF).
 *
 * Ambos persisten en localStorage. En un SPA Vite no hay cookies de servidor;
 * si el proyecto migra a SSR, `sessionId` debería pasar a cookie httpOnly
 * emitida por el backend (ver docs/CONTRATOS-BFF.md).
 */
import { STORAGE_KEYS } from './storage'

/** Sesión anónima estable por navegador. La crea la primera vez que se usa. */
export function sessionId(): string {
  let id = localStorage.getItem(STORAGE_KEYS.SESSION_ID)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEYS.SESSION_ID, id)
  }
  return id
}

/** cartId activo (o null si aún no hay carrito en el BFF). */
export function getCartId(): string | null {
  return localStorage.getItem(STORAGE_KEYS.CART_ID)
}

/** Fija/limpia el cartId activo. */
export function setCartId(id: string | null): void {
  if (id) localStorage.setItem(STORAGE_KEYS.CART_ID, id)
  else localStorage.removeItem(STORAGE_KEYS.CART_ID)
}
