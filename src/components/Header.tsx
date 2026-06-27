import { useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { categories } from '@/data/products'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import ModeSwitch from './ModeSwitch'
import Icon, { CategoryIcon } from './Icon'

export default function Header() {
  const { mode, customer, logout } = useApp()
  const { count } = useCart()
  const wishlist = useWishlist()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [mega, setMega] = useState(false)

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/buscar?q=${encodeURIComponent(q.trim())}`)
    setMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="header__top">
        <div className="header__top-inner">
          <span className="header__top-loc"><Icon name="pin" /> Despacho a todo Chile · Retira en tienda</span>
          <div className="header__top-links">
            <Link to="/empresas">Venta empresas</Link>
            <span aria-hidden>·</span>
            <Link to="/seguimiento">Sigue tu pedido</Link>
            <span aria-hidden>·</span>
            <Link to="/tiendas">Tiendas</Link>
            <span aria-hidden>·</span>
            <Link to="/ayuda">Ayuda</Link>
            <span className="header__top-phone"><Icon name="phone" /> 600 600 0000</span>
          </div>
        </div>
      </div>

      <div className="header__main">
        <button
          className="header__burger"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <Icon name="menu" />
        </button>

        <Link to="/" className="brand" aria-label="Mimbral inicio">
          <span className="brand__mark">M</span>
          <span className="brand__text">
            Mimbral
            <small>Construcción y Hogar</small>
          </span>
        </Link>

        <form className="search" onSubmit={onSearch} role="search">
          <input
            type="search"
            placeholder="Busca productos, marcas y SKU…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar productos"
          />
          <button type="submit" aria-label="Buscar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
              <path d="m20 20-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </form>

        <div className="header__actions">
          <ModeSwitch />
          {customer ? (
            <div className="account">
              <span className="account__hi">
                Hola, <strong>{customer.name.split(' ')[0]}</strong>
              </span>
              <button className="account__logout" onClick={logout}>
                Salir
              </button>
            </div>
          ) : (
            <Link to="/ingresar" className="header__icon-link">
              <Icon name="user" />
              <span className="header__icon-label">Ingresar</span>
            </Link>
          )}
          <Link to="/favoritos" className="header__icon-link header__fav">
            <Icon name="heart" />
            <span className="header__icon-label">Favoritos</span>
            {wishlist.count > 0 && <span className="header__badge">{wishlist.count}</span>}
          </Link>
          <Link to="/carro" className="header__cart">
            <Icon name="cart" />
            <span className="header__icon-label">{mode === 'b2b' ? 'Mi orden' : 'Carro'}</span>
            {count > 0 && <span className="header__badge header__badge--cart">{count}</span>}
          </Link>
        </div>
      </div>

      <nav className={`catnav ${menuOpen ? 'is-open' : ''}`} aria-label="Categorías">
        <ul>
          <li
            className="catnav__mega-trigger"
            onMouseEnter={() => setMega(true)}
            onMouseLeave={() => setMega(false)}
          >
            <button className="catnav__all" aria-expanded={mega}>
              <Icon name="menu" /> Categorías
            </button>
            {mega && (
              <div className="mega" onMouseEnter={() => setMega(true)}>
                {categories.map((c) => (
                  <div className="mega__col" key={c.id}>
                    <Link to={`/categoria/${c.slug}`} className="mega__head" onClick={() => setMega(false)}>
                      <CategoryIcon id={c.id} /> {c.name}
                    </Link>
                    <ul>
                      {(c.subcats ?? []).map((s) => (
                        <li key={s}>
                          <Link to={`/categoria/${c.slug}`} onClick={() => setMega(false)}>
                            {s}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </li>
          <li>
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>
              Inicio
            </NavLink>
          </li>
          {categories.slice(0, 5).map((c) => (
            <li key={c.id}>
              <NavLink to={`/categoria/${c.slug}`} onClick={() => setMenuOpen(false)}>
                {c.name}
              </NavLink>
            </li>
          ))}
          <li>
            <NavLink to="/ofertas" className="catnav__hot" onClick={() => setMenuOpen(false)}>
              Ofertas
            </NavLink>
          </li>
          <li>
            <NavLink to="/inspiracion" onClick={() => setMenuOpen(false)}>
              Inspiración
            </NavLink>
          </li>
          <li className="catnav__b2b">
            <NavLink to="/empresas" onClick={() => setMenuOpen(false)}>
              Empresas
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
