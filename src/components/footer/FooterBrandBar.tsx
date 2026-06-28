import { Link } from 'react-router-dom'
import Icon, { type IconName } from '@/components/Icon'

const SOCIAL: { icon: IconName; href: string; label: string }[] = [
  { icon: 'sparkle', href: 'https://instagram.com', label: 'Instagram' },
  { icon: 'users', href: 'https://facebook.com', label: 'Facebook' },
  { icon: 'whatsapp', href: 'https://wa.me/56600600000', label: 'WhatsApp' },
  { icon: 'bolt', href: 'https://youtube.com', label: 'YouTube' },
]

const PAY = ['Webpay', 'Tarjetas', 'Transferencia', 'Crédito B2B']

/** Barra de marca: logo + bajada, redes sociales y medios de pago. */
export default function FooterBrandBar() {
  return (
    <div className="ft-brand">
      <Link to="/" className="ft-brand__id" aria-label="Mimbral inicio">
        <span className="ft-brand__mark" aria-hidden>
          <svg viewBox="0 0 44 40" width="100%" height="100%"><path d="M7 31 16 9h6L13 31z" fill="#173a8a" /><path d="M19 31 28 9h6l-9 22z" fill="#173a8a" /><path d="M31 31 37 16v15z" fill="#e1251b" /></svg>
        </span>
        <span className="ft-brand__name">
          <strong>Mimbral</strong>
          <span>Construye y mejora tu hogar</span>
        </span>
      </Link>

      <div className="ft-social">
        {SOCIAL.map((s) => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}><Icon name={s.icon} /></a>
        ))}
      </div>

      <div className="ft-pay" aria-label="Medios de pago">
        {PAY.map((p) => <span key={p}>{p}</span>)}
      </div>
    </div>
  )
}
