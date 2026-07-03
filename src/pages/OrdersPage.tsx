import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import type { OrderRecord } from '@/types'
import { useBffOrders } from '@/hooks/useBffOrders'
import { formatCLP } from '@/utils/format'
import Icon from '@/components/Icon'

const statusLabel: Record<OrderRecord['status'], string> = {
  preparando: 'Preparando',
  despachado: 'Despachado',
  entregado: 'Entregado',
}

export default function OrdersPage() {
  const { customer, mode } = useApp()
  // Con BFF vivo (y sesión) los pedidos vienen del BFF; si no, datos de ejemplo.
  const { data, live } = useBffOrders(mode)
  // En maqueta sin sesión, filtra por el modo activo; con datos vivos, todos son del cliente.
  const orders = live || customer ? data : data.filter((o) => o.mode === mode)

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
              <span className={`status status--${o.status}`}>{o.statusLabel ?? statusLabel[o.status]}</span>
            </div>
            <div className="ordercard__meta">
              <span><Icon name="calendar" /> {o.date}</span>
              <span><Icon name="box" /> {o.items} productos</span>
              <span className={`pill pill--${o.mode}`}>
                {o.mode === 'b2b' ? 'Empresa' : 'Persona'}
              </span>
            </div>
            <div className="ordercard__foot">
              <span className="ordercard__total">{o.totalLabel ?? formatCLP(o.total)}</span>
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
