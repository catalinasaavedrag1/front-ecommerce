import { Link } from 'react-router-dom'
import { categories, products } from '@/data/products'
import { useApp } from '@/context/AppContext'
import ProductCard from '@/components/ProductCard'
import HeroCarousel, { type Slide } from '@/components/HeroCarousel'
import Icon, { CategoryIcon, type IconName } from '@/components/Icon'

const b2cSlides: Slide[] = [
  { id: 's1', bg: 'linear-gradient(120deg,#102a63,#1f4aa8)', eyebrow: 'Temporada de invierno', title: 'Tu hogar más cálido con Mimbral', ctaLabel: 'Ver ofertas', ctaTo: '/categoria/electrohogar', productId: 'p-034', discount: 17 },
  { id: 's2', bg: 'linear-gradient(120deg,#0f6347,#1aa06f)', eyebrow: 'Renueva tus espacios', title: 'Pinturas con hasta 20% de descuento', ctaLabel: 'Ver pinturas', ctaTo: '/categoria/pinturas', productId: 'p-016', discount: 20 },
  { id: 's3', bg: 'linear-gradient(120deg,#7a1d15,#e1251b)', eyebrow: 'Maestros y profesionales', title: 'Potencia para todos tus proyectos', ctaLabel: 'Ver herramientas', ctaTo: '/categoria/herramientas', productId: 'p-006', discount: 19 },
]

const b2bSlides: Slide[] = [
  { id: 'b1', bg: 'linear-gradient(120deg,#0f6347,#1aa06f)', eyebrow: 'Mimbral Empresas', title: 'Precios mayoristas para tu obra o negocio', ctaLabel: 'Ir al Portal Empresas', ctaTo: '/empresas' },
  { id: 'b2', bg: 'linear-gradient(120deg,#102a63,#1f4aa8)', eyebrow: 'Compra ahora, paga después', title: 'Línea de crédito para tu empresa', ctaLabel: 'Solicitar crédito', ctaTo: '/empresas/credito' },
]

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

const projects: { label: string; to: string; icon: IconName }[] = [
  { label: 'Quiero pintar', to: '/categoria/pinturas', icon: 'pinturas' },
  { label: 'Renovar mi baño', to: '/categoria/bano', icon: 'bano' },
  { label: 'Equipar mi taller', to: '/categoria/herramientas', icon: 'herramientas' },
  { label: 'Materiales de construcción', to: '/categoria/construccion', icon: 'construccion' },
  { label: 'Preparar el jardín', to: '/categoria/jardin', icon: 'jardin' },
  { label: 'Climatizar mi hogar', to: '/categoria/electrohogar', icon: 'electrohogar' },
]

export default function HomePage() {
  const { mode } = useApp()
  const offers = products.filter((p) => p.retailOffer).slice(0, 6)
  const bestSellers = products.filter((p) => p.tags?.includes('Más vendido'))
  const featured = products.slice(0, 8)

  return (
    <div className="home">
      <HeroCarousel slides={mode === 'b2b' ? b2bSlides : b2cSlides} />

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

      <section className="projects">
        <div className="row__head"><h2 className="section-title">Compra por proyecto</h2></div>
        <div className="projects__grid">
          {projects.map((p) => (
            <Link key={p.label} to={p.to} className="projcard">
              <span className="projcard__icon"><Icon name={p.icon} /></span>
              <span className="projcard__label">{p.label}</span>
              <Icon name="chevron" className="projcard__chev" />
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

      {offers.length > 0 && (
        <section className="row">
          <div className="row__head">
            <h2 className="section-title">Ofertas</h2>
            <Link to="/ofertas" className="row__more">Ver todas →</Link>
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
