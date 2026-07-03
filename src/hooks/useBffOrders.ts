import { useEffect, useState } from 'react'
import type { OrderRecord, SalesMode } from '@/types'
import { isBffEnabled } from '@/api/web-bff.client'
import { fetchOrders } from '@/api/orders.api'
import type { BffOrderSummary } from '@/api/types'
import { sampleOrders } from '@/data/account'

/**
 * Pedidos con degradación elegante. Requiere sesión (token): mientras el front
 * no tenga login real (ver docs/CONTRATOS-BFF.md gap #1), el BFF responde 401 y
 * el hook cae a los pedidos de ejemplo. Queda cableado y se activa solo cuando
 * exista emisión de token.
 */

/** Mapea el estado libre del BFF al enum del front (para la clase CSS). */
function toStatus(label: string): OrderRecord['status'] {
  const s = label.toLowerCase()
  if (s.includes('entreg')) return 'entregado'
  if (s.includes('despach') || s.includes('transito') || s.includes('camino') || s.includes('ruta')) return 'despachado'
  return 'preparando'
}

/** BffOrderSummary → OrderRecord (el label del BFF manda sobre los locales). */
function summaryToRecord(o: BffOrderSummary, mode: SalesMode): OrderRecord {
  return {
    id: o.orderId,
    date: (o.createdAt ?? '').slice(0, 10),
    mode,
    total: 0,
    totalLabel: o.totalFormatted,
    status: toStatus(o.statusLabel ?? ''),
    statusLabel: o.statusLabel,
    items: o.itemCount ?? 0,
  }
}

interface OrdersResult {
  data: OrderRecord[]
  live: boolean
  loading: boolean
}

export function useBffOrders(mode: SalesMode): OrdersResult {
  const [state, setState] = useState<OrdersResult>({ data: sampleOrders, live: false, loading: isBffEnabled() })
  useEffect(() => {
    if (!isBffEnabled()) {
      setState({ data: sampleOrders, live: false, loading: false })
      return
    }
    let cancelled = false
    setState((s) => ({ ...s, loading: true }))
    fetchOrders()
      .then((orders) => {
        if (cancelled) return
        const mapped = orders.map((o) => summaryToRecord(o, mode))
        setState({ data: mapped.length ? mapped : sampleOrders, live: mapped.length > 0, loading: false })
      })
      .catch(() => {
        if (!cancelled) setState({ data: sampleOrders, live: false, loading: false })
      })
    return () => {
      cancelled = true
    }
  }, [mode])
  return state
}
