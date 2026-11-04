import { useEffect, useState } from 'react'
import type { OrderRecord, SalesMode } from '@/types'
import { isBffEnabled } from '@/api/web-bff.client'
import { fetchOrders } from '@/api/orders.api'
import type { BffOrderSummary } from '@/api/types'
import { sampleOrders } from '@/data/account'

/**
 * Pedidos con degradación elegante. Requiere sesión (token): sin token el BFF
 * responde 401 y el hook cae a los pedidos de ejemplo.
 */

/**
 * Estado de OMS → enum del front (sólo para la clase CSS del badge).
 *
 * Los estados de OMS viven en su tabla `order_status`, no en un enum fijo
 * (`oms-service/src/models/orderStatus.Models.js`), así que el front NO puede
 * tener un mapa cerrado: se reconocen por palabra clave y todo lo demás cae en
 * "preparando". El texto que se MUESTRA es el de OMS, sin traducir.
 */
function toStatus(status: string): OrderRecord['status'] {
  const s = status.toLowerCase()
  if (s.includes('entreg')) return 'entregado'
  if (s.includes('despach') || s.includes('transito') || s.includes('tránsito') || s.includes('camino') || s.includes('ruta')) return 'despachado'
  return 'preparando'
}

/**
 * BffOrderSummary → OrderRecord.
 *
 * `id` es el id interno de OMS (el que usan `/orders/:orderId/...`) y
 * `commerceId` es el número que ve el cliente: se muestra ese. `total` queda
 * en 0 a propósito — el BFF entrega el monto ya formateado en su moneda y
 * `totalLabel` es lo que se pinta; no se reconstruye el número.
 */
function summaryToRecord(o: BffOrderSummary, mode: SalesMode): OrderRecord {
  return {
    id: o.commerceId || o.id,
    date: (o.createdAt ?? '').slice(0, 10),
    mode,
    total: 0,
    totalLabel: o.totalFormatted,
    status: toStatus(o.status ?? ''),
    statusLabel: o.status,
    items: o.items?.length ?? 0,
    omsId: o.id,
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
