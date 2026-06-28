import { Link, useNavigate } from 'react-router-dom'
import type { Product } from '@/types'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import PriceTag from './PriceTag'
import ProductImage from './ProductImage'
import Rating from './Rating'
import Icon from './Icon'
import { availabilityFor, badgesFor, keySpec } from '@/utils/catalog'

export default function ProductCard({ product }: { product: Product }) {
  const { mode } = useApp()
  const { add, setQty, lines } = useCart()
  const wishlist = useWishlist()
  const navigate = useNavigate()
  const faved = wishlist.has(product.id)
  const inCart = lines.find((l) => l.productId === product.id)?.qty ?? 0

  const badges = badgesFor(product, { mode })
  const avail = availabilityFor(product)

  return (
    <article className="card">
      <div className="card__media">
        <Link to={`/producto/${product.id}`} className="card__media-link" aria-label={product.name}>
          <ProductImage product={product} className="card__img" />
        </Link>
        <div className="card__badges">
          {badges.map((b) => (
            <span key={b.label} className={`tag tag--${b.kind}`}>{b.label}</span>
          ))}
        </div>
        <button
          className={`fav ${faved ? 'is-on' : ''}`}
          onClick={() => wishlist.toggle(product.id)}
          aria-label={faved ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          aria-pressed={faved}
        >
          <Icon name="heart" filled={faved} />
        </button>
      </div>

      <div className="card__body">
        <span className="card__brand">{product.brand}</span>
        <Link to={`/producto/${product.id}`} className="card__name">
          {product.name}
        </Link>
        {keySpec(product) && <span className="card__attr">{keySpec(product)}</span>}
        <Rating value={product.rating} reviews={product.reviews} />
        <PriceTag product={product} qty={1} compact />
        <span className="card__unit">Precio por {product.unit}</span>

        <div className="card__avail">
          <span className={`dot dot--${avail.delivery ? 'ok' : 'no'}`} aria-hidden />
          {avail.pickupToday && <span className="card__av"><Icon name="store" /> Retiro hoy</span>}
          {avail.fast && <span className="card__av"><Icon name="truck" /> Despacho rápido</span>}
          {!avail.pickupToday && !avail.fast && <span className="card__av">{avail.label}</span>}
        </div>

        <div className="card__actions">
          {inCart === 0 ? (
            <button className="btn btn--primary card__add" onClick={() => add(product.id, 1)}>
              {mode === 'b2b' ? 'Agregar a la orden' : 'Agregar'}
            </button>
          ) : (
            <div className="card__incart" role="group" aria-label="Cantidad en el carro">
              <button onClick={() => setQty(product.id, inCart - 1)} aria-label="Quitar uno">−</button>
              <span className="card__incart-q"><strong>{inCart}</strong> en carro</span>
              <button onClick={() => setQty(product.id, inCart + 1)} aria-label="Agregar uno">+</button>
            </div>
          )}
        </div>
        {mode === 'b2b' && (
          <button className="card__quote" onClick={() => { add(product.id, 1); navigate('/cotizacion') }}>
            <Icon name="doc" /> Cotizar
          </button>
        )}
      </div>
    </article>
  )
}
