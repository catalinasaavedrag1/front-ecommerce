import { useState } from 'react'
import type { CartTotals } from '@/utils/cart'
import { formatCLP } from '@/utils/format'
import ProductImage from '@/components/ProductImage'
import Icon from '@/components/Icon'

interface Props {
  totals: CartTotals
  shipping: number | null
  deliveryLabel?: string
  etaLabel?: string
  mobile?: boolean
}

function Lines({ totals, shipping }: { totals: CartTotals; shipping: number | null }) {
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
      <dl className="osum__totals">
        <div><dt>Productos</dt><dd>{formatCLP(totals.gross)}</dd></div>
        {totals.savings > 0 && <div className="osum__save"><dt>Ahorro</dt><dd>-{formatCLP(totals.savings)}</dd></div>}
        <div><dt>Despacho</dt><dd>{shipping == null ? 'Por calcular' : shipping === 0 ? 'Gratis' : formatCLP(shipping)}</dd></div>
        <div className="osum__total"><dt>Total</dt><dd>{formatCLP(total)}</dd></div>
      </dl>
      <p className="osum__note"><Icon name="lock" /> No se realizará ningún cobro hasta que confirmes el pago.</p>
    </>
  )
}

export default function OrderSummary({ totals, shipping, deliveryLabel, etaLabel, mobile }: Props) {
  const [open, setOpen] = useState(false)
  const total = totals.gross + (shipping ?? 0)

  if (mobile) {
    return (
      <div className={`osum-mob ${open ? 'is-open' : ''}`}>
        <button className="osum-mob__bar" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
          <span className="osum-mob__total">
            <small>Total {totals.itemCount} productos</small>
            <strong>{formatCLP(total)}</strong>
          </span>
          <span className="osum-mob__toggle">{open ? 'Ocultar' : 'Ver resumen'} <Icon name="chevron" className={open ? 'rot-up' : 'rot-down'} /></span>
        </button>
        {open && (
          <div className="osum-mob__panel">
            {deliveryLabel && <p className="osum__delivery"><Icon name="truck" /> {deliveryLabel}{etaLabel ? ` · ${etaLabel}` : ''}</p>}
            <Lines totals={totals} shipping={shipping} />
          </div>
        )}
      </div>
    )
  }

  return (
    <aside className="osum">
      <h2>Resumen de compra</h2>
      {deliveryLabel && <p className="osum__delivery"><Icon name="truck" /> {deliveryLabel}{etaLabel ? ` · ${etaLabel}` : ''}</p>}
      <Lines totals={totals} shipping={shipping} />
    </aside>
  )
}
