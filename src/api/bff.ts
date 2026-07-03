/**
 * Cliente HTTP hacia el web-bff-service.
 *
 * La conexión es OPCIONAL y degradable: si `VITE_BFF_URL` no está configurada
 * (o el BFF no responde), las pantallas siguen funcionando con los datos de
 * ejemplo locales (`src/data/*`). Con la variable configurada, los datos
 * vienen del BFF y el resto de la app no nota la diferencia.
 */

const BASE: string = (import.meta.env.VITE_BFF_URL as string | undefined)?.replace(/\/$/, '') ?? ''

/** true si el front está configurado para hablar con el BFF. */
export function isBffEnabled(): boolean {
  return BASE.length > 0
}

export interface BffError extends Error {
  code: string
  status: number
  correlationId?: string
}

interface BffEnvelope<T> {
  success: boolean
  data: T
  code?: string
  message?: string
  statusCode?: number
  correlationId?: string
}

const SESSION_KEY = 'mimbral.bff.session'
const CART_KEY = 'mimbral.bff.cartId'

/** Sesión anónima estable por navegador (el BFF la usa como contexto). */
export function sessionId(): string {
  let id = localStorage.getItem(SESSION_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export function bffCartId(): string | null {
  return localStorage.getItem(CART_KEY)
}

export function setBffCartId(id: string | null): void {
  if (id) localStorage.setItem(CART_KEY, id)
  else localStorage.removeItem(CART_KEY)
}

/** Llama al BFF y desenvuelve { success, data }. Lanza BffError en fallo. */
export async function bff<T>(path: string, init: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('mimbral.token')
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      'x-sales-channel': 'web',
      'x-locale': 'es-CL',
      'x-session-id': sessionId(),
      ...(token ? { authorization: `Bearer ${token}` } : {}),
      ...(init.headers ?? {}),
    },
  })
  const body = (await res.json()) as BffEnvelope<T>
  if (!res.ok || body.success === false) {
    const err = new Error(body.message ?? `Error ${res.status}`) as BffError
    err.code = body.code ?? `HTTP_${res.status}`
    err.status = body.statusCode ?? res.status
    err.correlationId = body.correlationId
    throw err
  }
  return body.data
}
