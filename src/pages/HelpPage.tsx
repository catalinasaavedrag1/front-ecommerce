import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '@/components/PageHero'
import Icon from '@/components/Icon'

const faqs = [
  {
    q: '¿Cuánto demora el despacho?',
    a: 'Los despachos a domicilio demoran entre 24 y 72 horas hábiles según la comuna. En el checkout verás la fecha estimada antes de pagar.',
  },
  {
    q: '¿Puedo retirar en tienda?',
    a: 'Sí. Al comprar elige "Retiro en tienda" y selecciona la sucursal. Te avisamos por correo cuando tu pedido esté listo, generalmente el mismo día.',
  },
  {
    q: '¿Cómo funcionan los precios para empresas?',
    a: 'Activando el modo Empresas verás precios netos (sin IVA), descuentos por volumen y la opción de generar cotizaciones. Con una cuenta empresa aprobada accedes además a línea de crédito.',
  },
  {
    q: '¿Qué medios de pago aceptan?',
    a: 'Tarjetas de crédito y débito, transferencia bancaria y, para empresas con cuenta aprobada, línea de crédito Mimbral con facturación a 30, 60 o 90 días.',
  },
  {
    q: '¿Cuál es la política de cambios y devoluciones?',
    a: 'Tienes 30 días para cambios o devoluciones de productos sin uso y con su embalaje original. Algunos productos a pedido o cortados a medida no admiten devolución.',
  },
  {
    q: '¿Cómo solicito una cotización formal?',
    a: 'Agrega productos a tu lista y entra a "Solicitar cotización". Completas tus datos y un ejecutivo te envía la cotización con condiciones comerciales.',
  },
]

export default function HelpPage() {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div>
      <PageHero
        eyebrow="Centro de ayuda"
        title="¿En qué te podemos ayudar?"
        icon="💬"
        subtitle="Resuelve tus dudas frecuentes o contáctanos directamente."
      />
      <div className="container help">
        <div className="faq">
          {faqs.map((f, i) => (
            <div className={`faq__item ${open === i ? 'is-open' : ''}`} key={f.q}>
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
          <Link to="/seguimiento" className="btn btn--ghost btn--block">Seguir mi pedido</Link>
          <Link to="/tiendas" className="btn btn--ghost btn--block">Ver tiendas</Link>
        </aside>
      </div>
    </div>
  )
}
