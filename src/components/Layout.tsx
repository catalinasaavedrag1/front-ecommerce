import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import Toast from './Toast'
import Icon from './Icon'
import { useApp } from '@/context/AppContext'

export default function Layout() {
  const { mode } = useApp()
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className={`app app--${mode}`}>
      <Header />
      {mode === 'b2b' && (
        <div className="modebanner">
          Estás navegando en modo <strong>Empresas</strong>: precios netos,
          descuentos por volumen y cotización en línea.
        </div>
      )}
      <main className="main">
        <Outlet />
      </main>
      <Footer />
      <Toast />
      <a href="#chat" className="chatfab" aria-label="Chat de ayuda">
        <Icon name="chat" />
      </a>
    </div>
  )
}
