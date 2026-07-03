/**
 * Pedidos. Requiere sesión. El BFF entrega estados entendibles para el cliente
 * (no estados operativos internos del OMS).
 *
 * Endpoints:
 *   GET  /orders
 *   GET  /orders/:orderId
 *   GET  /orders/:orderId/tracking
 *   GET  /orders/:orderId/documents
 *   POST /orders/:orderId/cancel-request
 */
import { webBffRequest } from './web-bff.client'
import type { BffOrderDetail, BffOrderSummary } from './types'

export function fetchOrders(): Promise<BffOrderSummary[]> {
  return webBffRequest<BffOrderSummary[]>('/orders')
}

export function fetchOrder(orderId: string): Promise<BffOrderDetail> {
  return webBffRequest<BffOrderDetail>(`/orders/${encodeURIComponent(orderId)}`)
}

export function fetchOrderTracking(orderId: string): Promise<BffOrderDetail['fulfillment']> {
  return webBffRequest(`/orders/${encodeURIComponent(orderId)}/tracking`)
}

export function fetchOrderDocuments(orderId: string): Promise<BffOrderDetail['documents']> {
  return webBffRequest(`/orders/${encodeURIComponent(orderId)}/documents`)
}

export function requestOrderCancellation(orderId: string, reason?: string): Promise<{ status: string }> {
  return webBffRequest(`/orders/${encodeURIComponent(orderId)}/cancel-request`, { method: 'POST', body: { reason } })
}
