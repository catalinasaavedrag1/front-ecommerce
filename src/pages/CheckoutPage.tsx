import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import { buildTotals } from '@/utils/cart'
import { formatCLP, formatRut } from '@/utils/format'
import OrderSummary from '@/components/checkout/OrderSummary'
import ProductImage from '@/components/ProductImage'
import Icon from '@/components/Icon'

type StepId = 'datos' | 'entrega' | 'direccion' | 'documento' | 'pago' | 'revision'
const ORDER: StepId[] = ['datos', 'entrega', 'direccion', 'documento', 'pago', 'revision']

const REGIONS = ['Región Metropolitana', 'Región del Maule', 'Región del Biobío', 'Región de Antofagasta']
const COMUNAS = ['Santiago', 'La Florida', 'Maipú', 'Providencia', 'San Javier', 'Concepción', 'Antofagasta', 'Isla de Pascua']
const NO_COVERAGE = ['Isla de Pascua']

// Tiendas para retiro (estilo "Selecciona un punto de entrega")
const PICKUP = [
  { id: 'p1', name: 'Mimbral Santiago Centro', addr: "Av. L. B. O'Higgins 1234, Santiago", km: 3 },
  { id: 'p2', name: 'Mimbral Providencia', addr: 'Av. Providencia 2120, Providencia', km: 6 },
  { id: 'p3', name: 'Mimbral Maipú', addr: 'Av. Pajaritos 2890, Maipú', km: 8 },
  { id: 'p4', name: 'Mimbral La Florida', addr: 'Av. Vicuña Mackenna 7500, La Florida', km: 12 },
]

// ---------- Fechas (estilo "Cambiar fecha") ----------
const DOW = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb']
const DOW_LONG = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
const MON = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
const MON_FULL = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const pad = (n: number) => String(n).padStart(2, '0')

