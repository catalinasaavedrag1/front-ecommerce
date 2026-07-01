import { Link } from 'react-router-dom'
import type { Customer } from '@/types'
import { useCart } from '@/context/CartContext'
import { getProduct } from '@/data/products'
import { frequentLists, frequentProductIds, upcomingInvoice } from '@/data/account'
import { b2bOrders, openQuotes, pendingApprovals, salesRep, nextDispatch, type B2BOrderStatus, type QuoteStatus } from '@/data/b2b'
import { formatCLP } from '@/utils/format'
import ProductImage from './ProductImage'
import Icon, { type IconName } from './Icon'

const ORDER_META: Record<B2BOrderStatus, { label: string; cls: string }> = {
  preparando: { label: 'En preparación', cls: 'prep' },
  listo_retiro: { label: 'Listo para retiro', cls: 'ready' },
  despachado: { label: 'En despacho', cls: 'ship' },
  entregado: { label: 'Entregado', cls: 'done' },
}

const QUOTE_META: Record<QuoteStatus, string> = {
  borrador: 'Borrador',
  enviada: 'Enviada',
  en_revision: 'En revisión',
  respondida: 'Respondida',
  aceptada: 'Aceptada',
  vencida: 'Vencida',
}

const QUICK: { icon: IconName; label: string; to: string }[] = [
  { icon: 'search', label: 'Compra rápida', to: '/buscar' },
  { icon: 'return', label: 'Recomprar', to: '/mis-pedidos' },
  { icon: 'box', label: 'Cargar Excel', to: '/listas' },
  { icon: 'doc', label: 'Nueva cotización', to: '/cotizacion' },
]

function shortDate(iso: string): string {
  return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }).replace('.', '')
}

