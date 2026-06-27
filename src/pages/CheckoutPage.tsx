import { useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import { buildTotals } from '@/utils/cart'
import { formatCLP, formatRut } from '@/utils/format'
import OrderSummary from '@/components/checkout/OrderSummary'
import ProductImage from '@/components/ProductImage'
import Icon, { type IconName } from '@/components/Icon'

type StepId = 'datos' | 'entrega' | 'direccion' | 'pago' | 'revision'
const ORDER: StepId[] = ['datos', 'entrega', 'direccion', 'pago', 'revision']

const REGIONS = ['Región Metropolitana', 'Región del Maule', 'Región del Biobío', 'Región de Antofagasta']
const COMUNAS = ['Santiago', 'La Florida', 'Maipú', 'Providencia', 'San Javier', 'Concepción', 'Antofagasta', 'Isla de Pascua']
const NO_COVERAGE = ['Isla de Pascua']
const GIROS = ['Construcción', 'Comercio', 'Servicios', 'Industria', 'Transporte', 'Agrícola y forestal', 'Otro']

// Tiendas para retiro
const PICKUP = [
  { id: 'p1', name: 'Mimbral Santiago Centro', addr: "Av. L. B. O'Higgins 1234, Santiago", km: 3 },
  { id: 'p2', name: 'Mimbral Providencia', addr: 'Av. Providencia 2120, Providencia', km: 6 },
  { id: 'p3', name: 'Mimbral Maipú', addr: 'Av. Pajaritos 2890, Maipú', km: 8 },
  { id: 'p4', name: 'Mimbral La Florida', addr: 'Av. Vicuña Mackenna 7500, La Florida', km: 12 },
]

// Tipos de tarjeta para "Agregar tarjeta"
type CardType = { id: string; label: string; desc?: string; brand: string; tone: string; loyalty?: boolean }
const CARD_TYPES: CardType[] = [
  { id: 'mimbral', label: 'Tarjeta Mimbral', desc: '9% dcto.', brand: 'MIM', tone: 'mim', loyalty: true },
  { id: 'credito', label: 'Tarjeta de crédito', brand: 'CRÉD', tone: 'credit' },
  { id: 'debito', label: 'Tarjeta de débito', brand: 'DÉB', tone: 'debit' },
  { id: 'prepago', label: 'Tarjeta de prepago', brand: 'PRE', tone: 'prepaid' },
]
type Card = { id: string; brand: string; kind: string; last4: string; fav: boolean; loyalty?: boolean }
const MONTHS_NUM = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'))

// ---------- Fechas ----------
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
// Validación de RUT básica (formato/cuerpo)
function isValidRut(raw: string) {
  const clean = raw.replace(/[.\-\s]/g, '').toUpperCase()
  if (clean.length < 8) return false
  const body = clean.slice(0, -1), dv = clean.slice(-1)
  if (!/^\d+$/.test(body)) return false
  let sum = 0, mul = 2
  for (let i = body.length - 1; i >= 0; i--) { sum += Number(body[i]) * mul; mul = mul === 7 ? 2 : mul + 1 }
  const res = 11 - (sum % 11)
  const calc = res === 11 ? '0' : res === 10 ? 'K' : String(res)
  return calc === dv
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

  // Pago
  const [cards, setCards] = useState<Card[]>([{ id: 'c1', brand: 'VISA', kind: 'Débito', last4: '5953', fav: true }])
  const [payCard, setPayCard] = useState('c1')
  const [payment, setPayment] = useState<string>('tarjeta')
  const [coupon, setCoupon] = useState<{ code: string; applied: boolean }>({ code: '', applied: false })
  const [couponInput, setCouponInput] = useState('')
  const [couponErr, setCouponErr] = useState(false)
  const [acceptPuntos, setAcceptPuntos] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [doc, setDoc] = useState<'boleta' | 'factura'>(mode === 'b2b' ? 'factura' : 'boleta')
  const [fact, setFact] = useState({ rut: customer?.rut ? formatRut(customer.rut) : '', razon: customer?.company ?? '', giro: '', dir: '', region: '', comuna: '', contacto: '', celular: '', correo: '' })
  const [cardForm, setCardForm] = useState<CardType | null>(null)
  const [cardData, setCardData] = useState({ number: '', month: '', year: '', cvv: '' })
  const YEARS = Array.from({ length: 9 }, (_, i) => String(new Date().getFullYear() + i))

  const [open, setOpen] = useState<StepId>('datos')
  const [done, setDone] = useState<Set<StepId>>(new Set())
  const [calc, setCalc] = useState(false)
  const [placed, setPlaced] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  // Bottom sheets
  const [dateSheet, setDateSheet] = useState<string | null>(null)
  const [storeSheet, setStoreSheet] = useState<string | null>(null)
  const [cardSheet, setCardSheet] = useState(false)
  const [couponSheet, setCouponSheet] = useState(false)
  const [factSheet, setFactSheet] = useState(false)

  const anyDomicilio = groups.some((g) => selFor(g.id).method === 'domicilio')
  const anyRetiro = groups.some((g) => selFor(g.id).method === 'retiro')
  const allRetiro = !anyDomicilio
  const noCoverage = anyDomicilio && comuna !== '' && NO_COVERAGE.includes(comuna)
  const shipping = noCoverage ? null : groups.reduce((s, g) => s + groupCost(g, selFor(g.id)), 0)
  const deliveryLabel = allRetiro ? 'Retiro en tienda' : anyRetiro ? 'Entrega mixta' : 'Despacho a domicilio'
  const firstDom = groups.find((g) => selFor(g.id).method === 'domicilio')
  const eta = firstDom ? `Llega el ${longLabel(dateObj(selFor(firstDom.id).dateIso))}` : 'Retiro en tienda'

  const selectedCard = cards.find((c) => c.id === payCard)
  const usingCard = payment === 'tarjeta'
  const loyaltyDisc = usingCard && selectedCard?.loyalty ? Math.round(totals.gross * 0.09) : 0
  const couponDisc = coupon.applied ? Math.round(totals.gross * 0.1) : 0
  const discount = loyaltyDisc + couponDisc
  const discountLabel = loyaltyDisc && couponDisc ? 'Descuentos' : loyaltyDisc ? 'Con Tarjeta Mimbral' : couponDisc ? `Cupón ${coupon.code}` : undefined
  const grandTotal = totals.gross + (shipping ?? 0) - discount

  const completeEntrega = () => {
    setDone((p) => { const n = new Set(p).add('entrega'); if (allRetiro) n.add('direccion'); return n })
    setOpen(allRetiro ? 'pago' : 'direccion')
  }
  const complete = (id: StepId) => {
    setDone((p) => new Set(p).add(id))
    const next = ORDER[ORDER.indexOf(id) + 1]
    if (next) setOpen(next)
  }
  const addCard = (t: CardType, last4: string) => {
    const id = `c${cards.length + 1}`
    setCards((prev) => [...prev, { id, brand: t.brand, kind: t.label.replace('Tarjeta de ', '').replace('Tarjeta ', ''), last4, fav: false, loyalty: t.loyalty }])
    setPayCard(id); setPayment('tarjeta')
  }
  const cardDigits = cardData.number.replace(/\D/g, '')
  const cardValid = cardDigits.length >= 13 && !!cardData.month && !!cardData.year && cardData.cvv.length >= 3
  const useCard = () => {
    if (!cardForm || !cardValid) return
    addCard(cardForm, cardDigits.slice(-4))
    setCardData({ number: '', month: '', year: '', cvv: '' })
    setCardForm(null); setCardSheet(false)
  }
  const removeCard = (id: string) => {
    setCards((prev) => prev.filter((c) => c.id !== id))
    if (payCard === id) { const rest = cards.filter((c) => c.id !== id); setPayCard(rest[0]?.id ?? ''); if (!rest.length) setPayment('') }
  }
  const applyCoupon = () => {
    const code = couponInput.trim().toUpperCase()
    if (code.length >= 4) { setCoupon({ code, applied: true }); setCouponErr(false); setCouponSheet(false) }
    else setCouponErr(true)
  }
  const saveFact = () => {
    if (!isValidRut(fact.rut) || !fact.razon) return
    setDoc('factura'); setFactSheet(false)
  }

  const placeOrder = () => {
    if (processing) return
    setProcessing(true)
    const n = `MIM-${Math.floor(100000 + (totals.gross % 900000))}`
    setTimeout(() => { setPlaced(n); clear() }, 1100)
  }

  // ---------- Confirmación ----------
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
            <div className="cksuccess__pay"><span>{doc === 'factura' ? 'Factura' : 'Boleta'}</span><span>·</span><span>{payDesc(payment, selectedCard)}</span><span>·</span><strong>{formatCLP(grandTotal)}</strong></div>
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
      <div className="ckprogress">Paso {stepIndex(open)} de {ORDER.length} · <strong>{stepTitle(open)}</strong></div>

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
                        {g.lines.slice(0, 4).map((l) => (<ProductImage key={l.product.id} product={l.product} className="dl-thumb" />))}
                        {g.lines.length > 4 && <span className="dl-thumbs__more">+{g.lines.length - 4}</span>}
                      </div>
                    </div>
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
              {allRetiro ? 'Continuar a pago' : 'Continuar a dirección'}
            </button>
          </Step>

          {/* 3 DIRECCION */}
          <Step id="direccion" title="Dirección de entrega" summary={allRetiro ? 'No requiere dirección · retiro en tienda' : comuna && `${addr.street} ${addr.number}, ${comuna}`}>
            {allRetiro ? (
              <>
                <p className="ckhelp">Elegiste retiro en tienda en todas tus entregas, así que no necesitamos una dirección.</p>
                <button className="btn btn--primary ckstep__next" onClick={() => complete('direccion')}>Continuar a pago</button>
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

          {/* 4 PAGO — estilo "Elige un medio de pago" */}
          <Step id="pago" title="Elige un medio de pago" summary={payment ? payDesc(payment, selectedCard) : undefined}>
            <h3 className="paysec__title">Tarjetas guardadas</h3>
            <div className="savedcards">
              {cards.map((c) => (
                <div key={c.id} role="button" tabIndex={0} className={`savedcard ${usingCard && payCard === c.id ? 'is-active' : ''}`} onClick={() => { setPayCard(c.id); setPayment('tarjeta') }}>
                  <span className={`cardbrand cardbrand--${c.loyalty ? 'mim' : 'visa'}`}>{c.brand}</span>
                  <span className="savedcard__label">{c.kind} <span className="cardmask">**** {c.last4}</span></span>
                  {c.fav && <Icon name="heart" filled className="savedcard__fav" />}
                  <button className="savedcard__x" aria-label="Eliminar" onClick={(e) => { e.stopPropagation(); removeCard(c.id) }}><Icon name="close" /></button>
                </div>
              ))}
              {!cards.length && <p className="ckhelp">Aún no tienes tarjetas guardadas.</p>}
            </div>
            <button className="btn btn--ghost btn--block paysec__add" onClick={() => setCardSheet(true)}>Agregar tarjeta</button>

            <div className="payprompt">
              <span>¿Tienes un cupón?</span>
              {coupon.applied ? (
                <span className="payprompt__done"><span className="chip-ok"><Icon name="check" /> {coupon.code}</span><button className="link-btn" onClick={() => setCoupon({ code: '', applied: false })}>Quitar</button></span>
              ) : (
                <button className="btn btn--ghost btn--xs" onClick={() => setCouponSheet(true)}>Agregar</button>
              )}
            </div>

            <div className="payprompt">
              <span>¿Necesitas factura?</span>
              {doc === 'factura' ? (
                <span className="payprompt__done"><span className="chip-ok"><Icon name="check" /> {fact.razon || 'Factura'}</span><button className="link-btn" onClick={() => setFactSheet(true)}>Editar</button></span>
              ) : (
                <button className="btn btn--ghost btn--xs" onClick={() => setFactSheet(true)}>Solicitar</button>
              )}
            </div>

            <div className="ckinfo"><Icon name="doc" /> Los términos y condiciones del sitio fueron actualizados recientemente.</div>

            <div className="consent">
              <label className="switchrow">
                <span>Acepto ser parte del <strong>Programa Mimbral Puntos</strong> y recibir comunicaciones según la Política de Privacidad.</span>
                <button type="button" role="switch" aria-checked={acceptPuntos} className={`switch ${acceptPuntos ? 'is-on' : ''}`} onClick={() => setAcceptPuntos((v) => !v)}><span /></button>
              </label>
              <label className="switchrow">
                <span>He leído y acepto los <strong>Términos y Condiciones</strong> de compra.</span>
                <button type="button" role="switch" aria-checked={acceptTerms} className={`switch ${acceptTerms ? 'is-on' : ''}`} onClick={() => setAcceptTerms((v) => !v)}><span /></button>
              </label>
            </div>

            <details className="payother">
              <summary>Otros medios de pago</summary>
              <div className="paylist">
                <PayOpt id="transferencia" cur={payment} set={(v) => setPayment(v)} title="Transferencia" desc="Te mostramos los datos bancarios al finalizar. Tu pedido queda pendiente hasta validar el pago." icon="bank" />
                {customer?.type === 'b2b' && <PayOpt id="credito" cur={payment} set={(v) => setPayment(v)} title="Línea de crédito empresa" desc={`Usa tu crédito disponible${customer?.creditLine ? ` (${formatCLP((customer.creditLine) - (customer.creditUsed ?? 0))})` : ''}.`} icon="wallet" />}
                {customer?.type === 'b2b' && <PayOpt id="oc" cur={payment} set={(v) => setPayment(v)} title="Orden de compra" desc="Adjunta tu OC. Coordinamos el despacho contra factura." icon="doc" />}
              </div>
            </details>

            <button className="btn btn--primary ckstep__next" disabled={!payment || (usingCard && !payCard) || !acceptTerms} onClick={() => complete('pago')}>
              {acceptTerms ? 'Revisar pedido' : 'Acepta los términos para continuar'}
            </button>
          </Step>

          {/* 5 REVISION */}
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
              <ReviewRow title="Medio de pago" onEdit={() => setOpen('pago')}>
                {payDesc(payment, selectedCard)}
                <div className="muted">{doc === 'factura' ? `Factura · ${fact.razon || 'empresa'}` : 'Boleta'}{discount > 0 ? ` · ${discountLabel}: -${formatCLP(discount)}` : ''}</div>
              </ReviewRow>
            </div>
            <button className="btn btn--primary btn--lg ckstep__next" onClick={placeOrder} disabled={processing}>
              {processing ? <><span className="spinner" /> Procesando tu pago…</> : payment === 'transferencia' || payment === 'credito' ? 'Confirmar pedido' : `Pagar ${formatCLP(grandTotal)}`}
            </button>
            <p className="ckstep__safe"><Icon name="lock" /> Compra protegida · No se cobra nada hasta confirmar.</p>
          </Step>
        </div>

        <div className="cksummary-desk">
          <OrderSummary totals={totals} shipping={shipping} deliveryLabel={deliveryLabel} etaLabel={eta} discount={discount} discountLabel={discountLabel} />
          <Link to="/carro" className="cksummary__back">← Volver al carro</Link>
        </div>
      </div>

      <OrderSummary totals={totals} shipping={shipping} deliveryLabel={deliveryLabel} etaLabel={eta} discount={discount} discountLabel={discountLabel} mobile />

      {/* ---------- Sheet: Cambiar fecha ---------- */}
      {dateSheet && (() => {
        const g = groups.find((x) => x.id === dateSheet)!
        const s = selFor(g.id)
        const cost = g.bulky ? 24990 : 4990
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
                <button key={d.iso} className={`datechip ${s.dateIso === d.iso ? 'is-active' : ''}`} onClick={() => setSel(g.id, { dateIso: d.iso })}>
                  <strong>{chipLabel(d.date)}</strong><span>{formatCLP(cost)}</span>
                </button>
              ))}
            </div>
            <button className="btn btn--dark sheet__cta" onClick={() => setDateSheet(null)}>Seleccionar</button>
          </Sheet>
        )
      })()}

      {/* ---------- Sheet: Selecciona un punto de entrega ---------- */}
      {storeSheet && (() => {
        const g = groups.find((x) => x.id === storeSheet)!
        const s = selFor(g.id)
        return (
          <Sheet title="Selecciona un punto de entrega" onClose={() => setStoreSheet(null)}>
            <div className="dl-map" aria-hidden>
              <span className="dl-map__pin dl-map__pin--a"><Icon name="store" /></span>
              <span className="dl-map__pin dl-map__pin--b"><Icon name="store" /></span>
              <span className="dl-map__label">Santiago</span>
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

      {/* ---------- Sheet: Agregar tarjeta ---------- */}
      {cardSheet && (
        <Sheet title="Agregar tarjeta" onClose={() => setCardSheet(false)}>
          <div className="cardtypes">
            {CARD_TYPES.map((t) => (
              <button key={t.id} className="cardtype" onClick={() => setCardForm(t)}>
                <span className={`cardbrand cardbrand--${t.tone}`}>{t.brand}</span>
                <span className="cardtype__label">{t.label}{t.desc && <em className="cardtype__disc">{t.desc}</em>}</span>
                <Icon name="chevron" className="cardtype__chev" />
              </button>
            ))}
          </div>
        </Sheet>
      )}

      {/* ---------- Sheet: formulario de tarjeta ---------- */}
      {cardForm && (
        <Sheet title={cardForm.label} icon="card" onClose={() => setCardForm(null)}>
          <p className="cardform__sub">Paga con tu {cardForm.label.toLowerCase()}{cardForm.desc ? ` y obtén ${cardForm.desc}` : ''}</p>
          <div className="cardform">
            <div className="cardbox">
              <input value={cardData.number} onChange={(e) => setCardData({ ...cardData, number: e.target.value.replace(/[^\d ]/g, '').slice(0, 19) })} placeholder={`Número de ${cardForm.label.toLowerCase()}`} inputMode="numeric" />
            </div>
            <div className="cardbox">
              <select value={cardData.month} onChange={(e) => setCardData({ ...cardData, month: e.target.value })}>
                <option value="">Mes de vencimiento</option>{MONTHS_NUM.map((m) => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div className="cardbox">
              <select value={cardData.year} onChange={(e) => setCardData({ ...cardData, year: e.target.value })}>
                <option value="">Año de vencimiento</option>{YEARS.map((y) => <option key={y}>{y}</option>)}
              </select>
            </div>
            <div className="cardbox cardbox--cvv">
              <input value={cardData.cvv} onChange={(e) => setCardData({ ...cardData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} placeholder="CVV" inputMode="numeric" />
              <span className="cardbox__cvvic"><Icon name="card" /></span>
            </div>
          </div>
          <button className="btn btn--dark sheet__cta" disabled={!cardValid} onClick={useCard}>Usar esta tarjeta</button>
          <p className="cardform__note">Para validar tu tarjeta, es posible se haga un cargo que luego será reversado.</p>
        </Sheet>
      )}

      {/* ---------- Sheet: ¿Tienes un cupón? ---------- */}
      {couponSheet && (
        <Sheet title="¿Tienes un cupón?" icon="tag" onClose={() => setCouponSheet(false)}>
          <label className="sheet__field">
            <span>Ingresa un código de cupón</span>
            <div className="sheet__input">
              <input value={couponInput} onChange={(e) => { setCouponInput(e.target.value); setCouponErr(false) }} placeholder="Código del cupón" autoFocus />
              {couponInput && <button className="sheet__clear" onClick={() => setCouponInput('')} aria-label="Limpiar"><Icon name="close" /></button>}
            </div>
            {couponErr && <small className="field-err">Ingresa un código válido (mínimo 4 caracteres).</small>}
          </label>
          <button className="btn btn--dark sheet__cta" onClick={applyCoupon}>Aplicar cupón</button>
        </Sheet>
      )}

      {/* ---------- Sheet: Datos de facturación ---------- */}
      {factSheet && (
        <Sheet title="Datos de facturación" icon="doc" onClose={() => setFactSheet(false)}>
          <label className="sheet__field">
            <span>RUT de la Empresa</span>
            <div className="sheet__input"><input value={fact.rut} onChange={(e) => setFact({ ...fact, rut: e.target.value })} placeholder="Ingresa el RUT de la Empresa" className={fact.rut && !isValidRut(fact.rut) ? 'is-err' : ''} /></div>
            {fact.rut && !isValidRut(fact.rut) && <small className="field-err">Ingresa un rut válido</small>}
          </label>
          <label className="sheet__field"><span>Razón social</span><div className="sheet__input"><input value={fact.razon} onChange={(e) => setFact({ ...fact, razon: e.target.value })} placeholder="Ingresa la Razón Social" /></div></label>
          <label className="sheet__field"><span>Giro, Industria</span><div className="sheet__input"><select value={fact.giro} onChange={(e) => setFact({ ...fact, giro: e.target.value })}><option value="">Ingresa o selecciona el Giro</option>{GIROS.map((g) => <option key={g}>{g}</option>)}</select></div></label>
          <label className="sheet__field"><span>Dirección</span><div className="sheet__input"><input value={fact.dir} onChange={(e) => setFact({ ...fact, dir: e.target.value })} placeholder="Ingresa Calle y Número" /></div></label>
          <label className="sheet__field"><span>Región</span><div className="sheet__input"><select value={fact.region} onChange={(e) => setFact({ ...fact, region: e.target.value })}><option value="">Selecciona Región</option>{REGIONS.map((r) => <option key={r}>{r}</option>)}</select></div></label>
          <label className="sheet__field"><span>Comuna</span><div className="sheet__input"><select value={fact.comuna} onChange={(e) => setFact({ ...fact, comuna: e.target.value })}><option value="">Selecciona Comuna</option>{COMUNAS.map((c) => <option key={c}>{c}</option>)}</select></div></label>
          <label className="sheet__field"><span>Contacto</span><div className="sheet__input"><input value={fact.contacto} onChange={(e) => setFact({ ...fact, contacto: e.target.value })} placeholder="Ingresa Nombre" /></div></label>
          <label className="sheet__field"><span>Celular</span><div className="sheet__input sheet__input--phone"><span className="sheet__prefix">+56 <Icon name="chevron" className="ic--down" /></span><input value={fact.celular} onChange={(e) => setFact({ ...fact, celular: e.target.value.replace(/\D/g, '').slice(0, 9) })} placeholder="Ingresa Celular" inputMode="numeric" /></div></label>
          <label className="sheet__field"><span>Correo electrónico</span><div className="sheet__input"><input value={fact.correo} onChange={(e) => setFact({ ...fact, correo: e.target.value })} placeholder="Ingresa Correo Electrónico" type="email" /></div></label>
          <button className="btn btn--dark sheet__cta" disabled={!isValidRut(fact.rut) || !fact.razon} onClick={saveFact}>Guardar</button>
        </Sheet>
      )}
    </CheckoutShell>
  )
}

function Sheet({ title, icon, children, onClose }: { title: string; icon?: IconName; children: ReactNode; onClose: () => void }) {
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <div className="sheet__bar" />
        <header className={`sheet__head ${icon ? 'sheet__head--left' : ''}`}>
          {icon && <span className="sheet__head-ic"><Icon name={icon} /></span>}
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

function payDesc(p: string, card?: Card) {
  if (p === 'tarjeta') return card ? `${card.brand} ${card.kind} **** ${card.last4}` : 'Tarjeta'
  return { transferencia: 'Transferencia bancaria', credito: 'Línea de crédito empresa', oc: 'Orden de compra' }[p] ?? p
}
function stepTitle(id: StepId) {
  return { datos: 'Tus datos', entrega: 'Entrega', direccion: 'Dirección', pago: 'Pago', revision: 'Revisión' }[id]
}
