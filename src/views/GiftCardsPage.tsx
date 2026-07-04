import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '@/components/PageHero'
import Icon, { type IconName } from '@/components/Icon'
import { formatCLP } from '@/utils/format'

const AMOUNTS = [10000, 20000, 30000, 50000, 100000]

const BENEFITS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'clock', title: 'Sin vencimiento', text: 'Úsala cuando quieras, no expira nunca.' },
  { icon: 'store', title: 'Online y en tienda', text: 'Válida en todo el catálogo Mimbral.' },
  { icon: 'mail', title: 'Envío inmediato', text: 'Llega por correo el día que elijas.' },
]

const STEPS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'card', title: 'Elige el monto', text: 'Desde $10.000 o el valor que necesites.' },
  { icon: 'sparkle', title: 'Personalízala', text: 'Agrega nombre, mensaje y fecha de envío.' },
  { icon: 'cart', title: 'Canjéala', text: 'Se usa online y en tienda, sin complicaciones.' },
]

export default function GiftCardsPage() {
  const [amount, setAmount] = useState(30000)
  const [custom, setCustom] = useState('')
  const [to, setTo] = useState('')
  const [from, setFrom] = useState('')

  const customValue = Number(custom.replace(/\D/g, ''))
  const value = custom ? customValue : amount

  return (
    <div>
      <PageHero
        eyebrow="Gift Cards"
        title="Regala Mimbral"
        subtitle="La tarjeta perfecta para quienes disfrutan mejorar su hogar o avanzar en su proyecto."
      />
      <div className="container">
        <div className="gc-layout">
          {/* Vista previa de la tarjeta */}
          <div className="gc-preview">
            <div className="gc-card" role="img" aria-label={`Gift Card Mimbral por ${formatCLP(value || 0)}`}>
              <span className="gc-card__mark" aria-hidden>
                <svg viewBox="0 0 44 40"><path d="M7 31 16 9h6L13 31z" /><path d="M19 31 28 9h6l-9 22z" /><path d="M31 31 37 16v15z" className="gc-card__mark-accent" /></svg>
              </span>
              <div className="gc-card__top">
                <span className="gc-card__brand">Mimbral</span>
                <span className="gc-card__type">Gift Card</span>
              </div>
              <span className="gc-card__chip" aria-hidden />
              <div className="gc-card__foot">
                <span className="gc-card__label">{to ? `Para ${to}` : 'Para quien más quieres'}</span>
                <strong className="gc-card__value">{formatCLP(value || 0)}</strong>
                <span className="gc-card__from">{from ? `De parte de ${from}` : 'Un regalo Mimbral'}</span>
              </div>
            </div>

            <ul className="gc-benefits">
              {BENEFITS.map((b) => (
                <li key={b.title}>
                  <span className="gc-benefit__ic"><Icon name={b.icon} /></span>
                  <span>
                    <strong>{b.title}</strong>
                    <small>{b.text}</small>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Panel de compra */}
          <form className="gc-buy panel" onSubmit={(e) => e.preventDefault()}>
            <h2>Diseña tu Gift Card</h2>

            <span className="gc-field-lbl">Monto</span>
            <div className="gc-amounts">
              {AMOUNTS.map((a) => (
                <button
                  type="button"
                  key={a}
                  className={`gc-amount ${!custom && amount === a ? 'is-active' : ''}`}
                  onClick={() => { setAmount(a); setCustom('') }}
                  aria-pressed={!custom && amount === a}
                >
                  {formatCLP(a)}
                </button>
              ))}
            </div>
            <label className="gc-custom">
              Otro monto
              <div className="gc-custom__input">
                <span>$</span>
                <input
                  inputMode="numeric"
                  placeholder="Ej: 45.000"
                  value={custom ? customValue.toLocaleString('es-CL') : ''}
                  onChange={(e) => setCustom(e.target.value)}
                />
              </div>
            </label>

            <div className="formgrid">
              <label>Para (nombre)<input value={to} onChange={(e) => setTo(e.target.value)} placeholder="Nombre del destinatario" /></label>
              <label>De parte de<input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Tu nombre" /></label>
              <label>Correo del destinatario<input type="email" placeholder="regalo@ejemplo.cl" /></label>
              <label>Fecha de envío<input type="date" /></label>
              <label className="formgrid__full">Mensaje (opcional)<textarea rows={2} placeholder="¡Feliz cumpleaños! Que disfrutes tu proyecto." /></label>
            </div>

            <button className="btn btn--primary btn--block gc-cta" disabled={!value}>
              Comprar por {formatCLP(value || 0)}
            </button>
            <p className="gc-buy__legal"><Icon name="lock" /> Pago seguro · Sin vencimiento · Válida online y en tienda.</p>
          </form>
        </div>

        <section className="row">
          <h2 className="section-title">Cómo funciona</h2>
          <ol className="gc-steps">
            {STEPS.map((s, i) => (
              <li className="gc-step" key={s.title}>
                <span className="gc-step__n">{i + 1}</span>
                <span className="gc-step__ic"><Icon name={s.icon} /></span>
                <strong>{s.title}</strong>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="ctaband">
          <div>
            <h2>¿Compras para tu empresa?</h2>
            <p>Consulta por Gift Cards corporativas y convenios de incentivo para tus equipos.</p>
          </div>
          <Link to="/contacto?asunto=Atención empresas" className="btn btn--primary btn--lg">Contactar a Empresas</Link>
        </section>
      </div>
    </div>
  )
}
