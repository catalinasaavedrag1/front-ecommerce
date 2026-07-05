import { useState } from 'react'
import type { CartTotals } from '@/utils/cart'
import type { BffCart } from '@/api/types'
import { formatCLP } from '@/utils/format'
import ProductImage from '@/components/ProductImage'
import Icon from '@/components/Icon'

interface Props {
  totals: CartTotals
  shipping: number | null
  deliveryLabel?: string
  etaLabel?: string
  mobile?: boolean
  discount?: number
  discountLabel?: string
  /** Carrito recalculado del BFF: si viene, sus totales mandan sobre los locales. */
  bffCart?: BffCart | null
}

/** Totales autoritativos del BFF (cadenas ya formateadas por cart-service). */
function BffTotalsBlock({ cart }: { cart: BffCart }) {
  const hasDiscount = cart.totals.discountFormatted && !/^\$?0/.test(cart.totals.discountFormatted)
  return (
    <>
      <dl className="osum__totals">
        <div><dt>Productos</dt><dd>{cart.totals.subtotalFormatted}</dd></div>
        {hasDiscount && <div className="osum__save"><dt>Descuento</dt><dd>-{cart.totals.discountFormatted}</dd></div>}
        <div><dt>Despacho</dt><dd>{cart.totals.shippingFormatted}</dd></div>
        <div className="osum__total"><dt>Total</dt><dd>{cart.totals.totalFormatted}</dd></div>
      </dl>
      <p className="osum__note"><Icon name="check" /> Totales validados con precios y stock en línea.</p>
    </>
  )
}

function Lines({
  totals,
  shipping,
  discount = 0,
  discountLabel,
  bffCart,
}: {
  totals: CartTotals
  shipping: number | null
  discount?: number
  discountLabel?: string
  bffCart?: BffCart | null
}) {
  const total = totals.gross + (shipping ?? 0)
  return (
    <>
      <ul className="osum__items">
        {totals.lines.map((l) => (
          <li key={l.product.id}>
            <span className="osum__qty">{l.qty}×</span>
            <span className="osum__media"><ProductImage product={l.product} /></span>
            <span className="osum__name">{l.product.name}</span>
            <span className="osum__price">{formatCLP(l.lineGross)}</span>
          </li>
        ))}
      </ul>
      {bffCart ? (
        <BffTotalsBlock cart={bffCart} />
      ) : (
        <dl className="osum__totals">
          <div><dt>Productos</dt><dd>{formatCLP(totals.gross)}</dd></div>
          {totals.savings > 0 && <div className="osum__save"><dt>Ahorro</dt><dd>-{formatCLP(totals.savings)}</dd></div>}
          <div><dt>Despacho</dt><dd>{shipping == null ? 'Por calcular' : shipping === 0 ? 'Gratis' : formatCLP(shipping)}</dd></div>
          {discount > 0 && <div className="osum__save"><dt>{discountLabel ?? 'Descuento'}</dt><dd>-{formatCLP(discount)}</dd></div>}
          <div className="osum__total"><dt>Total</dt><dd>{formatCLP(total - discount)}</dd></div>
        </dl>
      )}
      <p className="osum__note"><Icon name="lock" /> No se realizará ningún cobro hasta que confirmes el pago.</p>
    </>
  )
}

export default function OrderSummary({ totals, shipping, deliveryLabel, etaLabel, mobile, discount = 0, discountLabel, bffCart }: Props) {
  const [open, setOpen] = useState(false)
  const total = totals.gross + (shipping ?? 0)
  // Con BFF vivo, el total de la barra móvil también sale del BFF.
  const mobileTotal = bffCart ? bffCart.totals.totalFormatted : formatCLP(total)

  if (mobile) {
    return (
      <div className={`osum-mob ${open ? 'is-open' : ''}`}>
        <button className="osum-mob__bar" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          <span className="osum-mob__total">
            <small>Total {totals.itemCount} productos</small>
            <strong>{mobileTotal}</strong>
            {!bffCart && discount > 0 && <em className="osum-mob__loyalty">{discountLabel ?? 'Con descuento'} {formatCLP(total - discount)}</em>}
          </span>
          <span className="osum-mob__toggle">{open ? 'Ocultar' : 'Ver resumen'} <Icon name="chevron" className={open ? 'rot-up' : 'rot-down'} /></span>
        </button>
        {open && (
          <div className="osum-mob__panel">
            {deliveryLabel && <p className="osum__delivery"><Icon name="truck" /> {deliveryLabel}{etaLabel ? ` · ${etaLabel}` : ''}</p>}
            <Lines totals={totals} shipping={shipping} discount={discount} discountLabel={discountLabel} bffCart={bffCart} />
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="osum">
      <h2>Resumen de compra</h2>
      {deliveryLabel && <p className="osum__delivery"><Icon name="truck" /> {deliveryLabel}{etaLabel ? ` · ${etaLabel}` : ''}</p>}
      <Lines totals={totals} shipping={shipping} discount={discount} discountLabel={discountLabel} bffCart={bffCart} />
    </aside>
  )
}
