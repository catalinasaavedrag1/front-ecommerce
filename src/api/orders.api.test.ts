import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { BffOrderSummary, BffOrderTracking } from './types'

/**
 * Contrato de pedidos contra `web-bff-service`. Se protege la forma REAL que
 * entrega el BFF (`OrderMapper`/`OrderPageAggregator`): antes el front
 * declaraba `orderId`/`statusLabel`/`itemCount`, campos que el BFF nunca
 * envía, así que con sesión real la lista salía sin id, con 0 ítems y todos
 * los pedidos en el mismo estado.
 */

vi.mock('@/lib/env', () => ({
  BFF_BASE_URL: 'http://bff.test/api/web-bff',
  BFF_TIMEOUT_MS: 1000,
  CURRENCY: 'CLP',
  LOCALE: 'es-CL',
  isBffEnabled: () => true,
}))
vi.mock('@/lib/session', () => ({ getCartId: () => null, setCartId: vi.fn(), sessionId: () => '' }))

const fetchMock = vi.fn()
beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})
afterEach(() => vi.unstubAllGlobals())

const ok = (data: unknown) =>
  ({ ok: true, status: 200, json: async () => ({ success: true, data }) }) as unknown as Response

/** Tal como lo arma `OrderMapper.toView` en el BFF. */
const orderView: BffOrderSummary = {
  id: 'a1b2c3',
  commerceId: 'MIM-528413',
  status: 'En picking',
  totalFormatted: '$125.990',
  currency: 'CLP',
  createdAt: '2026-10-01T12:00:00.000Z',
  items: [{ sku: '12345', name: 'Cemento', quantity: 4 }],
}

describe('orders.api', () => {
  it('lista los pedidos del cliente de la sesión', async () => {
    fetchMock.mockResolvedValue(ok([orderView]))
    const { fetchOrders } = await import('./orders.api')
    const res = await fetchOrders()
    expect(fetchMock.mock.calls[0][0]).toBe('http://bff.test/api/web-bff/orders')
    // Los campos que el front usa existen de verdad en la respuesta.
    expect(res[0].id).toBe('a1b2c3')
    expect(res[0].commerceId).toBe('MIM-528413')
    expect(res[0].status).toBe('En picking')
    expect(res[0].items).toHaveLength(1)
  })

  it('pide el tracking con el id INTERNO de OMS, no con el número de pedido', async () => {
    const tracking: BffOrderTracking = {
      orderId: 'a1b2c3',
      status: 'En picking',
      events: [{ event: 'ORDER_CREATED', at: '2026-10-01T12:00:00.000Z' }],
    }
    fetchMock.mockResolvedValue(ok(tracking))
    const { fetchOrderTracking } = await import('./orders.api')
    const res = await fetchOrderTracking('a1b2c3')
    expect(fetchMock.mock.calls[0][0]).toBe('http://bff.test/api/web-bff/orders/a1b2c3/tracking')
    expect(res.events[0].event).toBe('ORDER_CREATED')
  })

  it('el detalle llega como sobre {order, tracking, documents}', async () => {
    fetchMock.mockResolvedValue(
      ok({ order: orderView, tracking: { orderId: 'a1b2c3', status: 'En picking', events: [] }, documents: [] })
    )
    const { fetchOrder } = await import('./orders.api')
    const res = await fetchOrder('a1b2c3')
    expect(res.order.commerceId).toBe('MIM-528413')
    expect(res.tracking.events).toEqual([])
    expect(res.documents).toEqual([])
  })

  it('la cancelación es una SOLICITUD: el estado resultante lo decide OMS', async () => {
    fetchMock.mockResolvedValue(ok({ ...orderView, status: 'Cancelacion solicitada' }))
    const { requestOrderCancellation } = await import('./orders.api')
    const res = await requestOrderCancellation('a1b2c3', 'me arrepentí')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://bff.test/api/web-bff/orders/a1b2c3/cancel-request')
    expect((init as RequestInit).method).toBe('POST')
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({ reason: 'me arrepentí' })
    expect(res.status).toBe('Cancelacion solicitada')
  })
})