type DateOpt = { date: Date; iso: string }
function genDates(n: number): DateOpt[] {
  const out: DateOpt[] = []
  const base = new Date()
  for (let i = 1; i <= n; i++) {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + i)
    out.push({ date: d, iso: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` })
  }
  return out
}
const chipLabel = (d: Date) => `${cap(DOW[d.getDay()])} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}`
const longLabel = (d: Date) => `${DOW_LONG[d.getDay()]} ${d.getDate()} de ${MON[d.getMonth()]}.`
function rangeLabel(items: DateOpt[]) {
  const a = items[0].date, b = items[items.length - 1].date
  const ma = `${MON_FULL[a.getMonth()]} ${a.getFullYear()}`, mb = `${MON_FULL[b.getMonth()]} ${b.getFullYear()}`
  return ma === mb ? ma : `${ma} - ${mb}`
}

type CartLineT = ReturnType<typeof buildTotals>['lines'][number]
type Group = { id: string; n: number; bulky: boolean; lines: CartLineT[] }
function buildGroups(lines: CartLineT[]): Group[] {
  const normal = lines.filter((l) => !l.product.bulky)
  const bulky = lines.filter((l) => l.product.bulky)
  const groups: Omit<Group, 'n'>[] = []
  if (normal.length) groups.push({ id: 'g-std', bulky: false, lines: normal })
  if (bulky.length) groups.push({ id: 'g-bulky', bulky: true, lines: bulky })
  if (!groups.length) groups.push({ id: 'g-all', bulky: false, lines })
  return groups.map((g, i) => ({ ...g, n: i + 1 }))
}
type Sel = { method: 'retiro' | 'domicilio'; storeId: string; dateIso: string }

export default function CheckoutPage() {
  const { mode, customer } = useApp()
  const { lines, clear } = useCart()
  const totals = buildTotals(lines, mode, customer)
  const hasBulky = totals.lines.some((l) => l.product.bulky)

  const dates = genDates(10)
  const groups = buildGroups(totals.lines)
  const dateObj = (iso: string) => dates.find((d) => d.iso === iso)?.date ?? dates[0].date
  const groupCost = (g: Group, s: Sel) => (s.method === 'retiro' ? 0 : g.bulky ? 24990 : 4990)

  const [buyer, setBuyer] = useState<'persona' | 'empresa'>(mode === 'b2b' ? 'empresa' : 'persona')
  const [data, setData] = useState({ name: customer?.name?.split(' ')[0] ?? '', lastname: '', email: customer?.email ?? '', phone: '' })
  const [groupSel, setGroupSel] = useState<Record<string, Sel>>(() => {
    const init: Record<string, Sel> = {}
    for (const g of groups) init[g.id] = { method: 'domicilio', storeId: PICKUP[0].id, dateIso: dates[0].iso }
    return init
  })
  const selFor = (id: string): Sel => groupSel[id] ?? { method: 'domicilio', storeId: PICKUP[0].id, dateIso: dates[0].iso }
  const setSel = (id: string, patch: Partial<Sel>) => setGroupSel((p) => ({ ...p, [id]: { ...selFor(id), ...patch } }))

  const [region, setRegion] = useState('')
  const [comuna, setComuna] = useState('')
  const [addr, setAddr] = useState({ street: '', number: '', extra: '', ref: '', receiver: '', phone: '' })
  const [doc, setDoc] = useState<'boleta' | 'factura'>(mode === 'b2b' ? 'factura' : 'boleta')
  const [fact, setFact] = useState({ rut: customer?.rut ? formatRut(customer.rut) : '', razon: customer?.company ?? '', giro: '', dir: '', email: '' })
  const [payment, setPayment] = useState('')
  const [open, setOpen] = useState<StepId>('datos')
  const [done, setDone] = useState<Set<StepId>>(new Set())
  const [calc, setCalc] = useState(false)
  const [placed, setPlaced] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  // Bottom sheets
  const [dateSheet, setDateSheet] = useState<string | null>(null)
  const [storeSheet, setStoreSheet] = useState<string | null>(null)

  const anyDomicilio = groups.some((g) => selFor(g.id).method === 'domicilio')
  const anyRetiro = groups.some((g) => selFor(g.id).method === 'retiro')
  const allRetiro = !anyDomicilio
  const delivery: 'retiro' | 'despacho' = allRetiro ? 'retiro' : 'despacho'
  const noCoverage = anyDomicilio && comuna !== '' && NO_COVERAGE.includes(comuna)
  const shipping = noCoverage ? null : groups.reduce((s, g) => s + groupCost(g, selFor(g.id)), 0)
  const deliveryLabel = allRetiro ? 'Retiro en tienda' : anyRetiro ? 'Entrega mixta' : 'Despacho a domicilio'
  const firstDom = groups.find((g) => selFor(g.id).method === 'domicilio')
  const eta = firstDom ? `Llega el ${longLabel(dateObj(selFor(firstDom.id).dateIso))}` : 'Retiro en tienda'

  const completeEntrega = () => {
    setDone((p) => { const n = new Set(p).add('entrega'); if (allRetiro) n.add('direccion'); return n })
    setOpen(allRetiro ? 'documento' : 'direccion')
  }
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
            <h3><Icon name={allRetiro ? 'store' : 'truck'} /> {deliveryLabel}</h3>
            {groups.map((g) => {
              const s = selFor(g.id)
              return (
                <p key={g.id} className="muted">
                  Entrega {g.n}: {s.method === 'retiro'
                    ? `Retiro en ${PICKUP.find((p) => p.id === s.storeId)?.name}`
                    : `${longLabel(dateObj(s.dateIso))} · ${addr.street ? `${addr.street} ${addr.number}, ${comuna}` : comuna || 'tu dirección'}`}
                </p>
              )
            })}
            {allRetiro && <p className="cksuccess__bring"><Icon name="user" /> Lleva tu carnet de identidad y el número de pedido.</p>}
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

          {/* 2 ENTREGA — estilo "Elige un tipo de entrega" */}
          <Step id="entrega" title="Elige un tipo de entrega" summary={<>{deliveryLabel} · {groups.length} {groups.length === 1 ? 'entrega' : 'entregas'}</>}>
            <p className="ckhelp">Elige cómo recibir cada grupo de productos. Te mostramos costo y fecha antes de pagar.</p>
            {anyDomicilio && (
              <button className="dl-addr" onClick={() => setOpen('direccion')}>
                <Icon name="pin" />
                <span>{addr.street ? `${addr.street} ${addr.number}, ${comuna}` : 'Agrega tu dirección de entrega'}</span>
                <Icon name="chevron" className="dl-addr__chev" />
              </button>
            )}
            {hasBulky && <div className="ckwarn"><Icon name="box" /> Tu pedido tiene productos grandes o pesados: pueden llegar en una entrega aparte.</div>}

            <div className="dl-groups">
              {groups.map((g) => {
                const s = selFor(g.id)
                const cost = groupCost(g, s)
                return (
                  <div className="dl-group" key={g.id}>
                    <div className="dl-group__head">
                      <strong>Entrega {g.n}</strong>
                      <div className="dl-thumbs">
                        {g.lines.slice(0, 4).map((l) => (
                          <ProductImage key={l.product.id} product={l.product} className="dl-thumb" />
                        ))}
                        {g.lines.length > 4 && <span className="dl-thumbs__more">+{g.lines.length - 4}</span>}
                      </div>
                    </div>

                    {/* Retiro en tienda */}
                    <div className="dl-method">
                      <div className="dl-method__title"><Icon name="store" /> Retiro en tienda</div>
                      {PICKUP.slice(0, 2).map((st) => {
                        const active = s.method === 'retiro' && s.storeId === st.id
                        return (
                          <div key={st.id} role="button" tabIndex={0} className={`dl-opt ${active ? 'is-active' : ''}`} onClick={() => setSel(g.id, { method: 'retiro', storeId: st.id })}>
                            <span className="dl-radio" aria-hidden />
                            <span className="dl-opt__info">
                              <strong className="dl-opt__when">Retira mañana, {chipLabel(dates[0].date).split(' ')[1]}</strong>
                              <span className="muted">En {st.name} ({st.km} km)</span>
                            </span>
                            <span className="dl-opt__price dl-opt__price--free">Gratis</span>
                          </div>
                        )
                      })}
                      <div className="dl-method__links">
                        <button className="link-btn" onClick={() => setStoreSheet(g.id)}>Más opciones</button>
                        <span className="dl-sep" />
                        <button className="link-btn">¿Retira alguien más?</button>
                      </div>
                    </div>

                    {/* Envío a domicilio */}
                    <div className="dl-method">
                      <div className="dl-method__title"><Icon name="truck" /> Envío a domicilio</div>
                      <div role="button" tabIndex={0} className={`dl-opt ${s.method === 'domicilio' ? 'is-active' : ''}`} onClick={() => setSel(g.id, { method: 'domicilio' })}>
                        <span className="dl-radio" aria-hidden />
                        <span className="dl-opt__info">
                          <strong className="dl-opt__when">Llega el {longLabel(dateObj(s.dateIso))}</strong>
                          <span className="muted">De 9 a 21 h</span>
                          <button className="link-btn dl-opt__change" onClick={(e) => { e.stopPropagation(); setSel(g.id, { method: 'domicilio' }); setDateSheet(g.id) }}>Cambiar fecha</button>
                        </span>
                        <span className="dl-opt__price">{formatCLP(cost)}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <button className="btn btn--primary ckstep__next" onClick={completeEntrega}>
              {allRetiro ? 'Continuar a documento' : 'Continuar a dirección'}
            </button>
          </Step>

          {/* 3 DIRECCION */}
          <Step id="direccion" title="Dirección de entrega" summary={allRetiro ? 'No requiere dirección · retiro en tienda' : comuna && `${addr.street} ${addr.number}, ${comuna}`}>
            {allRetiro ? (
              <>
                <p className="ckhelp">Elegiste retiro en tienda en todas tus entregas, así que no necesitamos una dirección.</p>
                <button className="btn btn--primary ckstep__next" onClick={() => complete('direccion')}>Continuar a documento</button>
              </>
            ) : (
              <>
                <p className="ckhelp">Indícanos dónde recibir tus entregas a domicilio. Con esto confirmamos cobertura y la fecha.</p>
                <div className="formgrid">
                  <label>Región
                    <select value={region} onChange={(e) => setRegion(e.target.value)}><option value="">Selecciona</option>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select>
                  </label>
                  <label>Comuna
                    <select value={comuna} onChange={(e) => { setComuna(e.target.value); setCalc(true); setTimeout(() => setCalc(false), 700) }}>
                      <option value="">Selecciona</option>{COMUNAS.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <small>Primero elige tu comuna para confirmar cobertura de despacho.</small>
                  </label>
                </div>
                {calc && <p className="ckcalc"><span className="spinner spinner--navy" /> Confirmando cobertura de despacho…</p>}
                {comuna && !calc && noCoverage && (
                  <div className="ckwarn ckwarn--err"><Icon name="close" /> Por ahora no tenemos despacho para esta comuna. Cambia la comuna o elige <button className="link-btn" onClick={() => setOpen('entrega')}>retiro en tienda</button>.</div>
                )}
                {comuna && !calc && !noCoverage && (
                  <>
                    <div className="ckok"><Icon name="check" /> Despacho disponible · {eta}</div>
                    <div className="formgrid">
                      <label className="formgrid__full">Calle<input value={addr.street} onChange={(e) => setAddr({ ...addr, street: e.target.value })} placeholder="Nombre de la calle" /></label>
                      <label>Número<input value={addr.number} onChange={(e) => setAddr({ ...addr, number: e.target.value })} placeholder="1234" /></label>
                      <label>Depto/casa/oficina (opcional)<input value={addr.extra} onChange={(e) => setAddr({ ...addr, extra: e.target.value })} placeholder="Depto 32" /></label>
                      <label className="formgrid__full">Referencia (opcional)<input value={addr.ref} onChange={(e) => setAddr({ ...addr, ref: e.target.value })} placeholder="Cerca de…" /></label>
                      <label>Quién recibe<input value={addr.receiver} onChange={(e) => setAddr({ ...addr, receiver: e.target.value })} placeholder="Nombre" /></label>
                      <label>Teléfono de contacto<input value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} placeholder="+56 9 …" /></label>
                    </div>
                  </>
                )}
                <div className="ckstep__nav">
                  <button className="btn btn--ghost" onClick={() => setOpen('entrega')}>Volver a entrega</button>
                  <button className="btn btn--primary" disabled={!comuna || noCoverage || !addr.street || !addr.number} onClick={() => complete('direccion')}>Guardar y continuar</button>
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
                {groups.map((g) => {
                  const s = selFor(g.id)
                  return (
                    <div key={g.id}>
                      <strong>Entrega {g.n}:</strong>{' '}
                      {s.method === 'retiro'
                        ? `Retiro en ${PICKUP.find((p) => p.id === s.storeId)?.name} · Gratis`
                        : `${longLabel(dateObj(s.dateIso))} · ${formatCLP(groupCost(g, s))}`}
                    </div>
                  )
                })}
                {anyDomicilio && comuna && <div className="muted">{addr.street} {addr.number}, {comuna}</div>}
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
          <OrderSummary totals={totals} shipping={shipping} deliveryLabel={deliveryLabel} etaLabel={eta} />
          <Link to="/carro" className="cksummary__back">← Volver al carro</Link>
        </div>
      </div>

      <OrderSummary totals={totals} shipping={shipping} deliveryLabel={deliveryLabel} etaLabel={eta} mobile />

      {/* ---------- Bottom sheet: Cambiar fecha ---------- */}
      {dateSheet && (() => {
        const g = groups.find((x) => x.id === dateSheet)!
        const s = selFor(g.id)
        const cost = g.bulky ? 24990 : 4990
        const [draft, setDraft] = [s.dateIso, (iso: string) => setSel(g.id, { dateIso: iso })]
        return (
          <Sheet title="Cambiar fecha" onClose={() => setDateSheet(null)}>
            <div className="sheet__lead">
              <div><strong>Llega el {longLabel(dateObj(s.dateIso))}</strong><span className="muted">De 9 a 21 h</span></div>
              <strong className="sheet__lead-price">{formatCLP(cost)}</strong>
            </div>
            <p className="sheet__q">¿En qué fecha quieres recibir tu despacho?</p>
            <div className="sheet__monthrow">
              <strong>{rangeLabel(dates)}</strong>
              <span className="sheet__monthnav"><Icon name="chevron" className="ic--flip" /><Icon name="chevron" /></span>
            </div>
            <div className="datechips">
              {dates.map((d) => (
                <button key={d.iso} className={`datechip ${draft === d.iso ? 'is-active' : ''}`} onClick={() => setDraft(d.iso)}>
                  <strong>{chipLabel(d.date)}</strong>
                  <span>{formatCLP(cost)}</span>
                </button>
              ))}
            </div>
            <button className="btn btn--dark sheet__cta" onClick={() => setDateSheet(null)}>Seleccionar</button>
          </Sheet>
        )
      })()}

      {/* ---------- Bottom sheet: Selecciona un punto de entrega ---------- */}
      {storeSheet && (() => {
        const g = groups.find((x) => x.id === storeSheet)!
        const s = selFor(g.id)
        return (
          <Sheet title="Selecciona un punto de entrega" onClose={() => setStoreSheet(null)}>
            <div className="dl-map" aria-hidden>
              <span className="dl-map__pin dl-map__pin--a"><Icon name="store" /></span>
              <span className="dl-map__pin dl-map__pin--b"><Icon name="store" /></span>
              <span className="dl-map__label">Talca</span>
            </div>
            <div className="ckwarn ckwarn--soft"><Icon name="clock" /> Recuerda que tienes hasta <strong>7 días calendario</strong> para retirar tu pedido en el lugar seleccionado.</div>
            <p className="sheet__q">Puntos de entrega ({PICKUP.length})</p>
            <div className="dl-points">
              {PICKUP.map((st) => {
                const active = s.method === 'retiro' && s.storeId === st.id
                return (
                  <button key={st.id} className={`dl-point ${active ? 'is-active' : ''}`} onClick={() => setSel(g.id, { method: 'retiro', storeId: st.id })}>
                    <span className="dl-radio" aria-hidden />
                    <span className="dl-point__day"><strong>Mañana</strong><span>{chipLabel(dates[0].date).split(' ')[1]}</span></span>
                    <span className="dl-point__info"><strong>{st.name} <em>({st.km} km)</em></strong><span className="muted">{st.addr}</span></span>
                    <span className="dl-opt__price dl-opt__price--free">Gratis</span>
                  </button>
                )
              })}
            </div>
            <button className="btn btn--dark sheet__cta" onClick={() => setStoreSheet(null)}>Continuar</button>
          </Sheet>
        )
      })()}
    </CheckoutShell>
  )
}

function Sheet({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <div className="sheet__bar" />
        <header className="sheet__head">
          <span className="sheet__title">{title}</span>
          <button className="sheet__close" onClick={onClose} aria-label="Cerrar"><Icon name="close" /></button>
        </header>
        <div className="sheet__body">{children}</div>
      </div>
    </div>
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
  return { datos: 'Tus datos', entrega: 'Entrega', direccion: delivery === 'retiro' ? 'Dirección' : 'Dirección', documento: 'Documento', pago: 'Pago', revision: 'Revisión' }[id]
}
