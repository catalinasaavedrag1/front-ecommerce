/**
 * Token de autenticación del cliente logueado.
 *
 * IMPORTANTE (decisión de arquitectura): el web-bff-service deriva la
 * identidad del cliente —customerId, customerType (B2C/B2B), priceListId,
 * companyId, roles— desde los *claims del JWT*, NO desde headers. Por eso el
 * front NO debe enviar `x-customer-id` ni `x-price-list-id`: basta con mandar
 * el token. Que el cliente afirme su propia lista de precios sería inseguro.
 * (Ver docs/CONTRATOS-BFF.md → "Contexto B2B".)
 *
 * SSR-safe (F0 de la migración a Next.js): en el servidor no hay localStorage;
 * `getToken()` devuelve null (anónimo). En la F4 el token pasa a cookie
 * httpOnly y el servidor lo leerá de ahí.
 */
import { STORAGE_KEYS, storageGet, storageSet } from './storage'

/** Token Bearer actual, o null si el cliente es anónimo (o estamos en SSR). */
export function getToken(): string | null {
  return storageGet(STORAGE_KEYS.TOKEN)
}

/** Guarda el token del cliente logueado (no-op en SSR). */
export function setToken(token: string | null): void {
  storageSet(STORAGE_KEYS.TOKEN, token)
}

/** true si hay un token presente (sesión de cliente). */
export function isAuthenticated(): boolean {
  return !!getToken()
}
