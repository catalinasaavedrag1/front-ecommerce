import { Link } from 'react-router-dom'
import { categories, products } from '@/data/products'
import { useApp } from '@/context/AppContext'
import ProductCard from '@/components/ProductCard'

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
                <Link to="/empresas" className="btn btn--primary">
                  Ir al Portal Empresas
                </Link>
                <Link to="/cotizacion" className="btn btn--ghost">
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
                <Link to="/categoria/herramientas" className="btn btn--primary">
                  Ver herramientas
                </Link>
                <Link to="/categoria/pinturas" className="btn btn--ghost">
                  Ofertas en pinturas
                </Link>
              </div>
            </>
          )}
        </div>
        <div className="hero__art" aria-hidden>
          {mode === 'b2b' ? '🏗️' : '🛠️'}
        </div>
      </section>

      <section className="catgrid">
        <h2 className="section-title">Explora por categoría</h2>
        <div className="catgrid__items">
          {categories.map((c) => (
            <Link key={c.id} to={`/categoria/${c.slug}`} className="catgrid__item">
              <span className="catgrid__icon" aria-hidden>
                {c.icon}
              </span>
              <span>{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {mode === 'b2b' && (
        <section className="b2bperks">
          <div className="b2bperks__item">
            <strong>📊 Descuentos por volumen</strong>
            <span>Mejor precio mientras más unidades compras.</span>
          </div>
          <div className="b2bperks__item">
            <strong>🧾 Línea de crédito</strong>
            <span>Compra ahora y paga a 30, 60 o 90 días.</span>
          </div>
          <div className="b2bperks__item">
            <strong>📝 Cotizaciones</strong>
            <span>Genera cotizaciones formales en segundos.</span>
          </div>
          <div className="b2bperks__item">
            <strong>🚚 Despacho a faena</strong>
            <span>Entrega programada en obra a todo Chile.</span>
          </div>
        </section>
      )}

      {mode === 'b2c' && offers.length > 0 && (
        <section className="row">
          <div className="row__head">
            <h2 className="section-title">Ofertas de la semana</h2>
            <Link to="/categoria/pinturas" className="row__more">
              Ver más
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
    </div>
  )
}
