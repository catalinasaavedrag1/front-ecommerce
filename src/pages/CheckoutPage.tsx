import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import { buildTotals } from '@/utils/cart'
import { formatCLP, formatRut } from '@/utils/format'
import OrderSummary from '@/components/checkout/OrderSummary'
import Icon from '@/components/Icon'

type StepId = 'datos' | 'entrega' | 'direccion' | 'documento' | 'pago' | 'revision'
const ORDER: StepId[] = ['datos', 'entrega', 'direccion', 'documento', 'pago', 'revision']

const REGIONS = ['Región Metropolitana', 'Región del Maule', 'Región del Biobío', 'Región de Antofagasta']
const COMUNAS = ['Santiago', 'La Florida', 'Maipú', 'Providencia', 'San Javier', 'Concepción', 'Antofagasta', 'Isla de Pascua']
const NO_COVERAGE = ['Isla de Pascua']

const STORES = [
  { id: 's1', name: 'Mimbral La Florida', addr: 'Av. Vicuña Mackenna 7500, La Florida', hours: 'Lun a Sáb 09:00 – 21:00', eta: 'Disponible hoy desde las 16:00' },
  { id: 's2', name: 'Mimbral San Javier · Balmaceda', addr: 'Balmaceda 123, San Javier', hours: 'Lun a Sáb 09:00 – 18:30', eta: 'Disponible hoy desde las 16:00' },
  { id: 's3', name: 'Mimbral Concepción', addr: 'Autopista Concepción-Talcahuano 8900', hours: 'Lun a Dom 09:00 – 21:00', eta: 'Disponible mañana desde las 11:00' },
]

