import type { Product } from '@/types'

/** Comunas de despacho (demo, solo front): plazo en días hábiles y costo base CLP. */
export interface Comuna {
  name: string
  zone: string
  days: number
  cost: number
  coverage: boolean
}

export const comunas: Comuna[] = [
  { name: 'Santiago Centro', zone: 'Región Metropolitana', days: 1, cost: 3990, coverage: true },
  { name: 'Providencia', zone: 'Región Metropolitana', days: 1, cost: 3990, coverage: true },
  { name: 'Ñuñoa', zone: 'Región Metropolitana', days: 1, cost: 3990, coverage: true },
  { name: 'Las Condes', zone: 'Región Metropolitana', days: 1, cost: 4490, coverage: true },
  { name: 'Maipú', zone: 'Región Metropolitana', days: 2, cost: 4990, coverage: true },
  { name: 'La Florida', zone: 'Región Metropolitana', days: 2, cost: 4990, coverage: true },
  { name: 'Puente Alto', zone: 'Región Metropolitana', days: 2, cost: 5490, coverage: true },
  { name: 'Colina', zone: 'Región Metropolitana', days: 2, cost: 5990, coverage: true },
  { name: 'Valparaíso', zone: 'Valparaíso', days: 3, cost: 7990, coverage: true },
  { name: 'Viña del Mar', zone: 'Valparaíso', days: 3, cost: 7990, coverage: true },
  { name: 'Rancagua', zone: "O'Higgins", days: 3, cost: 7490, coverage: true },
  { name: 'Talca', zone: 'Maule', days: 4, cost: 8990, coverage: true },
  { name: 'Concepción', zone: 'Biobío', days: 4, cost: 9990, coverage: true },
  { name: 'La Serena', zone: 'Coquimbo', days: 4, cost: 11990, coverage: true },
  { name: 'Temuco', zone: 'Araucanía', days: 5, cost: 12990, coverage: true },
  { name: 'Antofagasta', zone: 'Antofagasta', days: 5, cost: 14990, coverage: true },
  { name: 'Puerto Montt', zone: 'Los Lagos', days: 6, cost: 15990, coverage: true },
  { name: 'Isla de Pascua', zone: 'Valparaíso', days: 0, cost: 0, coverage: false },
]

export const DEFAULT_COMUNA = 'Santiago Centro'

export function getComuna(name: string): Comuna {
  return comunas.find((c) => c.name === name) ?? comunas[0]
}

export interface DeliveryInfo {
  comuna: string
  coverage: boolean
  days: number
  cost: number
  free: boolean
}

/** Calcula plazo y costo de despacho de un producto a una comuna.
 *  Productos voluminosos (bulky) recargan; freeShipping despacha gratis con cobertura. */
export function deliveryInfo(comunaName: string, product?: Product): DeliveryInfo {
  const c = getComuna(comunaName)
  if (!c.coverage) return { comuna: c.name, coverage: false, days: 0, cost: 0, free: false }
  const free = Boolean(product?.freeShipping)
  const surcharge = product?.bulky ? Math.round(c.cost * 0.6) : 0
  return { comuna: c.name, coverage: true, days: c.days, cost: free ? 0 : c.cost + surcharge, free }
}

export function etaLabel(days: number): string {
  if (days <= 1) return 'Llega mañana'
  return `Llega en ${days} días hábiles`
}
