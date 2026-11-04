import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Entrega y cumplimiento. El punto de estas pruebas es que son DOS formas
 * distintas y el front las tenía mezcladas en un solo tipo:
 *
 *   POST /delivery/options              -> DeliveryOptionView  (delivery-service)
 *   POST /checkout/:cartId/delivery-options -> FulfillmentOptionView (cart-service)
 *
 * dom-service no aparece: no expone opciones al shopper, y la asignación de
 * bodega la decide él en el checkout, no el navegador.
 */

vi.mock('@/lib/env', () => ({
  BFF_BASE_URL: 'http://bff.test/api/web-bff',
  BFF_TIMEOUT_MS: 1000,
  CURRENCY: 'CLP',
  LOCALE: 'es-CL',
  isBffEnabled: () => true,
}))
vi.mock('@/lib/session', () => ({ getCartId: () => 'cart-1', setCartId: vi.fn(), sessionId: () => '' }))

const fetchMock = vi.fn()
beforeEach(() => {
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})
afterEach(() => vi.unstubAllGlobals())

const ok = (data: unknown) =>
  ({ ok: true, status: 200, json: async () => ({ success: true, data }) }) as unknown as Response

describe('/delivery/options (delivery-service)', () => {
  it('manda sólo los campos que el DTO del BFF acepta', async () => {
    fetchMock.mockResolvedValue(ok([]))
    const { fetchDeliveryOptions } = await import('./delivery.api')
    await fetchDeliveryOptions({ commune: 'Maipú', skus: ['12345'] })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://bff.test/api/web-bff/delivery/options')
    expect(JSON.parse((init as RequestInit).body as string)).toEqual({
      commune: 'Maipú',
      skus: ['12345'],
    })
  })

  it('devuelve transportistas con id y costo ya formateado', async () => {
    fetchMock.mockResolvedValue(
      ok([{ id: 'CARRIER-1', type: 'delivery', label: 'Flota propia', costFormatted: 'Gratis', eta: '24-48 h' }])
    )
    const { fetchDeliveryOptions } = await import('./delivery.api')
    const res = await fetchDeliveryOptions({ commune: 'Maipú' })
    expect(res[0].id).toBe('CARRIER-1')
    expect(res[0].costFormatted).toBe('Gratis')
  })

  it('quote devuelve una LISTA, no un costo único', async () => {
    fetchMock.mockResolvedValue(ok([{ id: 'C1', type: 'delivery', label: 'X', costFormatted: '$3.990' }]))
    const { quoteDelivery } = await import('./delivery.api')
    const res = await quoteDelivery({ commune: 'Concepción' })
    expect(Array.isArray(res)).toBe(true)
  })

  it('pickup-locations es un stub: hoy siempre llega vacío', async () => {
    fetchMock.mockResolvedValue(ok([]))
    const { fetchPickupLocations } = await import('./delivery.api')
    await expect(fetchPickupLocations('Maipú')).resolves.toEqual([])
  })
})

describe('/checkout/:cartId/delivery-options (cart-service)', () => {
  it('trae la promesa de entrega por método', async () => {
    fetchMock.mockResolvedValue(
      ok([
        { method: 'DELIVERY', label: 'Despacho a domicilio', costFormatted: '$3.990', promise: 'Llega entre el 6 y el 8 de noviembre', commune: 'Maipú' },
        { method: 'PICKUP', label: 'Retiro en tienda', costFormatted: 'Gratis', promise: 'Listo hoy desde las 18:00', storeId: 'ST-1' },
      ])
    )
    const { getDeliveryOptions } = await import('./checkout.api')
    const res = await getDeliveryOptions('cart-1', { commune: 'Maipú' })
    expect(fetchMock.mock.calls[0][0]).toBe('http://bff.test/api/web-bff/checkout/cart-1/delivery-options')
    expect(res.find((o) => o.method === 'DELIVERY')?.promise).toMatch(/noviembre/)
    expect(res.find((o) => o.method === 'PICKUP')?.storeId).toBe('ST-1')
  })

  it('los medios de pago siguen siendo un stub vacío', async () => {
    fetchMock.mockResolvedValue(ok([]))
    const { getPaymentMethods } = await import('./checkout.api')
    await expect(getPaymentMethods('cart-1')).resolves.toEqual([])
  })
})
