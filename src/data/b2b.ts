/** Datos demo del portal empresa (B2B): vendedor asignado, cotizaciones,
 *  aprobaciones, pedidos en curso y próximo despacho. Alimentan el panel de inicio. */

export interface SalesRep {
  name: string
  role: string
  email: string
  phone: string
  whatsapp: string
}

export const salesRep: SalesRep = {
  name: 'María González',
  role: 'Ejecutiva de cuenta',
  email: 'maria.gonzalez@mimbral.cl',
  phone: '+56 2 2555 0100',
  whatsapp: '56955550100',
}

export type QuoteStatus = 'borrador' | 'enviada' | 'en_revision' | 'respondida' | 'aceptada' | 'vencida'

export interface OpenQuote {
  id: string
  title: string
  date: string
  status: QuoteStatus
  netTotal: number
}

export const openQuotes: OpenQuote[] = [
  { id: 'COT-10293', title: 'Obra Mall Talca', date: '2026-06-28', status: 'en_revision', netTotal: 3450000 },
  { id: 'COT-10281', title: 'Reposición bodega central', date: '2026-06-25', status: 'respondida', netTotal: 1290000 },
  { id: 'COT-10270', title: 'Terminaciones Linares', date: '2026-06-20', status: 'enviada', netTotal: 780000 },
]

export type B2BOrderStatus = 'preparando' | 'listo_retiro' | 'despachado' | 'entregado'

export interface B2BOrder {
  id: string
  date: string
  status: B2BOrderStatus
  total: number
  obra?: string
  oc?: string
  eta?: string
}

export const b2bOrders: B2BOrder[] = [
  { id: 'PED-12346', date: '2026-06-30', status: 'preparando', total: 850000, obra: 'Obra Mall Talca', oc: 'OC-8891', eta: 'Vie 04, 10:00–13:00' },
  { id: 'PED-12345', date: '2026-06-29', status: 'listo_retiro', total: 389900, obra: 'Retiro Balmaceda', oc: 'OC-8875', eta: 'Disponible hoy' },
  { id: 'PED-12344', date: '2026-06-27', status: 'despachado', total: 1284500, obra: 'Obra Linares', oc: 'OC-8860', eta: 'En ruta · hoy' },
  { id: 'PED-12340', date: '2026-06-18', status: 'entregado', total: 640000, obra: 'Bodega central', oc: 'OC-8802' },
]

export interface Approval {
  id: string
  requester: string
  amount: number
  obra: string
  reason: string
}

export const pendingApprovals: Approval[] = [
  { id: 'PED-12347', requester: 'Juan Pérez', amount: 1200000, obra: 'Obra Mall Talca', reason: 'Supera el límite de $500.000' },
]

export interface NextDispatch {
  orderId: string
  date: string
  window: string
  place: string
}

export const nextDispatch: NextDispatch = {
  orderId: 'PED-12346',
  date: '2026-07-03',
  window: '10:00 – 13:00',
  place: 'Obra Mall Talca',
}
