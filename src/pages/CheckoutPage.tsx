import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import { buildTotals } from '@/utils/cart'
import { formatCLP, formatRut } from '@/utils/format'
import Icon from '@/components/Icon'

type Delivery = 'despacho' | 'retiro'
type Payment = 'tarjeta' | 'transferencia' | 'credito'

export default function CheckoutPage() {
  const { mode, customer } = useApp()
  const { lines, clear } = useCart()
  const totals = buildTotals(lines, mode, customer)
  const [delivery, setDelivery] = useState<Delivery>('despacho')
  const [payment, setPayment] = useState<Payment>(mode === 'b2b' ? 'credito' : 'tarjeta')
  const [done, setDone] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const creditAvailable = (customer?.creditLine ?? 0) - (customer?.creditUsed ?? 0)
  const creditOk = mode !== 'b2b' || payment !== 'credito' || totals.gross <= creditAvailable

  const submit = (e: FormEvent) => {
    e.preventDefault()
    if (!creditOk || processing) return
    setProcessing(true)
    const order = `MIM-${Math.floor(100000 + (totals.gross % 900000))}`
    setTimeout(() => { setDone(order); clear() }, 1000)
  }

  if (done) {
    return (
      <div className="container confirm">
        <div className="confirm__check">✓</div>
        <h1>¡Pedido confirmado!</h1>
        <p>
          Tu número de pedido es <strong>{done}</strong>. Te enviamos el detalle a tu correo.
        </p>
        <div className="confirm__actions">
          <Link to="/mis-pedidos" className="btn btn--primary">
            Ver mis pedidos
          </Link>
          <Link to="/" className="btn btn--ghost">
            Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  if (!lines.length) {
    return (
      <div className="container empty">
        <h1>No hay productos para pagar</h1>
        <Link to="/" className="btn btn--primary">Ir a comprar</Link>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="page-title">Finalizar compra {mode === 'b2b' ? '· Empresa' : ''}</h1>

      <ol className="steps">
        <li className="steps__item is-done"><span>1</span> Carro</li>
        <li className="steps__item is-current"><span>2</span> Datos y entrega</li>
        <li className="steps__item"><span>3</span> Confirmación</li>
      </ol>
      {!customer && mode === 'b2c' && (
        <p className="checkout__guest"><Icon name="user" /> Puedes comprar como invitado. Creas tu cuenta después, si quieres.</p>
      )}

      <form className="checkout" onSubmit={submit}>
        <div className="checkout__main">
          <section className="panel">
            <h2>{mode === 'b2b' ? 'Datos de la empresa' : 'Datos de contacto'}</h2>
            <div className="formgrid">
              {mode === 'b2b' ? (
                <>
                  <label>
                    Razón social
                    <input required defaultValue={customer?.company} placeholder="Constructora Andes Ltda." />
                  </label>
                  <label>
                    RUT empresa
                    <input
                      required
                      defaultValue={customer?.rut && formatRut(customer.rut)}
                      placeholder="76.123.456-7"
                    />
                  </label>
                  <label>
                    Giro
                    <input placeholder="Construcción" />
                  </label>
                  <label>
                    Orden de compra (opcional)
                    <input placeholder="OC-2026-001" />
                  </label>
                </>
              ) : (
                <>
                  <label>
                    Nombre
                    <input required defaultValue={customer?.name} placeholder="Tu nombre" />
                  </label>
                  <label>
                    RUT
                    <input placeholder="12.345.678-9" />
                  </label>
                </>
              )}
              <label>
                Email
                <input type="email" required defaultValue={customer?.email} placeholder="correo@ejemplo.cl" />
              </label>
              <label>
                Teléfono
                <input required placeholder="+56 9 1234 5678" />
              </label>
            </div>
          </section>

          <section className="panel">
            <h2>Entrega</h2>
            <div className="choices">
              <label className={`choice ${delivery === 'despacho' ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="delivery"
                  checked={delivery === 'despacho'}
                  onChange={() => setDelivery('despacho')}
                />
                <span><Icon name="truck" /> Despacho a domicilio{mode === 'b2b' ? ' / faena' : ''}</span>
              </label>
              <label className={`choice ${delivery === 'retiro' ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="delivery"
                  checked={delivery === 'retiro'}
                  onChange={() => setDelivery('retiro')}
                />
                <span><Icon name="store" /> Retiro en tienda</span>
              </label>
            </div>
            {delivery === 'despacho' ? (
              <div className="formgrid">
                <label className="formgrid__full">
                  Dirección
                  <input required placeholder="Calle, número, comuna" />
                </label>
                <label>
                  Comuna
                  <input required placeholder="Santiago" />
                </label>
                <label>
                  Región
                  <input required placeholder="Metropolitana" />
                </label>
              </div>
            ) : (
              <div className="formgrid">
                <label className="formgrid__full">
                  Tienda de retiro
                  <select>
                    <option>Mimbral La Florida</option>
                    <option>Mimbral Concepción</option>
                    <option>CD Santiago (mayoristas)</option>
                  </select>
                </label>
              </div>
            )}
          </section>

          <section className="panel">
            <h2>Pago</h2>
            <div className="choices choices--col">
              <label className={`choice ${payment === 'tarjeta' ? 'is-active' : ''}`}>
                <input type="radio" name="pay" checked={payment === 'tarjeta'} onChange={() => setPayment('tarjeta')} />
                <span><Icon name="card" /> Tarjeta de crédito/débito</span>
              </label>
              <label className={`choice ${payment === 'transferencia' ? 'is-active' : ''}`}>
                <input
                  type="radio"
                  name="pay"
                  checked={payment === 'transferencia'}
                  onChange={() => setPayment('transferencia')}
                />
                <span><Icon name="bank" /> Transferencia bancaria</span>
              </label>
              {mode === 'b2b' && (
                <label className={`choice ${payment === 'credito' ? 'is-active' : ''}`}>
                  <input type="radio" name="pay" checked={payment === 'credito'} onChange={() => setPayment('credito')} />
                  <span>
                    <Icon name="wallet" /> Línea de crédito Mimbral
                    {customer?.creditLine ? (
                      <small> · Disponible {formatCLP(creditAvailable)}</small>
                    ) : (
                      <small> · Requiere cuenta empresa aprobada</small>
                    )}
                  </span>
                </label>
              )}
            </div>
            {!creditOk && (
              <p className="alert">
                El total supera tu crédito disponible ({formatCLP(creditAvailable)}). Elige otro
                medio de pago o solicita ampliación.
              </p>
            )}
          </section>
        </div>

        <aside className="summary">
          <h2>Resumen</h2>
          <ul className="summary__items">
            {totals.lines.map((l) => (
              <li key={l.product.id}>
                <span>
                  {l.qty}× {l.product.name}
                </span>
                <span>{formatCLP(l.lineGross)}</span>
              </li>
            ))}
          </ul>
          <dl>
            <div>
              <dt>Neto</dt>
              <dd>{formatCLP(totals.net)}</dd>
            </div>
            <div>
              <dt>IVA (19%)</dt>
              <dd>{formatCLP(totals.iva)}</dd>
            </div>
            <div>
              <dt>Despacho</dt>
              <dd>{delivery === 'retiro' ? 'Gratis' : 'Por calcular'}</dd>
            </div>
            <div className="summary__total">
              <dt>Total</dt>
              <dd>{formatCLP(totals.gross)}</dd>
            </div>
          </dl>
          <button type="submit" className="btn btn--primary btn--block btn--lg" disabled={!creditOk || processing}>
            {processing ? (
              <><span className="spinner" /> Procesando pago…</>
            ) : mode === 'b2b' && payment === 'credito' ? 'Confirmar con crédito' : `Pagar ${formatCLP(totals.gross)}`}
          </button>
          <p className="checkout__safe"><Icon name="lock" /> Compra protegida · Pago seguro</p>
          <Link to="/carro" className="summary__continue">
            ← Volver al carro
          </Link>
        </aside>
      </form>
    </div>
  )
}
