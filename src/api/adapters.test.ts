import { describe, expect, it } from 'vitest'
import { cardToProduct, detailToProduct } from './adapters'
import type { BffAvailability, BffProductCard, BffProductDetail } from './types'

/**
 * El adaptador es la frontera donde el front traduce lo que el BFF entrega.
 * Lo que se protege acá es que NO invente inventario: inventory-service le da
 * al BFF `availableStock` y el BFF publica una etiqueta cualitativa a
 * propósito, sin unidades.
 */

const availability = (over: Partial<BffAvailability> = {}): BffAvailability => ({
  available: true,
  status: 'in_stock',
  label: 'Disponible',
  ...over,
})

const card = (over: Partial<BffProductCard> = {}): BffProductCard =>
  ({
    sku: '12345',
    name: 'Cemento Especial 25 kg',
    brand: 'Melón',
    available: true,
    availability: availability(),
    price: { amount: 5990, listAmount: 5990, hasDiscount: false },
    promotions: { badges: [], labels: [] },
    ...over,
  }) as BffProductCard

const detail = (over: Partial<BffProductDetail> = {}): BffProductDetail =>
  ({
    sku: '12345',
    slug: 'cemento-especial-25-kg',
    title: 'Cemento Especial 25 kg',
    url: '/producto/cemento-especial-25-kg',
    images: [],
    specs: [],
    price: { amount: 5990, listAmount: 5990, hasDiscount: false },
    available: true,
    availability: availability(),
    promotions: { badges: [], labels: [] },
    ...over,
  }) as BffProductDetail

describe('cardToProduct / detailToProduct — disponibilidad', () => {
  it('traspasa la disponibilidad del BFF sin modificarla', () => {
    const a = availability({ status: 'low_stock', quantityLabel: 'Ultimas unidades' })
    expect(cardToProduct(card({ availability: a })).availability).toEqual(a)
    expect(detailToProduct(detail({ availability: a })).availability).toEqual(a)
  })

  it('no publica desglose por bodega: el BFF no lo entrega al navegador', () => {
    expect(cardToProduct(card()).stockByWarehouse).toEqual({})
    expect(detailToProduct(detail()).stockByWarehouse).toEqual({})
  })

  it('deja stock en 0 cuando el SKU no es vendible', () => {
    const agotado = availability({ available: false, status: 'out_of_stock', label: 'No disponible' })
    expect(cardToProduct(card({ availability: agotado, available: false })).stock).toBe(0)
    expect(detailToProduct(detail({ availability: agotado, available: false })).stock).toBe(0)
  })

  it('no distingue "in_stock" de "low_stock" con un número: ambos dan el mismo tope', () => {
    // Antes devolvía 50 y 10 respectivamente, y la ficha los imprimía como si
    // fueran unidades reales ("50 unidades disponibles").
    const alto = cardToProduct(card({ availability: availability({ status: 'in_stock' }) })).stock
    const bajo = cardToProduct(card({ availability: availability({ status: 'low_stock' }) })).stock
    expect(alto).toBe(bajo)
    expect(alto).toBeGreaterThan(0)
  })

  it('respeta `available: false` aunque la etiqueta diga lo contrario', () => {
    const p = detailToProduct(detail({ available: false, availability: availability() }))
    expect(p.stock).toBe(0)
  })
})
