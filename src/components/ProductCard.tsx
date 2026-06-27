import { useState } from 'react'
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
  const { add } = useCart()
  const wishlist = useWishlist()
  const navigate = useNavigate()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const faved = wishlist.has(product.id)

  const onAdd = () => {
    add(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1600)
  }
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
        <PriceTag product={product} qty={qty} compact />
        <span className="card__unit">Precio por {product.unit}</span>

        <div className="card__avail">
          <span className={`dot dot--${avail.delivery ? 'ok' : 'no'}`} aria-hidden />
          {avail.pickupToday && <span className="card__av"><Icon name="store" /> Retiro hoy</span>}
          {avail.fast && <span className="card__av"><Icon name="truck" /> Despacho rápido</span>}
          {!avail.pickupToday && !avail.fast && <span className="card__av">{avail.label}</span>}
        </div>

        <div className="card__actions">
          <div className="qty qty--xs">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Restar">−</button>
            <input
              type="number"
              min={1}
              value={qty}
              onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
            />
            <button onClick={() => setQty((q) => q + 1)} aria-label="Sumar">+</button>
          </div>
          <button className={`btn btn--primary card__add ${added ? 'is-added' : ''}`} onClick={onAdd}>
            {added ? <><Icon name="check" /> Agregado</> : 'Agregar'}
          </button>
        </div>
        {mode === 'b2b' && (
          <button className="card__quote" onClick={() => { add(product.id, qty); navigate('/cotizacion') }}>
            <Icon name="doc" /> Cotizar
          </button>
        )}
      </div>
    </article>
  )
}