export default function B2BDashboard({ customer }: { customer: Customer }) {
  const { add } = useCart()

  const creditLine = customer.creditLine ?? 0
  const creditUsed = customer.creditUsed ?? 0
  const creditAvail = Math.max(0, creditLine - creditUsed)
  const usedPct = creditLine ? Math.min(100, (creditUsed / creditLine) * 100) : 0

  const inProgress = b2bOrders.filter((o) => o.status !== 'entregado')
  const readyPickup = b2bOrders.filter((o) => o.status === 'listo_retiro').length

  const due = new Date(upcomingInvoice.dueDate)
  const daysToDue = Math.ceil((due.getTime() - Date.now()) / 86_400_000)
  const invoiceOverdue = daysToDue < 0

  const frequent = frequentProductIds.map(getProduct).filter(Boolean)

  const kpis: { icon: IconName; label: string; value: string; sub?: string; to: string; bar?: number; alert?: boolean }[] = [
    { icon: 'wallet', label: 'Crédito disponible', value: formatCLP(creditAvail), sub: `de ${formatCLP(creditLine)}`, to: '/empresas/credito', bar: usedPct },
    { icon: 'box', label: 'Pedidos en curso', value: String(inProgress.length), sub: `${readyPickup} listo${readyPickup === 1 ? '' : 's'} para retiro`, to: '/mis-pedidos' },
    { icon: 'doc', label: 'Cotizaciones abiertas', value: String(openQuotes.length), sub: 'Ver y aceptar', to: '/cotizacion' },
    { icon: 'calendar', label: invoiceOverdue ? 'Factura vencida' : 'Factura por vencer', value: formatCLP(upcomingInvoice.amount), sub: invoiceOverdue ? `Venció el ${shortDate(upcomingInvoice.dueDate)}` : `Vence en ${daysToDue} día${daysToDue === 1 ? '' : 's'}`, to: '/empresas/credito', alert: true },
    { icon: 'truck', label: 'Próximo despacho', value: shortDate(nextDispatch.date), sub: `${nextDispatch.window} · ${nextDispatch.place}`, to: '/seguimiento' },
  ]

  return (
    <div className="b2bdash">
      {/* Bienvenida + vendedor asignado */}
      <header className="b2bdash__welcome">
        <div className="b2bdash__hi">
          <span className="b2bdash__eyebrow"><Icon name="building" /> Portal Empresas</span>
          <h1>Hola, {customer.company ?? customer.name}</h1>
          <p>Este es el resumen de tu cuenta. Revisa lo pendiente y compra sin perder tiempo.</p>
        </div>
        <aside className="b2bdash__rep">
          <span className="b2bdash__rep-label">Vendedor asignado</span>
          <strong>{salesRep.name}</strong>
          <span className="b2bdash__rep-role">{salesRep.role}</span>
          <div className="b2bdash__rep-actions">
            <a href={`https://wa.me/${salesRep.whatsapp}`} target="_blank" rel="noopener noreferrer" className="btn btn--ghost"><Icon name="whatsapp" /> WhatsApp</a>
            <a href={`mailto:${salesRep.email}`} className="btn btn--ghost"><Icon name="mail" /> Correo</a>
          </div>
        </aside>
      </header>

      {/* KPIs */}
      <div className="b2bdash__kpis">
        {kpis.map((k) => (
          <Link key={k.label} to={k.to} className={`kpicard ${k.alert ? 'kpicard--alert' : ''}`}>
            <span className="kpicard__ic"><Icon name={k.icon} /></span>
            <span className="kpicard__label">{k.label}</span>
            <strong className="kpicard__value">{k.value}</strong>
            {typeof k.bar === 'number' && <span className="kpicard__bar"><span style={{ width: `${k.bar}%` }} /></span>}
            {k.sub && <span className="kpicard__sub">{k.sub}</span>}
          </Link>
        ))}
      </div>

      {/* Accesos rápidos */}
      <div className="b2bdash__quick">
        {QUICK.map((q) => (
          <Link key={q.label} to={q.to} className="quickbtn">
            <span className="quickbtn__ic"><Icon name={q.icon} /></span>
            {q.label}
          </Link>
        ))}
      </div>

      {/* Aprobaciones pendientes */}
      {pendingApprovals.length > 0 && (
        <section className="b2bdash__approvals" role="status">
          <div className="b2bdash__approvals-head">
            <span className="b2bdash__approvals-ic"><Icon name="shield" /></span>
            <div>
              <strong>{pendingApprovals.length} aprobación{pendingApprovals.length === 1 ? '' : 'es'} pendiente{pendingApprovals.length === 1 ? '' : 's'}</strong>
              <span>Pedidos que superan el límite y esperan tu revisión.</span>
            </div>
          </div>
          <ul>
            {pendingApprovals.map((a) => (
              <li key={a.id}>
                <div>
                  <strong>{a.id} · {formatCLP(a.amount)}</strong>
                  <span>{a.requester} · {a.obra} — {a.reason}</span>
                </div>
                <div className="b2bdash__approvals-btns">
                  <button className="btn btn--primary">Aprobar</button>
                  <button className="btn btn--ghost">Rechazar</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Pedidos en curso + Cotizaciones */}
      <div className="b2bdash__cols">
        <section className="b2bpanel">
          <div className="b2bpanel__head">
            <h2>Pedidos en curso</h2>
            <Link to="/mis-pedidos" className="row__more">Ver todos</Link>
          </div>
          <ul className="b2blist">
            {inProgress.map((o) => (
              <li key={o.id}>
                <div className="b2blist__main">
                  <strong>{o.id}</strong>
                  <span>{o.obra} · {o.oc}</span>
                </div>
                <div className="b2blist__meta">
                  <span className={`ostatus ostatus--${ORDER_META[o.status].cls}`}>{ORDER_META[o.status].label}</span>
                  <small>{o.eta}</small>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="b2bpanel">
          <div className="b2bpanel__head">
            <h2>Cotizaciones abiertas</h2>
            <Link to="/cotizacion" className="row__more">Ver todas</Link>
          </div>
          <ul className="b2blist">
            {openQuotes.map((q) => (
              <li key={q.id}>
                <div className="b2blist__main">
                  <strong>{q.id}</strong>
                  <span>{q.title} · {shortDate(q.date)}</span>
                </div>
                <div className="b2blist__meta">
                  <span className={`qstatus qstatus--${q.status}`}>{QUOTE_META[q.status]}</span>
                  <small>{formatCLP(q.netTotal)} neto</small>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Productos frecuentes */}
      <section className="row">
        <div className="row__head">
          <h2 className="section-title">Tus productos frecuentes</h2>
          <Link to="/listas" className="row__more">Ver listas</Link>
        </div>
        <div className="reorder">
          {frequent.map((p) => p && (
            <div key={p.id} className="reorder__item">
              <Link to={`/producto/${p.id}`} className="reorder__media"><ProductImage product={p} /></Link>
              <Link to={`/producto/${p.id}`} className="reorder__name">{p.name}</Link>
              <button className="btn btn--ghost reorder__btn" onClick={() => add(p.id)}><Icon name="cart" /> Agregar</button>
            </div>
          ))}
        </div>
      </section>

      {/* Listas de compra */}
      <section className="row">
        <div className="row__head">
          <h2 className="section-title">Listas de compra</h2>
          <Link to="/listas" className="row__more">Ver todas</Link>
        </div>
        <div className="acctiles">
          {frequentLists.map((l) => (
            <div key={l.id} className="listcard">
              <div className="listcard__top">
                <strong>{l.name}</strong>
                <span>{l.productIds.length} productos</span>
              </div>
              <button className="btn btn--primary btn--block" onClick={() => l.productIds.forEach((id) => add(id))}>Agregar todo al carro</button>
              <Link to="/listas" className="listcard__link">Ver detalle</Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
