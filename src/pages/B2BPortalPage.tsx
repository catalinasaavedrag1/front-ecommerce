import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { formatCLP, formatRut } from '@/utils/format'
import Icon, { type IconName } from '@/components/Icon'

const features: { icon: IconName; title: string; text: string }[] = [
  { icon: 'percent', title: 'Descuentos por volumen', text: 'Tramos de precio que mejoran automáticamente según la cantidad.' },
  { icon: 'wallet', title: 'Línea de crédito', text: 'Compra con facturación y paga a 30, 60 o 90 días.' },
  { icon: 'doc', title: 'Cotizaciones en línea', text: 'Genera cotizaciones formales descargables en segundos.' },
  { icon: 'store', title: 'Stock por bodega', text: 'Consulta disponibilidad en CD y sucursales antes de comprar.' },
  { icon: 'truck', title: 'Despacho a faena', text: 'Entregas programadas en obra en todo Chile.' },
  { icon: 'headset', title: 'Ejecutivo asignado', text: 'Atención dedicada para grandes volúmenes y licitaciones.' },
]

export default function B2BPortalPage() {
  const { customer } = useApp()
  const isBusiness = customer?.type === 'b2b'

  return (
    <div className="container">
      <section className="b2bhero">
        <div>
          <span className="hero__eyebrow">Mimbral Empresas</span>
          <h1>Soluciones de abastecimiento para tu negocio u obra</h1>
          <p>
            Precios netos preferenciales, descuentos por volumen, línea de crédito
            y cotizaciones formales. Pensado para constructoras, ferreterías,
            mantención, retail y profesionales.
          </p>
          <div className="hero__cta">
            {isBusiness ? (
              <Link to="/" className="btn btn--primary">Ir a comprar con precios empresa</Link>
            ) : (
              <>
                <Link to="/ingresar" className="btn btn--primary">Ingresar como empresa</Link>
                <Link to="/ingresar" className="btn btn--ghost">Crear cuenta empresa</Link>
              </>
            )}
            <Link to="/cotizacion" className="btn btn--ghost">Solicitar cotización</Link>
          </div>
          {!isBusiness && (
            <p className="b2bhero__note"><Icon name="lock" /> Los precios netos y por volumen se activan al ingresar con tu cuenta de empresa.</p>
          )}
        </div>
        <div className="b2bhero__art" aria-hidden><Icon name="building" /></div>
      </section>

      {isBusiness && customer.creditLine ? (
        <section className="account-dash">
          <h2 className="section-title">Tu cuenta empresa</h2>
          <div className="dashgrid">
            <div className="dashcard">
              <span className="dashcard__label">Razón social</span>
              <strong>{customer.company}</strong>
              <span className="dashcard__sub">
                RUT {customer.rut ? formatRut(customer.rut) : '—'}
              </span>
            </div>
            <div className="dashcard">
              <span className="dashcard__label">Lista de precios</span>
              <strong>{customer.priceList ?? 'Mayorista A'}</strong>
              <span className="dashcard__sub">
                {Math.round((customer.corporateDiscount ?? 0) * 100)}% descuento corporativo
              </span>
            </div>
            <div className="dashcard">
              <span className="dashcard__label">Línea de crédito</span>
              <strong>{formatCLP(customer.creditLine)}</strong>
              <div className="creditbar">
                <span
                  style={{
                    width: `${Math.min(100, ((customer.creditUsed ?? 0) / customer.creditLine) * 100)}%`,
                  }}
                />
              </div>
              <span className="dashcard__sub">
                Disponible {formatCLP(customer.creditLine - (customer.creditUsed ?? 0))}
              </span>
            </div>
          </div>
          <div className="dash-actions">
            <Link to="/mis-pedidos" className="btn btn--ghost"><Icon name="box" /> Mis pedidos</Link>
            <Link to="/cotizacion" className="btn btn--ghost"><Icon name="doc" /> Mis cotizaciones</Link>
            <a href="#facturas" className="btn btn--ghost"><Icon name="wallet" /> Facturas</a>
          </div>
        </section>
      ) : null}

      <section className="features">
        <h2 className="section-title">Beneficios para empresas</h2>
        <div className="features__grid">
          {features.map((f) => (
            <article key={f.title}>
              <span className="features__icon"><Icon name={f.icon} /></span>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ctaband">
        <div>
          <h2>¿Listo para comprar al por mayor?</h2>
          <p>{isBusiness ? 'Ya tienes precios empresa activos en todo el catálogo.' : 'Ingresa con tu cuenta de empresa y verás los precios netos en todo el catálogo.'}</p>
        </div>
        <Link to={isBusiness ? '/' : '/ingresar'} className="btn btn--primary btn--lg">
          {isBusiness ? 'Ir a comprar' : 'Ingresar como empresa'}
        </Link>
      </section>
    </div>
  )
}
