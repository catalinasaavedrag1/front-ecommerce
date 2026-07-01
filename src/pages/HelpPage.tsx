import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import PageHero from '@/components/PageHero'
import Icon, { type IconName } from '@/components/Icon'

type Faq = { id: string; q: string; a: string }

const faqs: Faq[] = [
  {
    id: 'despachos',
    q: '¿Cuánto demora el despacho?',
    a: 'Los despachos a domicilio demoran entre 24 y 72 horas hábiles según la comuna. En el checkout verás la fecha estimada antes de pagar.',
  },
  {
    id: 'retiro',
    q: '¿Puedo retirar en tienda?',
    a: 'Sí. Al comprar elige "Retiro en tienda" y selecciona la sucursal. Te avisamos por correo cuando tu pedido esté listo, generalmente el mismo día.',
  },
  {
    id: 'empresas',
    q: '¿Cómo funcionan los precios para empresas?',
    a: 'Activando el modo Empresas verás precios netos (sin IVA), descuentos por volumen y la opción de generar cotizaciones. Con una cuenta empresa aprobada accedes además a línea de crédito.',
  },
  {
    id: 'pagos',
    q: '¿Qué medios de pago aceptan?',
    a: 'Tarjetas de crédito y débito, transferencia bancaria y, para empresas con cuenta aprobada, línea de crédito Mimbral con facturación a 30, 60 o 90 días.',
  },
  {
    id: 'devoluciones',
    q: '¿Cuál es la política de cambios y devoluciones?',
    a: 'Tienes 30 días para cambios o devoluciones de productos sin uso y con su embalaje original. Algunos productos a pedido o cortados a medida no admiten devolución.',
  },
  {
    id: 'cotizacion',
    q: '¿Cómo solicito una cotización formal?',
    a: 'Agrega productos a tu lista y entra a "Solicitar cotización". Completas tus datos y un ejecutivo te envía la cotización con condiciones comerciales.',
  },
]

const TOPICS: { id: string; label: string; icon: IconName }[] = [
  { id: 'despachos', label: 'Despachos', icon: 'truck' },
  { id: 'retiro', label: 'Retiro en tienda', icon: 'store' },
  { id: 'pagos', label: 'Medios de pago', icon: 'card' },
  { id: 'devoluciones', label: 'Cambios y devoluciones', icon: 'return' },
  { id: 'empresas', label: 'Empresas', icon: 'building' },
  { id: 'cotizacion', label: 'Cotizaciones', icon: 'doc' },
]

export default function HelpPage() {
  const { hash } = useLocation()
  const hashId = hash.slice(1)
  const indexFromHash = () => {
    const i = faqs.findIndex((f) => f.id === hashId)
    return i >= 0 ? i : 0
  }
  const [open, setOpen] = useState<number | null>(indexFromHash())

  // Al llegar con un ancla (#pagos, #devoluciones…), abre esa pregunta.
  useEffect(() => {
    const i = faqs.findIndex((f) => f.id === hashId)
    if (i >= 0) setOpen(i)
  }, [hashId])

  return (
    <div>
      <PageHero
        eyebrow="Centro de ayuda"
        title="¿En qué te podemos ayudar?"
        subtitle="Resuelve tus dudas frecuentes o contáctanos directamente."
      />
      <div className="container">
        <nav className="help-topics" aria-label="Temas de ayuda">
          {TOPICS.map((t) => (
            <Link key={t.id} to={`/ayuda#${t.id}`} className={`help-topic ${hashId === t.id ? 'is-active' : ''}`}>
              <span className="help-topic__ic"><Icon name={t.icon} /></span>
              {t.label}
            </Link>
          ))}
        </nav>

        <div className="help">
          <div className="faq">
            {faqs.map((f, i) => (
              <div className={`faq__item ${open === i ? 'is-open' : ''}`} id={f.id} key={f.id}>
                <button className="faq__q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
                  {f.q}
                  <span className="faq__icon" aria-hidden>{open === i ? '−' : '+'}</span>
                </button>
                {open === i && <div className="faq__a">{f.a}</div>}
              </div>
            ))}
          </div>
          <aside className="help__contact">
            <h3>¿No encuentras tu respuesta?</h3>
            <ul>
              <li><Icon name="phone" /> Mesa central: <strong>600 600 0000</strong></li>
              <li><Icon name="mail" /> contacto@mimbral.cl</li>
              <li><Icon name="headset" /> Chat en línea: Lun a Dom, 09:00 – 21:00</li>
            </ul>
            <Link to="/contacto" className="btn btn--primary btn--block">Escribir a Contacto</Link>
            <Link to="/seguimiento" className="btn btn--ghost btn--block">Seguir mi pedido</Link>
            <Link to="/tiendas" className="btn btn--ghost btn--block">Ver tiendas</Link>
          </aside>
        </div>
      </div>
    </div>
  )
}
