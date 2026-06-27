import type { OrderRecord } from '@/types'

export interface FrequentList {
  id: string
  name: string
  productIds: string[]
}

/** Listas de compra frecuentes (B2B): reposición rápida de productos recurrentes. */
export const frequentLists: FrequentList[] = [
  { id: 'fl-1', name: 'Obra gruesa', productIds: ['p-001', 'p-002', 'p-003', 'p-005', 'p-011'] },
  { id: 'fl-2', name: 'Terminaciones', productIds: ['p-016', 'p-017', 'p-018', 'p-037', 'p-038'] },
  { id: 'fl-3', name: 'Mantención y EPP', productIds: ['p-012', 'p-013', 'p-014', 'p-024'] },
]

export const sampleOrders: OrderRecord[] = [
  { id: 'MIM-528413', date: '2026-06-18', mode: 'b2b', total: 1284500, status: 'despachado', items: 12 },
  { id: 'MIM-517702', date: '2026-06-02', mode: 'b2b', total: 389900, status: 'entregado', items: 5 },
  { id: 'MIM-490031', date: '2026-05-21', mode: 'b2c', total: 64990, status: 'entregado', items: 1 },
]

/** Productos comprados con frecuencia (para "Volver a comprar"). */
export const frequentProductIds = ['p-001', 'p-011', 'p-016', 'p-022', 'p-013']
