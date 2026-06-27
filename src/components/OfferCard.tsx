import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import ProductImage from './ProductImage'
import { formatCLP } from '@/utils/format'

/** Tarjeta promocional estilo Mimbral para la sección de ofertas. */
export default function OfferCard({ product }: { product: Product }) {
  const offer = product.retailOffer ?? product.retailPrice
  const pct = Math.round((1 - offer / product.retailPrice) * 100)
  return (
    <Link to={`/producto/${product.id}`} className="offercard">
      <div className="offercard__media">
        <ProductImage product={product} className="offercard__img" />
        {pct > 0 && (
          <span className="offercard__dcto">
            <strong>{pct}%</strong>
            <span>DE DCTO.</span>
          </span>
        )}
        <span className="offercard__webpay">12 cuotas sin interés</span>
      </div>
      <div className="offercard__bar">
        <div className="offercard__info">
          <strong>{product.name}</strong>
          <span>{product.brand}</span>
        </div>
        <div className="offercard__price">
          <span className="offercard__now">{formatCLP(offer)}</span>
          <span className="offercard__tag">Precio oferta</span>
          {product.retailOffer && (
            <>
              <span className="offercard__was">{formatCLP(product.retailPrice)}</span>
              <span className="offercard__tag offercard__tag--muted">Precio normal</span>
            </>
          )}
        </div>
      </div>
    </Link>
  )
}
