/**
 * Pedidos — oms-service a través del web-bff-service.
 *
 * Todas las rutas exigen sesión (`AuthGuard` del BFF) y el BFF verifica la
 * PROPIEDAD de la orden: un cliente sólo ve las suyas, y una orden ajena
 * responde 404 (no 403) para no revelar que existe. El front no necesita
 * filtrar por cliente ni mandar el customerId: sale del JWT.
 *
 * El front NO cambia estados de OMS. Lo único que puede pedir es la
 * CANCELACIÓN (`cancel-request`), que OMS acepta o rechaza según el estado en
 * que esté el pedido. Las transiciones son de OMS.
 */
import { webBffRequest } from './web-bff.client'
import type {
  BffOrderAttachment,
  BffOrderDetail,
  BffOrderSummary,
  BffOrderTracking,
} from './types'

/** `GET /orders` — pedidos del cliente de la sesión. */
export function fetchOrders(): Promise<BffOrderSummary[]> {
  return webBffRequest<BffOrderSummary[]>('/orders')
}

/** `GET /orders/:orderId` — orden + tracking + documentos en una llamada. */
export function fetchOrder(orderId: string): Promise<BffOrderDetail> {
  return webBffRequest<BffOrderDetail>(`/orders/${encodeURIComponent(orderId)}`)
}

/**
 * `GET /orders/:orderId/tracking` — estado + historial de eventos de OMS.
 * Más barato que el detalle completo cuando sólo se quiere el avance.
 */
export function fetchOrderTracking(orderId: string): Promise<BffOrderTracking> {
  return webBffRequest<BffOrderTracking>(`/orders/${encodeURIComponent(orderId)}/tracking`)
}

/**
 * `GET /orders/:orderId/documents` — adjuntos de la orden en OMS.
 * Ojo: no son los documentos tributarios; esos vienen en el detalle
 * (`BffOrderDetail.documents`, de finance-service).
 */
export function fetchOrderDocuments(orderId: string): Promise<BffOrderAttachment[]> {
  return webBffRequest<BffOrderAttachment[]>(`/orders/${encodeURIComponent(orderId)}/documents`)
}

/**
 * `POST /orders/:orderId/cancel-request` — solicita la cancelación. Devuelve la
 * orden como quedó en OMS: el estado resultante lo decide OMS, no el front.
 */
export function requestOrderCancellation(
  orderId: string,
  reason?: string
): Promise<BffOrderSummary> {
  return webBffRequest<BffOrderSummary>(
    `/orders/${encodeURIComponent(orderId)}/cancel-request`,
    { method: 'POST', body: { reason } }
  )
}
