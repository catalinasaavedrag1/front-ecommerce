import { products } from '@/data/products'
import { priceFor } from '@/utils/pricing'
import { useApp } from '@/context/AppContext'
import ProductCard from '@/components/ProductCard'
import PageHero from '@/components/PageHero'

export default function OffersPage() {
  const { mode, customer } = useApp()
  const offers = products
    .filter((p) => p.retailOffer)
    .sort(
      (a, b) =>
        priceFor(b, 1, 'b2c').discount - priceFor(a, 1, 'b2c').discount,
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
        <p className="lead">{offers.length} productos en oferta</p>
        <div className="grid">
          {offers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {customer == null && (
          <p className="muted-note">* Precios referenciales. Inicia sesión para ver precios y stock personalizados.</p>
        )}
      </div>
    </div>
  )
}
