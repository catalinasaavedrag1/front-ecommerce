import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import { buildTotals } from '@/utils/cart'
import { formatCLP } from '@/utils/format'
import Icon from '@/components/Icon'

export default function QuotePage() {
  const { customer } = useApp()
  const [params] = useSearchParams()
  const requestedProduct = params.get('producto')?.trim() ?? ''
  const { lines } = useCart()
  // Las cotizaciones siempre usan precios de empresa (neto)
  const totals = buildTotals(lines, 'b2b', customer)
  const [sent, setSent] = useState<string | null>(null)

  if (sent) {
    return (
      <div className="container confirm">
        <div className="confirm__check"><Icon name="check" /></div>
        <h1>Cotización enviada</h1>
        <p>
          Folio <strong>{sent}</strong>. Un ejecutivo te contactará con la
          cotización formal y condiciones comerciales.
        </p>
        <Link to="/empresas" className="btn btn--primary">Volver al portal</Link>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="page-title">Solicitar cotización</h1>
      <p className="lead">
        Arma tu lista de productos y solicita una cotización formal con precios de
        empresa. Sin compromiso de compra.
      </p>
      {requestedProduct && (
        <div className="quote-intent" role="note">
          <Icon name="doc" />
          <span>Incluiremos tu solicitud por <strong>{requestedProduct}</strong> aunque aún no esté en el catálogo.</span>
        </div>
      )}

      <div className="cartlayout">
        <div>
          {lines.length ? (
            <table className="quotetable">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Cant.</th>
                  <th>Neto unit.</th>
                  <th>Neto total</th>
                </tr>
              </thead>
              <tbody>
                {totals.lines.map((l) => (
                  <tr key={l.product.id}>
                    <td>
                      <Link to={`/producto/${l.product.id}`}>{l.product.name}</Link>
                      <small>{l.product.sku}</small>
                    </td>
                    <td>{l.qty}</td>
                    <td>{formatCLP(l.unitNet)}</td>
                    <td>{formatCLP(l.lineNet)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="panel empty">
              <p>{requestedProduct ? `No tienes productos agregados, pero puedes enviar una solicitud por ${requestedProduct}.` : 'No tienes productos en tu lista.'}</p>
              <Link to="/" className="btn btn--primary">Agregar productos</Link>
            </div>
          )}
        </div>

        <aside className="summary">
          <h2>Datos de cotización</h2>
          <form
            className="quoteform"
            onSubmit={(e) => {
              e.preventDefault()
              setSent(`COT-${Math.floor(10000 + (totals.net % 89999))}`)
            }}
          >
            <label>
              Empresa
              <input required defaultValue={customer?.company} placeholder="Razón social" />
            </label>
            <label>
              Email
              <input type="email" required defaultValue={customer?.email} placeholder="correo@empresa.cl" />
            </label>
            <label>
              Teléfono
              <input required placeholder="+56 9 ..." />
            </label>
            <label>
              Comentarios
              <textarea rows={3} defaultValue={requestedProduct ? `Necesito cotizar: ${requestedProduct}` : undefined} placeholder="Plazo de entrega, dirección de faena, etc." />
            </label>

            <dl>
              <div>
                <dt>Neto estimado</dt>
                <dd>{formatCLP(totals.net)}</dd>
              </div>
              <div>
                <dt>IVA (19%)</dt>
                <dd>{formatCLP(totals.iva)}</dd>
              </div>
              <div className="summary__total">
                <dt>Total estimado</dt>
                <dd>{formatCLP(totals.gross)}</dd>
              </div>
            </dl>

            <button type="submit" className="btn btn--primary btn--block" disabled={!lines.length && !requestedProduct}>
              Enviar solicitud
            </button>
          </form>
        </aside>
      </div>
    </div>
  )
}
