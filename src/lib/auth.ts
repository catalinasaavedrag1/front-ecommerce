/**
 * Token de autenticación del cliente logueado.
 *
 * IMPORTANTE (decisión de arquitectura): el web-bff-service deriva la
 * identidad del cliente —customerId, customerType (B2C/B2B), priceListId,
 * companyId, roles— desde los *claims del JWT*, NO desde headers. Por eso el
 * front NO debe enviar `x-customer-id` ni `x-price-list-id`: basta con mandar
 * el token. Que el cliente afirme su propia lista de precios sería inseguro.
 * (Ver docs/CONTRATOS-BFF.md → "Contexto B2B".)
 */
import { STORAGE_KEYS } from './storage'

/** Token Bearer actual, o null si el cliente es anónimo. */
export function getToken(): string | null {
  return localStorage.getItem(STORAGE_KEYS.TOKEN)
}

/** Guarda el token del cliente logueado. */
export function setToken(token: string | null): void {
  if (token) localStorage.setItem(STORAGE_KEYS.TOKEN, token)
  else localStorage.removeItem(STORAGE_KEYS.TOKEN)
}

/** true si hay un token presente (sesión de cliente). */
export function isAuthenticated(): boolean {
  return !!getToken()
}
