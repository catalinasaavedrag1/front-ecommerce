import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import { buildTotals } from '@/utils/cart'
import { formatCLP } from '@/utils/format'
import { availabilityFor } from '@/utils/catalog'
import ProductImage from '@/components/ProductImage'
import Icon from '@/components/Icon'

const FREE_SHIP = 49990

export default function CartPage() {
  const { mode, customer } = useApp()
  const { lines, setQty, remove, clear } = useCart()
  const navigate = useNavigate()
  const totals = buildTotals(lines, mode, customer)
  const missingForFree = Math.max(0, FREE_SHIP - totals.gross)
  const freeProgress = Math.min(100, (totals.gross / FREE_SHIP) * 100)

  if (!lines.length) {
    return (
      <div className="container empty">
        <div className="confirm__check confirm__check--muted"><Icon name="cart" /></div>
        <h1>{mode === 'b2b' ? 'Tu orden está vacía' : 'Tu carro está vacío'}</h1>
        <p>Agrega productos para continuar.</p>
        <Link to="/" className="btn btn--primary">Ir a comprar</Link>
      </div>
    )
  }

  return (
    <div className="container">
      <nav className="breadcrumb"><Link to="/">Inicio</Link> <span>/</span> <span>{mode === 'b2b' ? 'Mi orden' : 'Mi carro'}</span></nav>
      <h1 className="page-title">{mode === 'b2b' ? 'Mi orden' : 'Mi carro'} <span className="page-title__count">({totals.itemCount})</span></h1>

      <div className="cartlayout">
        <div className="cartlines">
          {missingForFree > 0 ? (
            <div className="shipbar">
              <div className="shipbar__text">
                <Icon name="truck" /> Te faltan <strong>{formatCLP(missingForFree)}</strong> para <strong>despacho gratis</strong>
              </div>
              <div className="shipbar__track"><span style={{ width: `${freeProgress}%` }} /></div>
            </div>
          ) : (
            <div className="shipbar shipbar--done">
              <Icon name="check" /> ¡Tienes <strong>despacho gratis</strong> en este pedido!
            </div>
          )}

          {totals.lines.map((l) => {
            const av = availabilityFor(l.product)
            const overStock = l.qty > l.product.stock
            return (
              <div key={l.product.id} className="cartline">
                <Link to={`/producto/${l.product.id}`} className="cartline__media" aria-label={l.product.name}>
                  <ProductImage product={l.product} className="cartline__img" />
                </Link>
                <div className="cartline__info">
                  <Link to={`/producto/${l.product.id}`} className="cartline__name">{l.product.name}</Link>
                  <span className="cartline__brand">{l.product.brand} · {l.product.sku}</span>
                  <span className="cartline__unit">
                    {formatCLP(l.unitGross)} c/u {mode === 'b2b' && `(neto ${formatCLP(l.unitNet)})`}
                  </span>
                  <div className="cartline__tags">
                    {av.pickupToday && <span className="ltag ltag--ok"><Icon name="store" /> Retiro hoy</span>}
                    {av.delivery && <span className="ltag"><Icon name="truck" /> Despacho 24-72h</span>}
                    {l.product.bulky && <span className="ltag ltag--warn">Producto voluminoso</span>}
                  </div>
                  {overStock && <span className="cartline__alert"><Icon name="close" /> Solo quedan {l.product.stock} unidades disponibles</span>}
                </div>
                <div className="qty qty--sm">
                  <button onClick={() => setQty(l.product.id, l.qty - 1)} aria-label="Restar">−</button>
                  <input type="number" min={1} value={l.qty} onChange={(e) => setQty(l.product.id, Math.max(1, Number(e.target.value) || 1))} />
                  <button onClick={() => setQty(l.product.id, l.qty + 1)} aria-label="Sumar">+</button>
                </div>
                <div className="cartline__total">{formatCLP(l.lineGross)}</div>
                <button className="cartline__remove" onClick={() => remove(l.product.id)} aria-label="Eliminar"><Icon name="trash" /></button>
              </div>
            )
          })}
          <button className="link-btn" onClick={clear}>Vaciar {mode === 'b2b' ? 'orden' : 'carro'}</button>
        </div>

        <aside className="summary">
          <h2>Resumen</h2>
          <dl>
            <div><dt>Neto</dt><dd>{formatCLP(totals.net)}</dd></div>
            <div><dt>IVA (19%)</dt><dd>{formatCLP(totals.iva)}</dd></div>
            <div><dt>Despacho</dt><dd>{missingForFree > 0 ? 'Por calcular' : 'Gratis'}</dd></div>
            {totals.savings > 0 && (
              <div className="summary__save"><dt>Ahorro</dt><dd>-{formatCLP(totals.savings)}</dd></div>
            )}
            <div className="summary__total"><dt>Total</dt><dd>{formatCLP(totals.gross)}</dd></div>
          </dl>

          <button className="btn btn--primary btn--block" onClick={() => navigate('/checkout')}>
            {mode === 'b2b' ? 'Continuar con la compra' : 'Continuar al pago'}
          </button>
          {mode === 'b2b' && (
            <button className="btn btn--ghost btn--block" onClick={() => navigate('/cotizacion')}>Convertir en cotización</button>
          )}

          <ul className="summary__trust">
            <li><Icon name="lock" /> Pago seguro Webpay y transferencia</li>
            <li><Icon name="return" /> 30 días para cambios y devoluciones</li>
            <li><Icon name="store" /> Retira gratis en tienda</li>
          </ul>
          <Link to="/" className="summary__continue">← Seguir comprando</Link>
        </aside>
      </div>
    </div>
  )
}
