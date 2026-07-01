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

/** Atributo más relevante para mostrar en la card (comparación rápida). */
export function keySpec(p: Product): string | undefined {
  const priority = ['Potencia', 'Voltaje', 'Capacidad', 'Rendimiento', 'Contenido', 'Medida', 'Formato', 'Sección', 'Largo', 'Material', 'Peso', 'Espesor']
  for (const k of priority) {
    if (p.specs[k]) return `${k}: ${p.specs[k]}`
  }
  return undefined
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

export type WarehouseState = 'full' | 'partial' | 'restock' | 'none'

export interface WarehouseRow {
  name: string
  qty: number
  state: WarehouseState
  label: string
}

export interface StockReport {
  rows: WarehouseRow[]
  total: number
  overall: WarehouseState
  overallLabel: string
}

const CD_NAME = 'CD Santiago'

/** Disponibilidad por bodega frente a una cantidad solicitada, con estados claros
 *  (completo / parcial / con reposición / sin stock) para el cliente B2B. */
export function warehouseStock(p: Product, requested = 1): StockReport {
  const entries = Object.entries(p.stockByWarehouse)
  const rows: WarehouseRow[] = entries.map(([name, qty]) => {
    const isCD = name === CD_NAME
    let state: WarehouseState
    let label: string
    if (qty <= 0) {
      state = 'none'; label = 'Sin stock'
    } else if (qty >= requested) {
      state = isCD ? 'restock' : 'full'
      label = isCD ? `${qty} u. · despacho 24-48 h` : `${qty} u. disponibles hoy`
    } else {
      state = 'partial'; label = `${qty} u. (parcial)`
    }
    return { name, qty, state, label }
  })
  const total = entries.reduce((s, [, q]) => s + q, 0)
  const hoy = rows.filter((r) => r.name !== CD_NAME).reduce((s, r) => s + r.qty, 0)
  let overall: WarehouseState
  let overallLabel: string
  if (total <= 0) { overall = 'none'; overallLabel = 'Sin stock' }
  else if (hoy >= requested) { overall = 'full'; overallLabel = 'Disponible completo hoy' }
  else if (total >= requested) { overall = 'restock'; overallLabel = 'Disponible con reposición' }
  else { overall = 'partial'; overallLabel = 'Disponible parcial' }
  return { rows, total, overall, overallLabel }
}