export default function CheckoutPage() {
  const { mode, customer } = useApp()
  const { lines, clear } = useCart()
  const totals = buildTotals(lines, mode, customer)
  const hasBulky = totals.lines.some((l) => l.product.bulky)

  const [buyer, setBuyer] = useState<'persona' | 'empresa'>(mode === 'b2b' ? 'empresa' : 'persona')
  const [data, setData] = useState({ name: customer?.name?.split(' ')[0] ?? '', lastname: '', email: customer?.email ?? '', phone: '' })
  const [delivery, setDelivery] = useState<'retiro' | 'despacho' | 'programado' | ''>('')
  const [region, setRegion] = useState('')
  const [comuna, setComuna] = useState('')
  const [addr, setAddr] = useState({ street: '', number: '', extra: '', ref: '', receiver: '', phone: '' })
  const [store, setStore] = useState('')
  const [progDate, setProgDate] = useState('')
  const [doc, setDoc] = useState<'boleta' | 'factura'>(mode === 'b2b' ? 'factura' : 'boleta')
  const [fact, setFact] = useState({ rut: customer?.rut ? formatRut(customer.rut) : '', razon: customer?.company ?? '', giro: '', dir: '', email: '' })
  const [payment, setPayment] = useState('')
  const [open, setOpen] = useState<StepId>('datos')
  const [done, setDone] = useState<Set<StepId>>(new Set())
  const [calc, setCalc] = useState(false)
  const [placed, setPlaced] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const noCoverage = (delivery === 'despacho' || delivery === 'programado') && comuna !== '' && NO_COVERAGE.includes(comuna)
  const shipping = delivery === 'retiro' ? 0 : !comuna || noCoverage ? null : delivery === 'programado' ? 6990 : 4990
  const deliveryLabel =
    delivery === 'retiro' ? 'Retiro en tienda' : delivery === 'programado' ? 'Despacho programado' : delivery === 'despacho' ? 'Despacho a domicilio' : undefined
  const eta = delivery === 'retiro' ? (STORES.find((s) => s.id === store)?.eta ?? 'Hoy desde las 16:00') : delivery === 'programado' ? progDate || 'Fecha por elegir' : 'Llega entre miércoles y viernes'

  const complete = (id: StepId) => {
    setDone((p) => new Set(p).add(id))
    const next = ORDER[ORDER.indexOf(id) + 1]
    if (next) setOpen(next)
  }

  const placeOrder = () => {
    if (processing) return
    setProcessing(true)
    const n = `MIM-${Math.floor(100000 + (totals.gross % 900000))}`
    setTimeout(() => { setPlaced(n); clear() }, 1100)
  }

  // ---------- Pantalla de confirmación ----------
  if (placed) {
    const transfer = payment === 'transferencia'
    return (
      <CheckoutShell minimal>
        <div className="cksuccess">
          <div className={`cksuccess__icon ${transfer ? 'is-pending' : ''}`}><Icon name="check" /></div>
          <h1>{transfer ? 'Recibimos tu pedido' : 'Tu compra fue confirmada'}</h1>
          <p className="cksuccess__sub">
            Pedido <strong>{placed}</strong>. Te enviamos el detalle a <strong>{data.email || 'tu correo'}</strong>.
            {transfer && ' Quedará confirmado cuando validemos tu transferencia (te enviamos los datos de pago al correo).'}
          </p>
          <div className="cksuccess__box">
            {delivery === 'retiro' ? (
              <>
                <h3><Icon name="store" /> Retiro en tienda</h3>
                <p>{STORES.find((s) => s.id === store)?.name}</p>
                <p className="muted">{eta}</p>
                <p className="cksuccess__bring"><Icon name="user" /> Lleva tu carnet de identidad y el número de pedido.</p>
              </>
            ) : (
              <>
                <h3><Icon name="truck" /> {deliveryLabel}</h3>
                <p>{addr.street} {addr.number}, {comuna}</p>
                <p className="muted">Entrega estimada: {eta}</p>
              </>
            )}
            <div className="cksuccess__pay"><span>{doc === 'factura' ? 'Factura' : 'Boleta'}</span><span>·</span><span>{payLabel(payment)}</span><span>·</span><strong>{formatCLP(totals.gross + (shipping ?? 0))}</strong></div>
          </div>
          <div className="cksuccess__actions">
            <Link to="/seguimiento" className="btn btn--primary">Seguir mi pedido</Link>
            <a href="#comprobante" className="btn btn--ghost">Descargar comprobante</a>
            <Link to="/" className="btn btn--ghost">Volver a comprar</Link>
          </div>
          <p className="cksuccess__help">¿Necesitas ayuda? <Link to="/ayuda">Contáctanos</Link> o llama al 600 600 0000.</p>
        </div>
      </CheckoutShell>
    )
  }

  if (!lines.length) {
    return (
      <CheckoutShell minimal>
        <div className="empty">
          <h1>No hay productos para pagar</h1>
          <Link to="/" className="btn btn--primary">Ir a comprar</Link>
        </div>
      </CheckoutShell>
    )
  }

  const stepIndex = (id: StepId) => ORDER.indexOf(id) + 1

  // Sección acordeón reutilizable
  const Step = ({ id, title, summary, children }: { id: StepId; title: string; summary?: ReactNode; children: ReactNode }) => {
    const isDone = done.has(id)
    const isOpen = open === id
    const isPending = !isDone && !isOpen
    return (
      <section className={`ckstep ${isOpen ? 'is-open' : ''} ${isDone ? 'is-done' : ''} ${isPending ? 'is-pending' : ''}`}>
        <header className="ckstep__head" onClick={() => { if (isDone) setOpen(id) }}>
          <span className="ckstep__num">{isDone ? <Icon name="check" /> : stepIndex(id)}</span>
          <span className="ckstep__title">{title}</span>
          {isDone && !isOpen && <button className="ckstep__edit" onClick={(e) => { e.stopPropagation(); setOpen(id) }}>Editar</button>}
          {isPending && <span className="ckstep__pend">Pendiente</span>}
        </header>
        {isDone && !isOpen && summary && <div className="ckstep__summary">{summary}</div>}
        {isOpen && <div className="ckstep__body">{children}</div>}
      </section>
    )
  }

  return (
    <CheckoutShell>
      <div className="ckprogress">Paso {stepIndex(open)} de 6 · <strong>{stepTitle(open, delivery)}</strong></div>

      <div className="cklayout">
        <div className="cksteps">

          {/* 1 DATOS */}
          <Step id="datos" title="Tus datos" summary={<>{data.name} {data.lastname} · {data.email}</>}>
            <p className="ckhelp">Primero necesitamos tus datos para enviarte el comprobante y avisarte el estado de tu pedido.</p>
            <div className="buyersel">
              <button className={`buyersel__opt ${buyer === 'persona' ? 'is-active' : ''}`} onClick={() => { setBuyer('persona'); setDoc('boleta') }}>
                <strong>Persona</strong><span>Compra con boleta o factura simple.</span>
              </button>
              <button className={`buyersel__opt ${buyer === 'empresa' ? 'is-active' : ''}`} onClick={() => { setBuyer('empresa'); setDoc('factura') }}>
                <strong>Empresa</strong><span>Factura, cotización, crédito o compra por volumen.</span>
              </button>
            </div>
            {!customer && <p className="ckhelp ckhelp--inline">¿Ya tienes cuenta? <Link to="/ingresar">Inicia sesión</Link> · o continúa como invitado.</p>}
            <div className="formgrid">
              <label>Nombre<input value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder="Tu nombre" /></label>
              <label>Apellido<input value={data.lastname} onChange={(e) => setData({ ...data, lastname: e.target.value })} placeholder="Tu apellido" /></label>
              <label>Correo<input type="email" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="correo@ejemplo.cl" /><small>Usaremos este correo para el comprobante y seguimiento.</small></label>
              <label>Teléfono<input value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="+56 9 1234 5678" /><small>Para contactarte si hay algún problema con la entrega.</small></label>
            </div>
            <button className="btn btn--primary ckstep__next" disabled={!data.name || !data.email.includes('@') || !data.phone} onClick={() => complete('datos')}>Continuar a entrega</button>
          </Step>

          {/* 2 ENTREGA */}
          <Step id="entrega" title="¿Cómo quieres recibir tu compra?" summary={deliveryLabel}>
            <p className="ckhelp">Elige cómo prefieres recibir tu pedido. Te mostraremos costo y fecha antes de pagar.</p>
            {hasBulky && <div className="ckwarn"><Icon name="box" /> Tu pedido tiene productos grandes o pesados: recomendamos <strong>despacho programado</strong>.</div>}
            <div className="delivery-cards">
              <button className={`dcard ${delivery === 'retiro' ? 'is-active' : ''}`} onClick={() => setDelivery('retiro')}>
                <Icon name="store" className="dcard__icon" />
                <strong>Retiro en tienda</strong>
                <span>Retíralo en una tienda Mimbral. Ideal para ahorrar despacho.</span>
                <em className="dcard__cost">Gratis · disponible hoy</em>
              </button>
              <button className={`dcard ${delivery === 'despacho' ? 'is-active' : ''}`} onClick={() => setDelivery('despacho')}>
                <Icon name="truck" className="dcard__icon" />
                <strong>Despacho a domicilio</strong>
                <span>Recíbelo en la dirección que indiques.</span>
                <em className="dcard__cost">{comuna && !noCoverage ? `$4.990 · ${eta}` : 'Desde $4.990'}</em>
              </button>
              <button className={`dcard ${delivery === 'programado' ? 'is-active' : ''}`} onClick={() => setDelivery('programado')}>
                <Icon name="calendar" className="dcard__icon" />
                <strong>Despacho programado</strong>
                <span>Elige una fecha. Recomendado para productos grandes o de obra.</span>
                <em className="dcard__cost">Desde $6.990</em>
              </button>
            </div>
            <button className="btn btn--primary ckstep__next" disabled={!delivery} onClick={() => complete('entrega')}>
              {delivery === 'retiro' ? 'Continuar a elegir tienda' : 'Continuar a dirección'}
            </button>
          </Step>

          {/* 3 DIRECCION / TIENDA */}
          <Step id="direccion" title={delivery === 'retiro' ? 'Elige tu tienda' : 'Dirección de entrega'} summary={delivery === 'retiro' ? STORES.find((s) => s.id === store)?.name : comuna && `${addr.street} ${addr.number}, ${comuna}`}>
            {delivery === 'retiro' ? (
              <>
                <p className="ckhelp">Elige dónde quieres retirar tu compra.</p>
                <div className="storelist">
                  {STORES.map((s) => (
                    <button key={s.id} className={`storeopt ${store === s.id ? 'is-active' : ''}`} onClick={() => setStore(s.id)}>
                      <div className="storeopt__info">
                        <strong>{s.name}</strong>
                        <span className="storeopt__eta"><Icon name="check" /> {s.eta}</span>
                        <span className="muted">{s.addr}</span>
                        <span className="muted">{s.hours}</span>
                      </div>
                      <span className="storeopt__pick">{store === s.id ? 'Seleccionada' : 'Retirar aquí'}</span>
                    </button>
                  ))}
                </div>
                <button className="btn btn--primary ckstep__next" disabled={!store} onClick={() => complete('direccion')}>Continuar a documento</button>
              </>
            ) : (
              <>
                <p className="ckhelp">Indícanos dónde recibir tu compra. Con esto calculamos disponibilidad, costo y fecha.</p>
                <div className="formgrid">
                  <label>Región
                    <select value={region} onChange={(e) => setRegion(e.target.value)}><option value="">Selecciona</option>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select>
                  </label>
                  <label>Comuna
                    <select value={comuna} onChange={(e) => { setComuna(e.target.value); setCalc(true); setTimeout(() => setCalc(false), 700) }}>
                      <option value="">Selecciona</option>{COMUNAS.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <small>Primero elige tu comuna para ver opciones reales de despacho.</small>
                  </label>
                </div>
                {calc && <p className="ckcalc"><span className="spinner spinner--navy" /> Calculando opciones de entrega…</p>}
                {comuna && !calc && noCoverage && (
                  <div className="ckwarn ckwarn--err"><Icon name="close" /> Por ahora no tenemos despacho para esta comuna. Cambia la comuna o elige <button className="link-btn" onClick={() => { setDelivery('retiro'); setOpen('entrega') }}>retiro en tienda</button>.</div>
                )}
                {comuna && !calc && !noCoverage && (
                  <>
                    <div className="ckok"><Icon name="check" /> Despacho disponible · {eta} · {formatCLP(shipping ?? 4990)}</div>
                    {hasBulky && <div className="ckwarn"><Icon name="box" /> Tu pedido podría llegar en 2 entregas porque hay productos de bodegas distintas.</div>}
                    <div className="formgrid">
                      <label className="formgrid__full">Calle<input value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} placeholder="Nombre de la calle" /></label>
                      <label>Número<input value={addr.number} onChange={(e) => setAddr({ ...addr, number: e.target.value })} placeholder="1234" /></label>
                      <label>Depto/casa/oficina (opcional)<input value={addr.extra} onChange={(e) => setAddr({ ...addr, extra: e.target.value })} placeholder="Depto 32" /></label>
                      <label className="formgrid__full">Referencia (opcional)<input value={addr.ref} onChange={(e) => setAddr({ ...addr, ref: e.target.value })} placeholder="Cerca de…" /></label>
                      <label>Quién recibe<input value={addr.receiver} onChange={(e) => setAddr({ ...addr, receiver: e.target.value })} placeholder="Nombre" /></label>
                      <label>Teléfono de contacto<input value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} placeholder="+56 9 …" /></label>
                      {delivery === 'programado' && (
                        <label className="formgrid__full">Fecha de entrega
                          <select value={progDate} onChange={(e) => setProgDate(e.target.value)}><option value="">Elige una fecha</option><option>Mié 1 de julio</option><option>Vie 3 de julio</option><option>Lun 6 de julio</option></select>
                        </label>
                      )}
                    </div>
                  </>
                )}
                <div className="ckstep__nav">
                  <button className="btn btn--ghost" onClick={() => setOpen('entrega')}>Volver a forma de entrega</button>
                  <button className="btn btn--primary" disabled={!comuna || noCoverage || !addr.street || !addr.number || (delivery === 'programado' && !progDate)} onClick={() => complete('direccion')}>Guardar y continuar</button>
                </div>
              </>
            )}
          </Step>

          {/* 4 DOCUMENTO */}
          <Step id="documento" title="Documento de compra" summary={doc === 'factura' ? `Factura · ${fact.razon || 'empresa'}` : 'Boleta'}>
            <p className="ckhelp">Elige el documento que necesitas para esta compra.</p>
            <div className="doc-cards">
              <button className={`dcard dcard--sm ${doc === 'boleta' ? 'is-active' : ''}`} onClick={() => setDoc('boleta')}>
                <strong>Boleta</strong><span>Para compras personales.</span>
              </button>
              <button className={`dcard dcard--sm ${doc === 'factura' ? 'is-active' : ''}`} onClick={() => setDoc('factura')}>
                <strong>Factura</strong><span>Para empresas o compras con RUT empresa.</span>
              </button>
            </div>
            {doc === 'factura' && (
              <div className="formgrid">
                <label>RUT empresa<input value={fact.rut} onChange={(e) => setFact({ ...fact, rut: e.target.value })} placeholder="76.123.456-7" /></label>
                <label>Razón social<input value={fact.razon} onChange={(e) => setFact({ ...fact, razon: e.target.value })} placeholder="Empresa Ltda." /></label>
                <label>Giro<input value={fact.giro} onChange={(e) => setFact({ ...fact, giro: e.target.value })} placeholder="Construcción" /></label>
                <label>Correo de facturación<input value={fact.email} onChange={(e) => setFact({ ...fact, email: e.target.value })} placeholder="facturacion@empresa.cl" /></label>
                <label className="formgrid__full">Dirección tributaria<input value={fact.dir} onChange={(e) => setFact({ ...fact, dir: e.target.value })} placeholder="Calle, número, comuna" /></label>
              </div>
            )}
            <button className="btn btn--primary ckstep__next" disabled={doc === 'factura' && (!fact.rut || !fact.razon)} onClick={() => complete('documento')}>Continuar a pago</button>
          </Step>

          {/* 5 PAGO */}
          <Step id="pago" title="Medio de pago" summary={payment && payLabel(payment)}>
            <p className="ckhelp">Elige cómo pagar. Antes de confirmar podrás revisar el total y todos los datos.</p>
            <div className="paylist">
              <PayOpt id="webpay" cur={payment} set={setPayment} title="Webpay" desc="Pago inmediato con débito o crédito. Tu pedido se confirma automáticamente." icon="card" />
              <PayOpt id="transferencia" cur={payment} set={setPayment} title="Transferencia" desc="Te mostramos los datos bancarios al finalizar. Tu pedido queda pendiente hasta validar el pago." icon="bank" />
              {customer?.type === 'b2b' && <PayOpt id="credito" cur={payment} set={setPayment} title="Línea de crédito empresa" desc={`Usa tu crédito disponible${customer?.creditLine ? ` (${formatCLP((customer.creditLine) - (customer.creditUsed ?? 0))})` : ''} para confirmar el pedido.`} icon="wallet" />}
              {customer?.type === 'b2b' && <PayOpt id="oc" cur={payment} set={setPayment} title="Orden de compra" desc="Adjunta tu OC. Coordinamos el despacho contra factura." icon="doc" />}
            </div>
            <button className="btn btn--primary ckstep__next" disabled={!payment} onClick={() => complete('pago')}>Revisar pedido</button>
          </Step>

          {/* 6 REVISION */}
          <Step id="revision" title="Revisa y confirma">
            <p className="ckhelp">Revisa que todo esté correcto. No se realizará ningún cobro hasta que confirmes.</p>
            <div className="review">
              <ReviewRow title="Tus datos" onEdit={() => setOpen('datos')}>{data.name} {data.lastname}<br />{data.email} · {data.phone}</ReviewRow>
              <ReviewRow title="Entrega" onEdit={() => setOpen('entrega')}>
                {deliveryLabel} · {eta}<br />
                {delivery === 'retiro' ? STORES.find((s) => s.id === store)?.name : `${addr.street} ${addr.number}, ${comuna}`}
              </ReviewRow>
              <ReviewRow title="Documento" onEdit={() => setOpen('documento')}>{doc === 'factura' ? `Factura · ${fact.razon}` : 'Boleta'}</ReviewRow>
              <ReviewRow title="Pago" onEdit={() => setOpen('pago')}>{payLabel(payment)}</ReviewRow>
            </div>
            <button className="btn btn--primary btn--lg ckstep__next" onClick={placeOrder} disabled={processing}>
              {processing ? <><span className="spinner" /> Procesando tu pago…</> : buyer === 'empresa' && payment === 'credito' ? 'Confirmar pedido' : payment === 'transferencia' ? 'Confirmar pedido' : `Pagar ${formatCLP(totals.gross + (shipping ?? 0))}`}
            </button>
            <p className="ckstep__safe"><Icon name="lock" /> Compra protegida · No se cobra nada hasta confirmar.</p>
          </Step>
        </div>

        <div className="cksummary-desk">
          <OrderSummary totals={totals} shipping={shipping} deliveryLabel={deliveryLabel} etaLabel={delivery ? eta : undefined} />
          <Link to="/carro" className="cksummary__back">← Volver al carro</Link>
        </div>
      </div>

      <OrderSummary totals={totals} shipping={shipping} deliveryLabel={deliveryLabel} etaLabel={delivery ? eta : undefined} mobile />
    </CheckoutShell>
  )
}

