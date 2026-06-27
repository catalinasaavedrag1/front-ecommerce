import { useState, type FormEvent } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { categories } from '@/data/products'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import ModeSwitch from './ModeSwitch'

export default function Header() {
  const { mode, customer, logout } = useApp()
  const { count } = useCart()
  const navigate = useNavigate()
  const [q, setQ] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const onSearch = (e: FormEvent) => {
    e.preventDefault()
    navigate(`/buscar?q=${encodeURIComponent(q.trim())}`)
    setMenuOpen(false)
  }

  return (
    <header className="header">
      <div className="header__top">
        <div className="header__top-inner">
          <span>📍 Despacho a todo Chile · Retira en tienda</span>
          <div className="header__top-links">
            <Link to="/empresas">Portal Empresas</Link>
            <span aria-hidden>·</span>
            <a href="#ayuda">Ayuda</a>
            <span aria-hidden>·</span>
            <span>Mesa central 600 600 0000</span>
          </div>
        </div>
      </div>

      <div className="header__main">
        <button
          className="header__burger"
          aria-label="Abrir menú"
          onClick={() => setMenuOpen((v) => !v)}
        >
          ☰
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
            placeholder="Busca productos, marcas y más…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Buscar productos"
          />
          <button type="submit" aria-label="Buscar">
            🔍
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
            <Link to="/ingresar" className="header__account">
              <span aria-hidden>👤</span> Ingresar
            </Link>
          )}
          <Link to="/carro" className="header__cart">
            <span aria-hidden>🛒</span>
            <span className="header__cart-label">
              {mode === 'b2b' ? 'Mi orden' : 'Carro'}
            </span>
            {count > 0 && <span className="header__cart-badge">{count}</span>}
          </Link>
        </div>
      </div>

      <nav className={`catnav ${menuOpen ? 'is-open' : ''}`} aria-label="Categorías">
        <ul>
          <li>
            <NavLink to="/" end onClick={() => setMenuOpen(false)}>
              Inicio
            </NavLink>
          </li>
          {categories.map((c) => (
            <li key={c.id}>
              <NavLink to={`/categoria/${c.slug}`} onClick={() => setMenuOpen(false)}>
                <span aria-hidden>{c.icon}</span> {c.name}
              </NavLink>
            </li>
          ))}
          <li className="catnav__b2b">
            <NavLink to="/empresas" onClick={() => setMenuOpen(false)}>
              🏢 Empresas
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  )
}
