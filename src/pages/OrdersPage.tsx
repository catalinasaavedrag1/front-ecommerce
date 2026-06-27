import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import type { OrderRecord } from '@/types'
import { formatCLP } from '@/utils/format'

const sampleOrders: OrderRecord[] = [
  { id: 'MIM-528413', date: '2026-06-18', mode: 'b2b', total: 1284500, status: 'despachado', items: 12 },
  { id: 'MIM-517702', date: '2026-06-02', mode: 'b2b', total: 389900, status: 'entregado', items: 5 },
  { id: 'MIM-490031', date: '2026-05-21', mode: 'b2c', total: 64990, status: 'entregado', items: 1 },
]

const statusLabel: Record<OrderRecord['status'], string> = {
  preparando: 'Preparando',
  despachado: 'Despachado',
  entregado: 'Entregado',
}

export default function OrdersPage() {
  const { customer, mode } = useApp()
  const orders = sampleOrders.filter((o) => (customer ? true : o.mode === mode))

  return (
    <div className="container">
      <h1 className="page-title">Mis pedidos</h1>
      {!customer && (
        <p className="lead">
          <Link to="/ingresar">Ingresa</Link> para ver el historial completo de tu cuenta.
        </p>
      )}

      <div className="orders">
        {orders.map((o) => (
          <div key={o.id} className="ordercard">
            <div className="ordercard__head">
              <strong>{o.id}</strong>
              <span className={`status status--${o.status}`}>{statusLabel[o.status]}</span>
            </div>
            <div className="ordercard__meta">
              <span>📅 {o.date}</span>
              <span>📦 {o.items} productos</span>
              <span className={`pill pill--${o.mode}`}>
                {o.mode === 'b2b' ? 'Empresa' : 'Persona'}
              </span>
            </div>
            <div className="ordercard__foot">
              <span className="ordercard__total">{formatCLP(o.total)}</span>
              <div className="ordercard__actions">
                <a href="#detalle" className="link-btn">Ver detalle</a>
                {o.mode === 'b2b' && <a href="#factura" className="link-btn">Descargar factura</a>}
                <a href="#repetir" className="link-btn">Volver a comprar</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
