import type { Product, StockLevel } from '@/types'

export function stockLevel(p: Product): StockLevel {
  if (p.stock <= 0) return 'sin'
  if (p.stock < 30) return 'bajo'
  return 'alto'
}

export interface Badge {
  label: string
  kind: 'offer' | 'hot' | 'b2b' | 'fast' | 'pickup' | 'low' | 'season' | 'eco' | 'quote'
}

/** Calcula los badges comerciales a mostrar en una card de producto. */
export function badgesFor(p: Product, opts?: { mode?: 'b2c' | 'b2b' }): Badge[] {
  const out: Badge[] = []
  if (p.retailOffer) out.push({ label: 'Oferta', kind: 'offer' })
  if (p.tags?.includes('Más vendido')) out.push({ label: 'Más vendido', kind: 'hot' })
  if (p.tags?.includes('Temporada')) out.push({ label: 'Temporada', kind: 'season' })
  if (p.tags?.includes('Eco')) out.push({ label: 'Eco', kind: 'eco' })
  if (opts?.mode === 'b2b' && p.volumeTiers?.length) out.push({ label: 'Por volumen', kind: 'b2b' })
  const level = stockLevel(p)
  if (level === 'bajo') out.push({ label: 'Bajo stock', kind: 'low' })
  if (p.requiresQuote) out.push({ label: 'Bajo cotización', kind: 'quote' })
  return out.slice(0, 3)
}

export interface Availability {
  pickupToday: boolean
  delivery: boolean
  fast: boolean
  label: string
}

export function availabilityFor(p: Product): Availability {
  const level = stockLevel(p)
  const anyStoreStock = Object.values(p.stockByWarehouse).some((n) => n > 0)
  const pickupToday = !p.onlineOnly && anyStoreStock && level !== 'sin'
  const delivery = !p.storeOnly && level !== 'sin'
  const fast = Boolean(p.freeShipping) || level === 'alto'
  let label = 'Sin stock'
  if (level === 'alto') label = 'En stock'
  else if (level === 'bajo') label = `Últimas ${p.stock} unidades`
  return { pickupToday, delivery, fast, label }
}
