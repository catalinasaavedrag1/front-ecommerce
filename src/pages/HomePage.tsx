import { Link } from 'react-router-dom'
import { categories, products } from '@/data/products'
import { useApp } from '@/context/AppContext'
import ProductCard from '@/components/ProductCard'
import Icon, { CategoryIcon, type IconName } from '@/components/Icon'

const trust: { icon: IconName; title: string; text: string }[] = [
  { icon: 'truck', title: 'Despacho a todo Chile', text: 'Seguimiento en línea' },
  { icon: 'store', title: 'Retiro en tienda', text: 'Listo el mismo día' },
  { icon: 'lock', title: 'Pago seguro', text: 'Webpay y transferencia' },
  { icon: 'return', title: '30 días', text: 'Cambios y devoluciones' },
]

const perks: { icon: IconName; title: string; text: string }[] = [
  { icon: 'percent', title: 'Descuentos por volumen', text: 'Mejor precio mientras más unidades compras.' },
  { icon: 'wallet', title: 'Línea de crédito', text: 'Compra ahora y paga a 30, 60 o 90 días.' },
  { icon: 'doc', title: 'Cotizaciones', text: 'Genera cotizaciones formales en segundos.' },
  { icon: 'truck', title: 'Despacho a faena', text: 'Entrega programada en obra a todo Chile.' },
]

const brands = ['Bauker', 'Toolmax', 'Colormax', 'Lumen', 'Andescem', 'Hidroflex', 'AgroVida', 'Maderba']

export default function HomePage() {
  const { mode } = useApp()
  const offers = products.filter((p) => p.retailOffer).slice(0, 4)
  const bestSellers = products.filter((p) => p.tags?.includes('Más vendido'))
  const featured = products.slice(0, 8)

  return (
    <div className="home">
      <section className={`hero hero--${mode}`}>
        <div className="hero__content">
          {mode === 'b2b' ? (
            <>
              <span className="hero__eyebrow">Mimbral Empresas</span>
              <h1>Abastece tu obra o negocio con precios mayoristas</h1>
              <p>
                Precios netos, descuentos por volumen, línea de crédito y
                cotizaciones en línea. Despacho a faena en todo Chile.
              </p>
              <div className="hero__cta">
                <Link to="/empresas" className="btn btn--primary btn--lg">
                  Ir al Portal Empresas
                </Link>
                <Link to="/cotizacion" className="btn btn--ghost btn--lg">
                  Solicitar cotización
                </Link>
              </div>
            </>
          ) : (
            <>
              <span className="hero__eyebrow">Temporada de proyectos</span>
              <h1>Todo para construir y mejorar tu hogar</h1>
              <p>
                Miles de productos de las mejores marcas, con despacho a todo
                Chile y retiro en tienda el mismo día.
              </p>
              <div className="hero__cta">
                <Link to="/categoria/herramientas" className="btn btn--primary btn--lg">
                  Ver herramientas
                </Link>
                <Link to="/categoria/pinturas" className="btn btn--ghost btn--lg">
                  Ofertas en pinturas
                </Link>
              </div>
              <div className="hero__stats">
                <span><strong>+15.000</strong> productos</span>
                <span><strong>60+</strong> marcas</span>
                <span><strong>24-72h</strong> despacho</span>
              </div>
            </>
          )}
        </div>
        <div className="hero__cards" aria-hidden>
          <div className="hero__promo hero__promo--a">
            <span>Hasta</span>
            <strong>30%</strong>
            <small>en pinturas</small>
          </div>
          <div className="hero__promo hero__promo--b">
            <span>Despacho</span>
            <strong>GRATIS</strong>
            <small>sobre $49.990</small>
          </div>
        </div>
      </section>

      <section className="trustbar">
        {trust.map((t) => (
          <div className="trustbar__item" key={t.title}>
            <span className="trustbar__icon"><Icon name={t.icon} /></span>
            <div>
              <strong>{t.title}</strong>
              <span>{t.text}</span>
            </div>
          </div>
        ))}
      </section>

      <section className="catgrid">
        <div className="row__head">
          <h2 className="section-title">Explora por categoría</h2>
        </div>
        <div className="catgrid__items">
          {categories.map((c) => (
            <Link key={c.id} to={`/categoria/${c.slug}`} className="catgrid__item">
              <span className="catgrid__icon"><CategoryIcon id={c.id} /></span>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {mode === 'b2c' && (
        <section className="banners">
          <Link to="/categoria/herramientas" className="banner banner--tools">
            <div>
              <span className="banner__kick">Maestros y DIY</span>
              <h3>Herramientas eléctricas</h3>
              <span className="banner__link">Ver ofertas →</span>
            </div>
          </Link>
          <Link to="/empresas" className="banner banner--b2b">
            <div>
              <span className="banner__kick">¿Compras al por mayor?</span>
              <h3>Precios para empresas</h3>
              <span className="banner__link">Conocer beneficios →</span>
            </div>
          </Link>
        </section>
      )}

      {mode === 'b2b' && (
        <section className="b2bperks">
          {perks.map((p) => (
            <div className="b2bperks__item" key={p.title}>
              <span className="b2bperks__icon"><Icon name={p.icon} /></span>
              <strong>{p.title}</strong>
              <span>{p.text}</span>
            </div>
          ))}
        </section>
      )}

      {mode === 'b2c' && offers.length > 0 && (
        <section className="row">
          <div className="row__head">
            <h2 className="section-title">Ofertas de la semana</h2>
            <Link to="/ofertas" className="row__more">
              Ver todas
            </Link>
          </div>
          <div className="grid">
            {offers.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="row">
        <div className="row__head">
          <h2 className="section-title">
            {mode === 'b2b' ? 'Más pedidos por empresas' : 'Destacados'}
          </h2>
        </div>
        <div className="grid">
          {(mode === 'b2b' && bestSellers.length ? bestSellers.concat(featured) : featured)
            .slice(0, 8)
            .map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </section>

      <section className="brandstrip">
        <span className="brandstrip__label">Marcas que trabajamos</span>
        <div className="brandstrip__items">
          {brands.map((b) => (
            <span key={b} className="brandstrip__brand">{b}</span>
          ))}
        </div>
      </section>
    </div>
  )
}
