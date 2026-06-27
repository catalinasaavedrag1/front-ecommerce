import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { formatCLP, formatRut } from '@/utils/format'

export default function B2BPortalPage() {
  const { customer, setMode, mode } = useApp()
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
            {!isBusiness && (
              <Link to="/ingresar" className="btn btn--primary">
                Crear cuenta empresa
              </Link>
            )}
            {mode !== 'b2b' && (
              <button className="btn btn--ghost" onClick={() => setMode('b2b')}>
                Ver precios empresa
              </button>
            )}
            <Link to="/cotizacion" className="btn btn--ghost">
              Solicitar cotización
            </Link>
          </div>
        </div>
        <div className="b2bhero__art" aria-hidden>🏢</div>
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
            <Link to="/mis-pedidos" className="btn btn--ghost">📦 Mis pedidos</Link>
            <Link to="/cotizacion" className="btn btn--ghost">📝 Mis cotizaciones</Link>
            <a href="#facturas" className="btn btn--ghost">🧾 Facturas</a>
          </div>
        </section>
      ) : null}

      <section className="features">
        <h2 className="section-title">Beneficios para empresas</h2>
        <div className="features__grid">
          <article>
            <span className="features__icon">📊</span>
            <h3>Descuentos por volumen</h3>
            <p>Tramos de precio que mejoran automáticamente según la cantidad.</p>
          </article>
          <article>
            <span className="features__icon">🧾</span>
            <h3>Línea de crédito</h3>
            <p>Compra con facturación y paga a 30, 60 o 90 días.</p>
          </article>
          <article>
            <span className="features__icon">📝</span>
            <h3>Cotizaciones en línea</h3>
            <p>Genera cotizaciones formales descargables en segundos.</p>
          </article>
          <article>
            <span className="features__icon">🏬</span>
            <h3>Stock por bodega</h3>
            <p>Consulta disponibilidad en CD y sucursales antes de comprar.</p>
          </article>
          <article>
            <span className="features__icon">🚚</span>
            <h3>Despacho a faena</h3>
            <p>Entregas programadas en obra en todo Chile.</p>
          </article>
          <article>
            <span className="features__icon">👷</span>
            <h3>Ejecutivo asignado</h3>
            <p>Atención dedicada para grandes volúmenes y licitaciones.</p>
          </article>
        </div>
      </section>

      <section className="ctaband">
        <div>
          <h2>¿Listo para comprar al por mayor?</h2>
          <p>Activa el modo Empresas y revisa los precios netos de todo el catálogo.</p>
        </div>
        <button className="btn btn--primary btn--lg" onClick={() => setMode('b2b')}>
          Activar modo Empresas
        </button>
      </section>
    </div>
  )
}
