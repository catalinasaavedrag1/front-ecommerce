import { Link } from 'react-router-dom'
import Icon, { type IconName } from '@/components/Icon'

type Item = { icon: IconName; to: string; title: string; desc: string }

const ITEMS: Item[] = [
  { icon: 'headset', to: '/ayuda', title: 'Centro de ayuda', desc: 'Resuelve dudas sobre compras, despachos y cambios' },
  { icon: 'truck', to: '/seguimiento', title: 'Sigue tu pedido', desc: 'Consulta el estado de tu compra' },
  { icon: 'store', to: '/tiendas', title: 'Tiendas Mimbral', desc: 'Encuentra horarios y direcciones' },
  { icon: 'building', to: '/empresas', title: 'Empresas B2B', desc: 'Cotizaciones, crédito y grandes obras' },
]

/** Franja compacta de accesos rápidos al inicio del footer. */
export default function FooterServiceStrip() {
  return (
    <div className="ft-strip">
      {ITEMS.map((it) => (
        <Link key={it.title} to={it.to} className="ft-strip__item">
          <span className="ft-strip__ic"><Icon name={it.icon} /></span>
          <span className="ft-strip__txt">
            <strong>{it.title}</strong>
            <span>{it.desc}</span>
          </span>
        </Link>
      ))}
    </div>
  )
}