function CheckoutShell({ children, minimal }: { children: ReactNode; minimal?: boolean }) {
  return (
    <div className="checkout-shell">
      <header className="ckheader">
        <Link to="/" className="brand" aria-label="Mimbral inicio">
          <span className="brand__mark" aria-hidden>
            <svg viewBox="0 0 44 40" width="100%" height="100%"><path d="M7 31 16 9h6L13 31z" fill="#fff" /><path d="M19 31 28 9h6l-9 22z" fill="#fff" /><path d="M31 31 37 16v15z" fill="#e1251b" /></svg>
          </span>
          <span className="brand__text">Mimbral<small className="brand__mts">MTS</small></span>
        </Link>
        <span className="ckheader__safe"><Icon name="lock" /> Compra segura</span>
        <Link to="/ayuda" className="ckheader__help"><Icon name="headset" /> Ayuda</Link>
      </header>
      <main className={`ckmain ${minimal ? 'ckmain--minimal' : ''}`}>{children}</main>
    </div>
  )
}

function ReviewRow({ title, children, onEdit }: { title: string; children: ReactNode; onEdit: () => void }) {
  return (
    <div className="review__row">
      <div><span className="review__label">{title}</span><div className="review__val">{children}</div></div>
      <button className="ckstep__edit" onClick={onEdit}>Editar</button>
    </div>
  )
}

function PayOpt({ id, cur, set, title, desc, icon }: { id: string; cur: string; set: (v: string) => void; title: string; desc: string; icon: 'card' | 'bank' | 'wallet' | 'doc' }) {
  return (
    <button className={`payopt ${cur === id ? 'is-active' : ''}`} onClick={() => set(id)}>
      <span className="payopt__radio" aria-hidden />
      <Icon name={icon} className="payopt__icon" />
      <span className="payopt__body"><strong>{title}</strong><span>{desc}</span></span>
    </button>
  )
}

function payLabel(p: string) {
  return { webpay: 'Webpay', transferencia: 'Transferencia bancaria', credito: 'Línea de crédito empresa', oc: 'Orden de compra', tarjeta: 'Tarjeta' }[p] ?? p
}
function stepTitle(id: StepId, delivery: string) {
  return { datos: 'Tus datos', entrega: 'Entrega', direccion: delivery === 'retiro' ? 'Tienda' : 'Dirección', documento: 'Documento', pago: 'Pago', revision: 'Revisión' }[id]
}
