import { describe, expect, it } from 'vitest'
import { availabilityFor, stockLevel, warehouseStock } from './catalog'
import type { Product, ProductAvailability } from '@/types'

/**
 * Reglas de presentación de disponibilidad. El punto: cuando el producto trae
 * `availability` (viene del BFF), manda ese dato y NO se deducen cantidades
 * ni se lee el desglose por bodega, que el BFF no publica al navegador.
 */

function producto(over: Partial<Product> = {}): Product {
  return {
    id: '12345',
    sku: '12345',
    name: 'Cemento',
    brand: 'Melón',
    categoryId: 'c1',
    retailPrice: 5990,
    b2bNet: 5034,
    unit: 'un',
    rating: 0,
    reviews: 0,
    stock: 30,
    stockByWarehouse: {},
    description: '',
    specs: {},
    ...over,
  } as Product
}

const disp = (over: Partial<ProductAvailability> = {}): ProductAvailability => ({
  available: true,
  status: 'in_stock',
  label: 'Disponible',
  ...over,
})

describe('stockLevel', () => {
  it('con availability del BFF, el estado manda sobre el número', () => {
    // `stock` 30 daría nivel "alto" por el camino de maqueta; el BFF dice que
    // quedan pocas, y eso es lo que se respeta.
    expect(stockLevel(producto({ stock: 30, availability: disp({ status: 'low_stock' }) }))).toBe('bajo')
    expect(stockLevel(producto({ stock: 30, availability: disp({ status: 'in_stock' }) }))).toBe('alto')
  })

  it('out_of_stock es "sin" aunque el stock heredado sea positivo', () => {
    const p = producto({ stock: 30, availability: disp({ available: false, status: 'out_of_stock' }) })
    expect(stockLevel(p)).toBe('sin')
  })

  it('sin availability usa el stock del catálogo de maqueta', () => {
    expect(stockLevel(producto({ stock: 0 }))).toBe('sin')
    expect(stockLevel(producto({ stock: 5 }))).toBe('bajo')
    expect(stockLevel(producto({ stock: 80 }))).toBe('alto')
  })
})

describe('availabilityFor', () => {
  it('usa el texto del BFF y nunca arma uno con cantidades', () => {
    const p = producto({ availability: disp({ status: 'low_stock', quantityLabel: 'Ultimas unidades' }) })
    expect(availabilityFor(p).label).toBe('Ultimas unidades')
    expect(availabilityFor(p).label).not.toMatch(/\d/)
  })

  it('no afirma retiro hoy sin desglose por bodega', () => {
    // El BFF no entrega stock por bodega, así que no hay con qué afirmar que
    // hay unidades EN SALA. Lo confirma el checkout contra DOM.
    const p = producto({ availability: disp(), stockByWarehouse: {} })
    expect(availabilityFor(p).pickupToday).toBe(false)
    expect(availabilityFor(p).delivery).toBe(true)
  })

  it('sí afirma retiro hoy cuando hay desglose con stock en tienda', () => {
    const p = producto({ stock: 12, stockByWarehouse: { 'Tienda Balmaceda': 4 } })
    expect(availabilityFor(p).pickupToday).toBe(true)
  })
})

describe('warehouseStock', () => {
  it('marca known=false y no reporta "Sin stock" cuando falta el desglose', () => {
    // Antes leía un mapa vacío y devolvía total 0 / "Sin stock", así que la
    // ficha mostraba a la vez "unidades disponibles" y "Sin stock".
    const p = producto({ availability: disp({ label: 'Disponible' }) })
    const r = warehouseStock(p, 5)
    expect(r.known).toBe(false)
    expect(r.rows).toEqual([])
    expect(r.overallLabel).toBe('Disponible')
    expect(r.overall).toBe('full')
  })

  it('refleja el agotado del BFF cuando no hay desglose', () => {
    const p = producto({ availability: disp({ available: false, status: 'out_of_stock', label: 'No disponible' }) })
    const r = warehouseStock(p, 1)
    expect(r.known).toBe(false)
    expect(r.overall).toBe('none')
    expect(r.overallLabel).toBe('No disponible')
  })

  it('con desglose real calcula los estados por bodega', () => {
    const p = producto({ stock: 20, stockByWarehouse: { 'Tienda Balmaceda': 8, 'CD Santiago': 12 } })
    const r = warehouseStock(p, 5)
    expect(r.known).toBe(true)
    expect(r.total).toBe(20)
    expect(r.overall).toBe('full')
    expect(r.rows).toHaveLength(2)
  })
})
