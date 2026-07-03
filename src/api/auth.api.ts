/**
 * Autenticación / sesión — fachada del BFF hacia id-service.
 *
 * Decisión de arquitectura (cerrada): el front NUNCA habla con id-service
 * directo; el BFF expone la fachada (`/auth/login|refresh|logout|me`) y delega
 * en id-service, que es el emisor de los JWT de la plataforma. El BFF valida
 * el token localmente en cada request (secreto compartido).
 *
 * NOTA UI: por decisión de producto, la pantalla de login del ecommerce sigue
 * siendo demo local por ahora. Estas funciones dejan el contrato listo; cablear
 * la UI es solo llamar `login()` y `setToken()` cuando se decida activarlo.
 */
import { webBffRequest } from './web-bff.client'
import { setToken } from '@/lib/auth'
import type { BffSession } from './types'

/** Contexto de la sesión actual según el BFF (anónima o autenticada). */
export function fetchSession(): Promise<BffSession> {
  return webBffRequest<BffSession>('/auth/session')
}

export interface LoginResult {
  token: string
  usuarioId?: number
  nombre?: string
  correo?: string
}

/**
 * Login vía BFF → id-service. Si el BFF responde 409 SESSION_ALREADY_ACTIVE,
 * reintentar con `forzarSesion: true` (previa confirmación del usuario).
 * Persiste el token automáticamente.
 */
export async function login(opts: {
  correo: string
  password: string
  plataformaId: number
  forzarSesion?: boolean
}): Promise<LoginResult> {
  const res = await webBffRequest<LoginResult>('/auth/login', { method: 'POST', body: opts })
  setToken(res.token)
  return res
}

/** Renueva el token (el anterior puede estar vencido). Persiste el nuevo. */
export async function refresh(tokenAnterior: string): Promise<{ token: string }> {
  const res = await webBffRequest<{ token: string }>('/auth/refresh', {
    method: 'POST',
    body: { tokenAnterior },
  })
  setToken(res.token)
  return res
}

/** Cierra sesión (best-effort en el backend) y limpia el token local siempre. */
export async function logout(opts: { usuarioId: number; plataformaId: number }): Promise<void> {
  try {
    await webBffRequest('/auth/logout', { method: 'POST', body: opts })
  } finally {
    setToken(null)
  }
}

/** Identidad + permisos + empresa del usuario autenticado. */
export function fetchMe(): Promise<{
  customerId?: string
  customerType: string
  roles: string[]
  priceListId?: string
  companyId?: string
  isAuthenticated: boolean
  permissions: unknown[]
  company: Record<string, unknown> | null
}> {
  return webBffRequest('/auth/me')
}

/** Contexto comercial completo de la sesión (canal, cliente, empresa, tienda, comuna). */
export function fetchCommercialContext(): Promise<{
  session: { sessionId?: string; isAuthenticated: boolean }
  customer: {
    customerId?: string
    customerType: string
    roles: string[]
    priceListId?: string
    companyId?: string
  }
  commercial: {
    salesChannel: string
    storeId?: string
    location: { commune?: string; region?: string } | null
    company: Record<string, unknown> | null
  }
}> {
  return webBffRequest('/context')
}
