import { NavLink } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useApp } from '@/context/AppContext'
import Icon, { type IconName } from './Icon'

type Tab = { to: string; label: string; icon: IconName; end?: boolean; badge?: number }

export default function MobileBottomNav() {
  const { count } = useCart()
  const wishlist = useWishlist()
  const { mode } = useApp()

  const tabs: Tab[] = [
    { to: '/', label: 'Inicio', icon: 'home', end: true },
    { to: '/buscar', label: 'Buscar', icon: 'search' },
    { to: '/carro', label: mode === 'b2b' ? 'Orden' : 'Carro', icon: 'cart', badge: count },
    { to: '/favoritos', label: 'Favoritos', icon: 'heart', badge: wishlist.count },
    { to: '/cuenta', label: 'Cuenta', icon: 'user' },
  ]

  return (
    <nav className="botnav" aria-label="Navegación principal">
      {tabs.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          className={({ isActive }) => `botnav__tab ${isActive ? 'is-active' : ''}`}
        >
          <span className="botnav__ic">
            <Icon name={t.icon} />
            {t.badge ? <span className="botnav__badge">{t.badge > 99 ? '99+' : t.badge}</span> : null}
          </span>
          <span className="botnav__label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
