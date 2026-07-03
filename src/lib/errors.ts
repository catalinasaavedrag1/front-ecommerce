/**
 * Errores del BFF, tipados y traducidos a mensajes amigables para el cliente.
 *
 * El BFF responde errores con el sobre plano:
 *   { success: false, code, message, statusCode, details?, correlationId? }
 *
 * `message` ya viene en español y apto para mostrar, pero para tener una UX
 * consistente sin depender del wording de cada servicio downstream, mapeamos
 * los `code` conocidos a un texto propio. Orden de preferencia al mostrar:
 *   1. mensaje del catálogo (code conocido)
 *   2. `message` que vino del BFF
 *   3. mensaje genérico
 *
 * El front NUNCA debe mostrar errores técnicos internos (SAP, Prisma, Kafka,
 * SQL, "reservation failed", etc.). Todo pasa por `toUserMessage`.
 */

export interface BffError extends Error {
  /** Código estable del BFF (p. ej. STOCK_UNAVAILABLE). */
  code: string
  /** HTTP status asociado. 0 para fallos de red/timeout. */
  status: number
  /** Id de correlación para trazar en logs del BFF. */
  correlationId?: string
  /** Payload de detalle opcional (no se muestra al usuario). */
  details?: unknown
}

/** Crea un BffError consistente. */
export function makeBffError(
  message: string,
  opts: { code: string; status: number; correlationId?: string; details?: unknown },
): BffError {
  const err = new Error(message) as BffError
  err.code = opts.code
  err.status = opts.status
  err.correlationId = opts.correlationId
  err.details = opts.details
  return err
}

const GENERIC = 'Algo salió mal. Por favor, intenta nuevamente en unos momentos.'

/**
 * Catálogo `code → mensaje amigable`. Incluye los códigos reales del BFF y
 * alias de los esperados en el brief (por si algún servicio los emite).
 */
export const ERROR_MESSAGES: Record<string, string> = {
  // --- Códigos reales del web-bff-service ---
  STOCK_UNAVAILABLE: 'Este producto no tiene stock disponible.',
  PRICING_UNAVAILABLE: 'No pudimos obtener el precio. Intenta nuevamente.',
  RESOURCE_NOT_FOUND: 'No encontramos lo que buscabas.',
  INVALID_SALES_CHANNEL: 'Esta operación no está disponible para tu tipo de cuenta.',
  VALIDATION_ERROR: 'Revisa los datos ingresados e intenta otra vez.',
  BAD_REQUEST: 'Revisa los datos ingresados e intenta otra vez.',
  DOWNSTREAM_SERVICE_ERROR: 'Estamos con una intermitencia. Vuelve a intentarlo en unos minutos.',
  INTERNAL_ERROR: GENERIC,

  // --- Alias/semántica esperada por el negocio (brief) ---
  OUT_OF_STOCK: 'Este producto no tiene stock disponible.',
  PRICE_NOT_AVAILABLE: 'No pudimos obtener el precio. Intenta nuevamente.',
  CHECKOUT_EXPIRED: 'Tu sesión de compra expiró. Vuelve a intentarlo.',
  CUSTOMER_NOT_AUTHORIZED: 'No tienes permisos para realizar esta compra.',
  DELIVERY_NOT_AVAILABLE: 'No hay despacho disponible para esta dirección.',

  // --- Transporte (generados por el propio cliente) ---
  NETWORK_ERROR: 'No pudimos conectar. Revisa tu conexión e intenta nuevamente.',
  TIMEOUT: 'La operación tardó demasiado. Intenta nuevamente.',
}

/** Devuelve un mensaje apto para mostrar al cliente a partir de cualquier error. */
export function toUserMessage(err: unknown): string {
  if (isBffError(err)) {
    return ERROR_MESSAGES[err.code] ?? err.message ?? GENERIC
  }
  return GENERIC
}

/** Type guard de BffError. */
export function isBffError(err: unknown): err is BffError {
  return err instanceof Error && typeof (err as BffError).code === 'string'
}
