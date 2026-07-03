/**
 * Autenticación / sesión.
 *
 * El web-bff-service es proveedor de EXPERIENCIA, no de identidad: expone
 * `GET /auth/session` (contexto de la sesión: anónima o autenticada) y VALIDA
 * el JWT que le llega, pero NO emite tokens (no hay login/logout en el BFF).
 *
 * GAP documentado (ver docs/CONTRATOS-BFF.md → "Login/logout"): falta definir
 * quién emite el token del cliente (¿id-service? ¿un endpoint del BFF que haga
 * proxy?). Hasta cerrarlo, el login del front usa su flujo de maqueta y
 * `lib/auth.setToken()` para persistir el token cuando exista el emisor real.
 */
import { webBffRequest } from './web-bff.client'
import type { BffSession } from './types'

/** Contexto de la sesión actual según el BFF (anónima o autenticada). */
export function fetchSession(): Promise<BffSession> {
  return webBffRequest<BffSession>('/auth/session')
}
