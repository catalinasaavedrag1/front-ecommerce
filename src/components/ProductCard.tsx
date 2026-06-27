import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import PriceTag from './PriceTag'
import Rating from './Rating'

export default function ProductCard({ product }: { product: Product }) {
  const { mode } = useApp()
  const { add } = useCart()

  return (
    <article className="card">
      <Link to={`/producto/${product.id}`} className="card__media" aria-label={product.name}>
        <span className="card__glyph" aria-hidden>
          {product.image}
        </span>
        {product.tags?.map((t) => (
          <span key={t} className={`tag tag--${t.toLowerCase().replace(/\s/g, '-')}`}>
            {t}
          </span>
        ))}
      </Link>
      <div className="card__body">
        <span className="card__brand">{product.brand}</span>
        <Link to={`/producto/${product.id}`} className="card__name">
          {product.name}
        </Link>
        <Rating value={product.rating} reviews={product.reviews} />
        <PriceTag product={product} compact />
        {mode === 'b2b' && product.volumeTiers?.length ? (
          <span className="card__hint">
            Desde {product.volumeTiers[product.volumeTiers.length - 1].minQty}+ unidades, mejor precio
          </span>
        ) : product.freeShipping ? (
          <span className="card__hint card__hint--ship">🚚 Despacho gratis</span>
        ) : null}
        <button className="btn btn--primary card__add" onClick={() => add(product.id)}>
          {mode === 'b2b' ? 'Agregar a orden' : 'Agregar al carro'}
        </button>
      </div>
    </article>
  )
}
