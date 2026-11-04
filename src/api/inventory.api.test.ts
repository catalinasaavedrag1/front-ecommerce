import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

/**
 * Cliente de disponibilidad por SKU (inventory-service-v3 vía BFF). El lote va
 * por fan-out, igual que lo hace el BFF contra inventory, y es fail-open por
 * SKU: uno que falla no deja la grilla sin datos.
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

describe('fetchAvailability', () => {
  it('pide la ruta del BFF con el SKU escapado', async () => {
    fetchMock.mockResolvedValue(ok({ available: true, status: 'in_stock', label: 'Disponible' }))
    const { fetchAvailability } = await import('./inventory.api')
    await fetchAvailability('SKU/01')
    expect(fetchMock.mock.calls[0][0]).toBe('http://bff.test/api/web-bff/products/SKU%2F01/availability')
  })

  it('devuelve la etiqueta cualitativa tal cual, sin cantidades', async () => {
    const view = { available: true, status: 'low_stock', label: 'Disponible', quantityLabel: 'Ultimas unidades' }
    fetchMock.mockResolvedValue(ok(view))
    const { fetchAvailability } = await import('./inventory.api')
    await expect(fetchAvailability('12345')).resolves.toEqual(view)
  })
})

describe('fetchAvailabilityBatch', () => {
  it('deduplica los SKUs antes de pedir', async () => {
    fetchMock.mockResolvedValue(ok({ available: true, status: 'in_stock', label: 'Disponible' }))
    const { fetchAvailabilityBatch } = await import('./inventory.api')
    await fetchAvailabilityBatch(['A', 'A', 'B', ''])
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('es fail-open por SKU: devuelve los que respondieron', async () => {
    fetchMock
      .mockResolvedValueOnce(ok({ available: true, status: 'in_stock', label: 'Disponible' }))
      .mockRejectedValueOnce(new Error('caído'))
    const { fetchAvailabilityBatch } = await import('./inventory.api')
    const res = await fetchAvailabilityBatch(['A', 'B'])
    expect(Object.keys(res)).toEqual(['A'])
  })
})
