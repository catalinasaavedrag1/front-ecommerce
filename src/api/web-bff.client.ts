/**
 * Cliente HTTP único hacia el web-bff-service.
 *
 * TODA llamada al BFF pasa por aquí. Los componentes NO hacen `fetch` a mano:
 * consumen funciones de `api/*.api.ts`, que a su vez usan `webBffRequest`.
 *
 * Responsabilidades:
 *   - base URL (de `lib/env`)
 *   - headers comunes + contexto B2C/B2B (canal, sesión, token, comuna, store)
 *   - timeout (AbortController)
 *   - desenvolver el sobre `{ success, data }`
 *   - errores tipados (`BffError`) con `code`/`status`/`correlationId`
 *
 * La conexión es OPCIONAL: si `VITE_BFF_URL` no está configurada, las
 * pantallas siguen operando con los datos de ejemplo locales (degradación
 * elegante en la capa de hooks/api de dominio).
 */
import { BFF_BASE_URL, BFF_TIMEOUT_MS, CURRENCY, LOCALE, isBffEnabled } from '@/lib/env'
import { requestContext } from '@/lib/context'
import { getToken } from '@/lib/auth'
import { getCartId, sessionId } from '@/lib/session'
import { makeBffError, type BffError } from '@/lib/errors'

export { isBffEnabled }

export interface WebBffRequestOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  /** Cuerpo JSON (se serializa automáticamente). */
  body?: unknown
  /** Query params (se serializan y omiten los undefined/null). */
  query?: Record<string, string | number | boolean | undefined | null>
  /** Store/tienda física si aplica (x-store-id). */
  storeId?: string
  /** Override del cartId (por defecto toma el de sesión). */
  cartId?: string | null
  /** Headers extra puntuales. */
  headers?: Record<string, string>
  /** Timeout específico (ms). */
  timeoutMs?: number
  /** AbortSignal externo (p. ej. cancelación de React). */
  signal?: AbortSignal
}

interface BffSuccessEnvelope<T> {
  success: true
  data: T
  correlationId?: string
}
interface BffErrorEnvelope {
  success: false
  code?: string
  message?: string
  statusCode?: number
  details?: unknown
  correlationId?: string
}
type BffEnvelope<T> = BffSuccessEnvelope<T> | BffErrorEnvelope

function buildQuery(query?: WebBffRequestOptions['query']): string {
  if (!query) return ''
  const params = new URLSearchParams()
  for (const [k, v] of Object.entries(query)) {
    if (v !== undefined && v !== null && v !== '') params.set(k, String(v))
  }
  const qs = params.toString()
  return qs ? `?${qs}` : ''
}

/** Compone los headers comunes + contexto B2C/B2B para una petición. */
function buildHeaders(options: WebBffRequestOptions): Record<string, string> {
  const ctx = requestContext()
  const token = getToken()
  const cartId = options.cartId ?? getCartId()
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'x-sales-channel': ctx.salesChannel,
    'x-locale': LOCALE,
    'x-currency': CURRENCY,
    'x-session-id': sessionId(),
  }
  if (token) headers.authorization = `Bearer ${token}`
  if (cartId) headers['x-cart-id'] = cartId
  if (options.storeId) headers['x-store-id'] = options.storeId
  if (ctx.commune) headers['x-commune'] = ctx.commune
  return { ...headers, ...(options.headers ?? {}) }
}

/**
 * Ejecuta una petición al BFF y devuelve `data` ya desenvuelta.
 * Lanza `BffError` ante fallo HTTP, error de negocio, red o timeout.
 */
export async function webBffRequest<T>(path: string, options: WebBffRequestOptions = {}): Promise<T> {
  if (!isBffEnabled()) {
    throw makeBffError('BFF no configurado', { code: 'BFF_DISABLED', status: 0 })
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? BFF_TIMEOUT_MS)
  // Si el caller trae su propio signal, encadenamos la cancelación.
  if (options.signal) options.signal.addEventListener('abort', () => controller.abort(), { once: true })

  let res: Response
  try {
    res = await fetch(`${BFF_BASE_URL}${path}${buildQuery(options.query)}`, {
      method: options.method ?? 'GET',
      headers: buildHeaders(options),
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    })
  } catch (e) {
    clearTimeout(timeout)
    const aborted = e instanceof DOMException && e.name === 'AbortError'
    throw makeBffError(aborted ? 'Timeout' : 'Error de red', {
      code: aborted ? 'TIMEOUT' : 'NETWORK_ERROR',
      status: 0,
    })
  } finally {
    clearTimeout(timeout)
  }

  let body: BffEnvelope<T> | null = null
  try {
    body = (await res.json()) as BffEnvelope<T>
  } catch {
    // Respuesta sin cuerpo JSON (204, etc.).
  }

  if (!res.ok || (body && body.success === false)) {
    const errBody = (body ?? {}) as BffErrorEnvelope
    throw makeBffError(errBody.message ?? `Error ${res.status}`, {
      code: errBody.code ?? `HTTP_${res.status}`,
      status: errBody.statusCode ?? res.status,
      correlationId: errBody.correlationId,
      details: errBody.details,
    })
  }

  return (body as BffSuccessEnvelope<T>)?.data as T
}

export type { BffError }
