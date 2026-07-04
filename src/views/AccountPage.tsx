import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import { frequentLists, frequentProductIds, sampleOrders, upcomingInvoice } from '@/data/account'
import { getProduct } from '@/data/products'
import { formatCLP, formatRut } from '@/utils/format'
import PageHero from '@/components/PageHero'
import ProductImage from '@/components/ProductImage'
import Icon, { type IconName } from '@/components/Icon'

const tiles: { to: string; icon: IconName; title: string; text: string }[] = [
  { to: '/mis-pedidos', icon: 'box', title: 'Mis pedidos', text: 'Historial y seguimiento' },
  { to: '/cotizacion', icon: 'doc', title: 'Mis cotizaciones', text: 'Solicita y revisa' },
  { to: '/favoritos', icon: 'heart', title: 'Favoritos', text: 'Productos guardados' },
  { to: '/listas', icon: 'list', title: 'Listas frecuentes', text: 'Reposición rápida' },
  { to: '/seguimiento', icon: 'truck', title: 'Seguir pedido', text: 'Estado de entrega' },
  { to: '/ayuda', icon: 'headset', title: 'Ayuda', text: 'Atención y soporte' },
]

export default function AccountPage() {
  const { customer } = useApp()
  const { add } = useCart()

  if (!customer) {
    return (
      <div className="container empty">
        <div className="confirm__check confirm__check--muted"><Icon name="user" /></div>
        <h1>Ingresa a tu cuenta</h1>
        <p>Accede para ver tus pedidos, favoritos, listas frecuentes y cotizaciones.</p>
        <Link to="/ingresar" className="btn btn--primary">Ingresar</Link>
      </div>
    )
  }

  const isB2B = customer.type === 'b2b'
  const reorder = frequentProductIds.map(getProduct).filter(Boolean)

  const due = new Date(upcomingInvoice.dueDate)
  const daysToDue = Math.ceil((due.getTime() - Date.now()) / 86_400_000)
  const dueLabel = due.toLocaleDateString('es-CL', { day: '2-digit', month: 'short' }).replace('.', '').replace('-', ' ')

  return (
    <div>
      <PageHero
        eyebrow={isB2B ? 'Mimbral Empresas' : 'Mi cuenta'}
        title={`Hola, ${customer.name.split(' ')[0]}`}
        subtitle={isB2B ? customer.company : customer.email}
      />
      <div className="container">
        <section className="account-overview" aria-label="Resumen de cuenta">
          <div className="account-welcome">
            <span className="account-welcome__icon"><Icon name={isB2B ? 'building' : 'user'} /></span>
            <div>
              <h2>{isB2B ? 'Panel de compra empresa' : 'Tu espacio personal'}</h2>
              <p>{isB2B ? 'Revisa crédito, cotizaciones y listas para abastecer tu operación sin perder tiempo.' : 'Encuentra rápido tus pedidos, favoritos y productos para volver a comprar.'}</p>
            </div>
          </div>
          <div className="account-next">
            <strong>Siguiente mejor acción</strong>
            <span>{isB2B ? 'Carga una lista frecuente o solicita una cotización para aprobación interna.' : 'Revisa el estado de tu último pedido o continúa con tus favoritos.'}</span>
            <div className="account-next__actions">
              <Link to={isB2B ? '/listas' : '/mis-pedidos'} className="btn btn--primary">{isB2B ? 'Ver listas' : 'Ver pedidos'}</Link>
              <Link to={isB2B ? '/cotizacion' : '/favoritos'} className="btn btn--ghost">{isB2B ? 'Cotizar' : 'Favoritos'}</Link>
            </div>
          </div>
        </section>

        {isB2B && daysToDue >= 0 && daysToDue <= 10 && (
          <section className="invoice-alert" role="status">
            <div className="invoice-alert__body">
              <span className="invoice-alert__icon"><Icon name="wallet" /></span>
              <div>
                <strong>Tienes una factura por vencer en {daysToDue} {daysToDue === 1 ? 'día' : 'días'}</strong>
                <span>{upcomingInvoice.id} por {formatCLP(upcomingInvoice.amount)} · vence el {dueLabel}.</span>
              </div>
            </div>
            <div className="invoice-alert__actions">
              <Link to="/empresas/credito" className="btn btn--primary">Pagar ahora</Link>
              <Link to="/empresas/credito" className="btn btn--ghost">Ver crédito</Link>
            </div>
          </section>
        )}

        {isB2B && customer.creditLine && (
          <section className="account-dash">
            <div className="dashgrid">
              <div className="dashcard">
                <span className="dashcard__label">Compras del mes</span>
                <strong>{formatCLP(sampleOrders.reduce((s, o) => s + (o.mode === 'b2b' ? o.total : 0), 0))}</strong>
                <span className="dashcard__sub">{sampleOrders.filter((o) => o.mode === 'b2b').length} pedidos</span>
              </div>
              <div className="dashcard">
                <span className="dashcard__label">Crédito disponible</span>
                <strong>{formatCLP(customer.creditLine - (customer.creditUsed ?? 0))}</strong>
                <div className="creditbar"><span style={{ width: `${Math.min(100, ((customer.creditUsed ?? 0) / customer.creditLine) * 100)}%` }} /></div>
                <span className="dashcard__sub">de {formatCLP(customer.creditLine)} · RUT {customer.rut ? formatRut(customer.rut) : '—'}</span>
              </div>
              <div className="dashcard">
                <span className="dashcard__label">Lista de precios</span>
                <strong>{customer.priceList ?? 'Mayorista A'}</strong>
                <span className="dashcard__sub">{Math.round((customer.corporateDiscount ?? 0) * 100)}% descuento corporativo</span>
              </div>
            </div>
          </section>
        )}

        <section>
          <h2 className="section-title">Accesos directos</h2>
          <div className="acctiles">
            {tiles.map((t) => (
              <Link key={t.to} to={t.to} className="acctile">
                <span className="acctile__icon"><Icon name={t.icon} /></span>
                <span className="acctile__body">
                  <strong>{t.title}</strong>
                  <span>{t.text}</span>
                </span>
                <Icon name="chevron" className="acctile__chev" />
              </Link>
            ))}
          </div>
        </section>

        <section className="row">
          <div className="row__head">
            <h2 className="section-title">Volver a comprar</h2>
            <Link to="/mis-pedidos" className="row__more">Ver historial</Link>
          </div>
          <div className="reorder">
            {reorder.map((p) => p && (
              <div key={p.id} className="reorder__item">
                <Link to={`/producto/${p.id}`} className="reorder__media"><ProductImage product={p} /></Link>
                <Link to={`/producto/${p.id}`} className="reorder__name">{p.name}</Link>
                <button className="btn btn--ghost reorder__btn" onClick={() => add(p.id)}>
                  <Icon name="cart" /> Agregar
                </button>
              </div>
            ))}
          </div>
        </section>

        {isB2B && (
          <section className="row">
            <div className="row__head">
              <h2 className="section-title">Listas frecuentes</h2>
              <Link to="/listas" className="row__more">Ver todas</Link>
            </div>
            <div className="acctiles">
              {frequentLists.map((l) => (
                <div key={l.id} className="listcard">
                  <div className="listcard__top">
                    <strong>{l.name}</strong>
                    <span>{l.productIds.length} productos</span>
                  </div>
                  <button className="btn btn--primary btn--block" onClick={() => l.productIds.forEach((id) => add(id))}>
                    Agregar todo al carro
                  </button>
                  <Link to="/listas" className="listcard__link">Ver detalle</Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
