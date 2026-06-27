import type { Product } from '@/types'
import { useApp } from '@/context/AppContext'
import { priceFor } from '@/utils/pricing'
import { formatCLP } from '@/utils/format'

interface Props {
  product: Product
  qty?: number
  compact?: boolean
}

/**
 * Muestra el precio según el modo activo. En B2C destaca el precio con IVA y la
 * oferta; en B2B muestra el precio neto (sin IVA) y el equivalente con IVA.
 */
export default function PriceTag({ product, qty = 1, compact }: Props) {
  const { mode, customer } = useApp()
  const price = priceFor(product, qty, mode, customer)

  if (mode === 'b2b') {
    return (
      <div className={`price price--b2b ${compact ? 'price--compact' : ''}`}>
        <span className="price__label">Precio empresa (neto)</span>
        <span className="price__net">{formatCLP(price.unitNet)}</span>
        <span className="price__gross">{formatCLP(price.unitGross)} con IVA</span>
        {price.source === 'volumen' && <span className="price__badge">Precio por volumen</span>}
        {price.source === 'corporativo' && <span className="price__badge">Precio corporativo</span>}
      </div>
    )
  }

  const hasOffer = Boolean(product.retailOffer)
  return (
    <div className={`price ${compact ? 'price--compact' : ''}`}>
      {hasOffer && <span className="price__list">{formatCLP(product.retailPrice)}</span>}
      <span className="price__now">{formatCLP(price.unitGross)}</span>
      {hasOffer && (
        <span className="price__off">-{Math.round(price.discount * 100)}%</span>
      )}
      {!compact && <span className="price__iva">IVA incluido</span>}
    </div>
  )
}
