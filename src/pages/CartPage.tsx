import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import { buildTotals } from '@/utils/cart'
import { formatCLP } from '@/utils/format'

export default function CartPage() {
  const { mode, customer } = useApp()
  const { lines, setQty, remove, clear } = useCart()
  const navigate = useNavigate()
  const totals = buildTotals(lines, mode, customer)

  if (!lines.length) {
    return (
      <div className="container empty">
        <h1>{mode === 'b2b' ? 'Tu orden está vacía' : 'Tu carro está vacío'}</h1>
        <p>Agrega productos para continuar.</p>
        <Link to="/" className="btn btn--primary">
          Ir a comprar
        </Link>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="page-title">{mode === 'b2b' ? 'Mi orden' : 'Mi carro'}</h1>

      <div className="cartlayout">
        <div className="cartlines">
          {totals.lines.map((l) => (
            <div key={l.product.id} className="cartline">
              <Link to={`/producto/${l.product.id}`} className="cartline__media" aria-hidden>
                {l.product.image}
              </Link>
              <div className="cartline__info">
                <Link to={`/producto/${l.product.id}`} className="cartline__name">
                  {l.product.name}
                </Link>
                <span className="cartline__brand">
                  {l.product.brand} · {l.product.sku}
                </span>
                <span className="cartline__unit">
                  {formatCLP(l.unitGross)} c/u {mode === 'b2b' && `(neto ${formatCLP(l.unitNet)})`}
                </span>
              </div>
              <div className="qty qty--sm">
                <button onClick={() => setQty(l.product.id, l.qty - 1)} aria-label="Restar">
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={l.qty}
                  onChange={(e) => setQty(l.product.id, Math.max(1, Number(e.target.value) || 1))}
                />
                <button onClick={() => setQty(l.product.id, l.qty + 1)} aria-label="Sumar">
                  +
                </button>
              </div>
              <div className="cartline__total">{formatCLP(l.lineGross)}</div>
              <button
                className="cartline__remove"
                onClick={() => remove(l.product.id)}
                aria-label="Eliminar"
              >
                🗑
              </button>
            </div>
          ))}
          <button className="link-btn" onClick={clear}>
            Vaciar {mode === 'b2b' ? 'orden' : 'carro'}
          </button>
        </div>

        <aside className="summary">
          <h2>Resumen</h2>
          <dl>
            <div>
              <dt>Neto</dt>
              <dd>{formatCLP(totals.net)}</dd>
            </div>
            <div>
              <dt>IVA (19%)</dt>
              <dd>{formatCLP(totals.iva)}</dd>
            </div>
            {totals.savings > 0 && (
              <div className="summary__save">
                <dt>Ahorro</dt>
                <dd>-{formatCLP(totals.savings)}</dd>
              </div>
            )}
            <div className="summary__total">
              <dt>Total</dt>
              <dd>{formatCLP(totals.gross)}</dd>
            </div>
          </dl>

          <button className="btn btn--primary btn--block" onClick={() => navigate('/checkout')}>
            {mode === 'b2b' ? 'Continuar con la compra' : 'Ir a pagar'}
          </button>

          {mode === 'b2b' && (
            <button
              className="btn btn--ghost btn--block"
              onClick={() => navigate('/cotizacion')}
            >
              Convertir en cotización
            </button>
          )}
          <Link to="/" className="summary__continue">
            ← Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  )
}
