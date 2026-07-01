import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import PageHero from '@/components/PageHero'
import Icon from '@/components/Icon'

const REASONS = [
  'Consulta general',
  'Estado de mi pedido',
  'Cambios y devoluciones',
  'Atención empresas',
  'Libro de reclamos',
]

const CHANNELS: { icon: Parameters<typeof Icon>[0]['name']; title: string; value: string; note: string }[] = [
  { icon: 'phone', title: 'Mesa central', value: '600 600 0000', note: 'Lun a Vie 08:30 – 20:00 · Sáb 09:00 – 18:00' },
  { icon: 'mail', title: 'Correo', value: 'contacto@mimbral.cl', note: 'Te respondemos dentro de 24 horas hábiles' },
  { icon: 'whatsapp', title: 'WhatsApp', value: '+56 9 5555 0000', note: 'Escríbenos para dudas rápidas de compra' },
  { icon: 'building', title: 'Atención empresas', value: 'empresas@mimbral.cl', note: 'Ejecutivo dedicado para cuentas B2B' },
]

export default function ContactPage() {
  const [params] = useSearchParams()
  const initialReason = REASONS.find((r) => r.toLowerCase() === (params.get('asunto') ?? '').toLowerCase()) ?? REASONS[0]
  const [sent, setSent] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div>
      <PageHero
        eyebrow="Contacto"
        title="Hablemos"
        subtitle="Elige el canal que prefieras o envíanos un mensaje y te responderemos a la brevedad."
      />
      <div className="container help">
        <main>
          {sent ? (
            <div className="panel contact-ok" role="status">
              <div className="confirm__check"><Icon name="check" /></div>
              <h2>¡Mensaje enviado!</h2>
              <p>Gracias por escribirnos. Un ejecutivo te contactará dentro de las próximas 24 horas hábiles.</p>
              <div className="confirm__actions">
                <Link to="/" className="btn btn--primary">Volver al inicio</Link>
                <Link to="/seguimiento" className="btn btn--ghost">Seguir mi pedido</Link>
              </div>
            </div>
          ) : (
            <form className="panel contactform" onSubmit={onSubmit}>
              <h2>Envíanos un mensaje</h2>
              <div className="formgrid">
                <label>Nombre<input required autoComplete="name" placeholder="Tu nombre" /></label>
                <label>Email<input type="email" required autoComplete="email" placeholder="correo@ejemplo.cl" /></label>
                <label>Teléfono<input inputMode="tel" autoComplete="tel" placeholder="+56 9 ..." /></label>
                <label>
                  Motivo
                  <select defaultValue={initialReason}>
                    {REASONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                </label>
                <label className="formgrid__full">
                  Mensaje
                  <textarea rows={5} required placeholder="Cuéntanos en qué te podemos ayudar" />
                </label>
              </div>
              <button type="submit" className="btn btn--primary">Enviar mensaje</button>
              <p className="contactform__legal">
                Al enviar aceptas nuestra <Link to="/legal/privacidad">política de privacidad</Link>.
              </p>
            </form>
          )}
        </main>

        <aside className="help__contact contact-channels">
          <h3>Canales de atención</h3>
          <ul className="contact-list">
            {CHANNELS.map((c) => (
              <li key={c.title}>
                <span className="contact-list__ic"><Icon name={c.icon} /></span>
                <span className="contact-list__body">
                  <strong>{c.title}</strong>
                  <span className="contact-list__value">{c.value}</span>
                  <small>{c.note}</small>
                </span>
              </li>
            ))}
          </ul>
          <Link to="/ayuda" className="btn btn--ghost btn--block">Ver preguntas frecuentes</Link>
          <Link to="/tiendas" className="btn btn--ghost btn--block">Encontrar una tienda</Link>
        </aside>
      </div>
    </div>
  )
}
