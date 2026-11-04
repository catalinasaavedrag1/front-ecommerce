import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Lo que se protege acá es la regla más importante del checkout: un handoff
 * fallido NO es una compra.
 *
 * Antes `confirmCheckout` hacía `catch { return null }`, y la pantalla trataba
 * ese `null` igual que el modo maqueta: vaciaba el carro y anunciaba "Tu
 * compra fue confirmada" con un número de pedido inventado, sin que existiera
 * nada downstream. `null` debe significar una sola cosa: no hay BFF con el que
 * hacer handoff.
 */

vi.mock('@/lib/env', () => ({
  BFF_BASE_URL: 'http://bff.test/api/web-bff',
  BFF_TIMEOUT_MS: 1000,
  CURRENCY: 'CLP',
  LOCALE: 'es-CL',
  isBffEnabled: () => true,
}))

const getCartId = vi.fn<() => string | null>(() => 'cart-1')
vi.mock('@/lib/session', () => ({
  getCartId: () => getCartId(),
  setCartId: vi.fn(),
  sessionId: () => '',
}))

const fetchMock = vi.fn()

beforeEach(() => {
  getCartId.mockReturnValue('cart-1')
  fetchMock.mockReset()
  vi.stubGlobal('fetch', fetchMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function jsonResponse(body: unknown, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response
}

describe('confirmCheckout', () => {
  it('devuelve el handoff del BFF cuando la operación resulta', async () => {
    const handoff = {
      cartId: 'cart-1',
      snapshotId: 'snap-abcd1234',
      lockId: 'lock-1',
      status: 'LOCKED',
      expiresAt: '2026-01-01T00:00:00.000Z',
    }
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: handoff }))
    const { confirmCheckout } = await import('./checkout.api')
    await expect(confirmCheckout({ method: 'DELIVERY', commune: 'Maipú' })).resolves.toEqual(handoff)
  })

  it('PROPAGA el error del BFF en vez de devolver null', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse({ success: false, code: 'STOCK_UNAVAILABLE', message: 'Sin stock' }, 409)
    )
    const { confirmCheckout } = await import('./checkout.api')
    await expect(confirmCheckout({ method: 'PICKUP' })).rejects.toMatchObject({
      code: 'STOCK_UNAVAILABLE',
    })
  })

  it('PROPAGA también los errores de red', async () => {
    fetchMock.mockRejectedValue(new Error('econnrefused'))
    const { confirmCheckout } = await import('./checkout.api')
    await expect(confirmCheckout({ method: 'DELIVERY' })).rejects.toMatchObject({
      code: 'NETWORK_ERROR',
    })
  })

  it('devuelve null sólo cuando no hay carrito en el BFF (modo maqueta)', async () => {
    getCartId.mockReturnValue(null)
    const { confirmCheckout } = await import('./checkout.api')
    await expect(confirmCheckout({ method: 'DELIVERY' })).resolves.toBeNull()
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('manda el método de cumplimiento que eligió el cliente', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ success: true, data: { snapshotId: 's' } }))
    const { confirmCheckout } = await import('./checkout.api')
    await confirmCheckout({ method: 'PICKUP', storeId: 'ST-1' })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('http://bff.test/api/web-bff/checkout/cart-1/confirm')
    expect(JSON.parse((init as RequestInit).body as string)).toMatchObject({
      fulfillmentMethod: 'PICKUP',
      storeId: 'ST-1',
    })
  })
})
