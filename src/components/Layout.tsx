import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import PatioConstructorBanner from './PatioConstructorBanner'
import Toast from './Toast'
import Icon from './Icon'
import MobileBottomNav from './MobileBottomNav'
import { useApp } from '@/context/AppContext'

export default function Layout() {
  const { mode } = useApp()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  // El chat no debe estorbar en grillas de producto
  const hideChat = /^\/(categoria|categorias|buscar|ofertas|favoritos|producto)(\/|$)/.test(pathname)

  return (
    <div className={`app app--${mode}`}>
      <a href="#main" className="skip-link">Saltar al contenido</a>
      <Header />
      {mode === 'b2b' && (
        <div className="modebanner">
          Estás navegando en modo <strong>Empresas</strong>: precios netos,
          descuentos por volumen y cotización en línea.
        </div>
      )}
      <main className="main" id="main">
        <Outlet />
      </main>
      <PatioConstructorBanner />
      <Footer />
      <Toast />
      {!hideChat && (
        <a href="#chat" className="chatfab" aria-label="Chat de ayuda">
          <Icon name="chat" />
        </a>
      )}
      <MobileBottomNav />
    </div>
  )
}
