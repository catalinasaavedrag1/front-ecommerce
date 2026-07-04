import { Link } from 'react-router-dom'
import { products as localProducts } from '@/data/products'
import { priceFor } from '@/utils/pricing'
import { useApp } from '@/context/AppContext'
import { useHomeProducts } from '@/hooks/useBffCatalog'
import ProductCard from '@/components/ProductCard'
import PageHero from '@/components/PageHero'

export default function OffersPage() {
  const { mode, customer } = useApp()
  // Con BFF vivo, los productos (y sus precios/ofertas) vienen del BFF; en
  // maqueta o ante fallo, el hook degrada a los datos locales.
  const { data, live } = useHomeProducts()

  // Ofertas = productos con precio de oferta. Si la fuente activa no trae
  // ninguno (p. ej. la home del BFF no tiene destacados en oferta), se cae al
  // catálogo local para no dejar la pantalla vacía.
  const source = data.filter((p) => p.retailOffer)
  const offers = (source.length ? source : localProducts.filter((p) => p.retailOffer)).sort(
    (a, b) => priceFor(b, 1, 'b2c').discount - priceFor(a, 1, 'b2c').discount,
  )

  return (
    <div>
      <PageHero
        eyebrow="Liquidación y descuentos"
        title="Ofertas"
        icon="🔥"
        subtitle={
          mode === 'b2b'
            ? 'Precios rebajados; recuerda que como empresa además accedes a precios netos y por volumen.'
            : 'Aprovecha los mejores precios de la temporada, mientras dure el stock.'
        }
      />
      <div className="container">
        {offers.length ? (
          <>
            <p className="lead">{offers.length} productos en oferta</p>
            <div className="grid">
              {offers.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </>
        ) : (
          <div className="empty">
            <p>No hay ofertas activas en este momento. Vuelve pronto o explora todo el catálogo.</p>
            <Link to="/" className="btn btn--primary">Ver catálogo</Link>
          </div>
        )}
        {customer == null && (
          <p className="muted-note">
            * Precios {live ? 'en línea' : 'referenciales'}. Inicia sesión para ver precios y stock personalizados.
          </p>
        )}
      </div>
    </div>
  )
}
