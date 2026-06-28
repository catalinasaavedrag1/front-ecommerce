import { useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { categories } from '@/data/products'
import { categoryTree } from '@/data/menu'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import SearchBar from './SearchBar'
import Icon, { CategoryIcon } from './Icon'

export default function Header() {
  const { mode, customer, logout } = useApp()
  const { count } = useCart()
  const wishlist = useWishlist()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isProduct = /^\/producto\//.test(pathname)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mega, setMega] = useState(false)
  const [megaCat, setMegaCat] = useState(categories[0].id)
  // Drill-down mobile: categoría seleccionada y subcategoría seleccionada
  const [mobCat, setMobCat] = useState<string | null>(null)
  const [mobSub, setMobSub] = useState<number | null>(null)

  const closeMenu = () => { setMenuOpen(false); setMobCat(null); setMobSub(null) }
  const closeMega = () => setMega(false)

  const activeCat = categories.find((c) => c.id === megaCat) ?? categories[0]
  const mobCategory = categories.find((c) => c.id === mobCat)
  const mobSubcats = mobCat ? categoryTree[mobCat] ?? [] : []

  return (
    <header className={`header ${isProduct ? 'header--product' : ''}`}>
      {isProduct && (
        <div className="pheader">
          <button className="pheader__back" onClick={() => navigate(-1)} aria-label="Volver">
            <Icon name="chevron" className="ic--flip" />
          </button>
          <Link to="/" className="pheader__logo" aria-label="Mimbral inicio">
            <span className="pheader__mark" aria-hidden>
              <svg viewBox="0 0 44 40" width="100%" height="100%"><path d="M7 31 16 9h6L13 31z" fill="#fff" /><path d="M19 31 28 9h6l-9 22z" fill="#fff" /><path d="M31 31 37 16v15z" fill="#e1251b" /></svg>
            </span>
            <span className="pheader__name">Mimbral</span>
          </Link>
          <div className="pheader__actions">
            <Link to="/buscar" aria-label="Buscar"><Icon name="search" /></Link>
            <Link to="/seguimiento" aria-label="Notificaciones" className="pheader__bell"><Icon name="bell" /></Link>
            <Link to="/carro" className="pheader__cart" aria-label="Carro">
              <Icon name="cart" />
              {count > 0 && <span className="pheader__badge">{count > 99 ? '99+' : count}</span>}
            </Link>
          </div>
        </div>
      )}
      <div className="header__top">
        <div className="header__top-inner">
          <Link to="/tiendas"><Icon name="clock" /> Horarios y Tiendas</Link>
          <Link to="/empresas"><Icon name="headset" /> Venta empresas</Link>
          <Link to="/seguimiento"><Icon name="truck" /> Sigue tu pedido</Link>
          <Link to="/ayuda" className="header__top-help"><Icon name="phone" /> 600 600 0000</Link>
        </div>
      </div>

      <Link to="/tiendas" className="header__loc" aria-label="Despacho y retiro">
        <Icon name="pin" />
        <span>Despacha a <strong>Santiago Centro</strong></span>
        <Icon name="chevron" className="header__loc-chev" />
      </Link>

      <div className="header__main">
        <button className="header__burger" aria-label="Abrir menú" onClick={() => setMenuOpen(true)}>
          <Icon name="menu" />
        </button>

        <Link to="/" className="brand" aria-label="Mimbral inicio">
          <span className="brand__mark" aria-hidden>
            <svg viewBox="0 0 44 40" width="100%" height="100%">
              <path d="M7 31 16 9h6L13 31z" fill="#fff" />
              <path d="M19 31 28 9h6l-9 22z" fill="#fff" />
              <path d="M31 31 37 16v15z" fill="#e1251b" />
            </svg>
          </span>
          <span className="brand__text">
            Mimbral
            <small className="brand__mts">MTS</small>
          </span>
        </Link>

        <SearchBar />

        <div className="header__actions">
          {customer ? (
            <div className="account">
              {mode === 'b2b' && <span className="account__badge">Empresa</span>}
              <Link to="/cuenta" className="account__hi">Hola, <strong>{customer.name.split(' ')[0]}</strong></Link>
              <button className="account__logout" onClick={logout}>Salir</button>
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

      <nav className="catnav" aria-label="Categorías">
        <ul>
          <li className="catnav__mega-trigger" onMouseEnter={() => setMega(true)} onMouseLeave={closeMega}>
            <button className="catnav__all" aria-expanded={mega}>
              <Icon name="menu" /> Categorías
            </button>
            {mega && (
              <div className="mega">
                <ul className="mega__rail">
                  {categories.map((c) => (
                    <li
                      key={c.id}
                      className={`mega__rail-item ${megaCat === c.id ? 'is-active' : ''}`}
                      onMouseEnter={() => setMegaCat(c.id)}
                    >
                      <Link to={`/categoria/${c.slug}`} onClick={closeMega}>
                        <CategoryIcon id={c.id} /> <span>{c.name}</span>
                        <Icon name="chevron" className="mega__rail-chev" />
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="mega__panel">
                  <Link to={`/categoria/${activeCat.slug}`} className="mega__panel-head" onClick={closeMega}>
                    {activeCat.name} <span>Ver todo →</span>
                  </Link>
                  <div className="mega__cols">
                    {(categoryTree[activeCat.id] ?? []).map((sub) => (
                      <div className="mega__group" key={sub.name}>
                        <Link to={`/categoria/${activeCat.slug}`} className="mega__group-title" onClick={closeMega}>{sub.name}</Link>
                        <ul>
                          {sub.children.map((ch) => (
                            <li key={ch}>
                              <Link to={`/buscar?q=${encodeURIComponent(ch)}`} onClick={closeMega}>{ch}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </li>
          <li><NavLink to="/" end onClick={closeMenu}>Inicio</NavLink></li>
          {categories.slice(0, 5).map((c) => (
            <li key={c.id}><NavLink to={`/categoria/${c.slug}`} onClick={closeMenu}>{c.name}</NavLink></li>
          ))}
          <li><NavLink to="/ofertas" className="catnav__hot" onClick={closeMenu}>Ofertas</NavLink></li>
          <li><NavLink to="/inspiracion" onClick={closeMenu}>Inspiración</NavLink></li>
          <li className="catnav__b2b"><NavLink to="/empresas" onClick={closeMenu}>Empresas</NavLink></li>
        </ul>
      </nav>

      {menuOpen && (
        <div className="mobnav-overlay" onClick={closeMenu}>
          <div className="mobnav" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Menú">
            {/* Nivel 0: categorías */}
            {mobCat === null && (
              <>
                <div className="mobnav__head">
                  <span className="mobnav__title">Categorías</span>
                  <button className="drawer__close" onClick={closeMenu} aria-label="Cerrar"><Icon name="close" /></button>
                </div>
                <div className="mobnav__list">
                  {categories.map((c) => (
                    <button key={c.id} className="mobnav__item" onClick={() => { setMobCat(c.id); setMobSub(null) }}>
                      <span className="mobnav__icon"><CategoryIcon id={c.id} /></span>
                      <span>{c.name}</span>
                      <Icon name="chevron" className="mobnav__chev" />
                    </button>
                  ))}
                </div>
                <div className="mobnav__foot">
                  <Link to="/ofertas" onClick={closeMenu} className="mobnav__link">Ofertas</Link>
                  <Link to="/empresas" onClick={closeMenu} className="mobnav__link">Venta empresas</Link>
                  <Link to="/tiendas" onClick={closeMenu} className="mobnav__link">Tiendas</Link>
                </div>
              </>
            )}

            {/* Nivel 1: subcategorías */}
            {mobCat !== null && mobSub === null && mobCategory && (
              <>
                <div className="mobnav__head">
                  <button className="mobnav__back" onClick={() => setMobCat(null)} aria-label="Volver"><Icon name="chevron" className="mobnav__back-ic" /></button>
                  <span className="mobnav__title">{mobCategory.name}</span>
                  <button className="drawer__close" onClick={closeMenu} aria-label="Cerrar"><Icon name="close" /></button>
                </div>
                <div className="mobnav__list">
                  <Link to={`/categoria/${mobCategory.slug}`} className="mobnav__item mobnav__item--all" onClick={closeMenu}>
                    Ver todo en {mobCategory.name}
                  </Link>
                  {mobSubcats.map((sub, i) => (
                    <button key={sub.name} className="mobnav__item" onClick={() => setMobSub(i)}>
                      <span>{sub.name}</span>
                      <Icon name="chevron" className="mobnav__chev" />
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Nivel 2: sub-subcategorías */}
            {mobCat !== null && mobSub !== null && mobCategory && mobSubcats[mobSub] && (
              <>
                <div className="mobnav__head">
                  <button className="mobnav__back" onClick={() => setMobSub(null)} aria-label="Volver"><Icon name="chevron" className="mobnav__back-ic" /></button>
                  <span className="mobnav__title">{mobSubcats[mobSub].name}</span>
                  <button className="drawer__close" onClick={closeMenu} aria-label="Cerrar"><Icon name="close" /></button>
                </div>
                <div className="mobnav__list">
                  <Link to={`/categoria/${mobCategory.slug}`} className="mobnav__item mobnav__item--all" onClick={closeMenu}>
                    Ver todo en {mobSubcats[mobSub].name}
                  </Link>
                  {mobSubcats[mobSub].children.map((ch) => (
                    <Link key={ch} to={`/buscar?q=${encodeURIComponent(ch)}`} className="mobnav__item mobnav__item--leaf" onClick={closeMenu}>
                      {ch}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
