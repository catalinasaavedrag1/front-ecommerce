import { useEffect } from 'react'
import { BrowserRouter, useNavigate } from 'react-router-dom'
import App from './App'
import { AppProvider } from './context/AppContext'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'

/**
 * Raíz del SPA para el runtime Next (F1). A diferencia de main.tsx (Vite +
 * HashRouter, que sigue intacto para el build estático), aquí se usa
 * BrowserRouter: URLs reales, indexables. El CSS global lo importa
 * app/layout.tsx (regla de Next).
 */

/** Redirige links históricos /#/ruta -> /ruta (el fragment no viaja al servidor). */
function HashRedirect() {
  const navigate = useNavigate()
  useEffect(() => {
    const { hash } = window.location
    if (hash.startsWith('#/')) navigate(hash.slice(1), { replace: true })
  }, [navigate])
  return null
}

export default function AppRoot() {
  return (
    <BrowserRouter>
      <AppProvider>
        <WishlistProvider>
          <CartProvider>
            <HashRedirect />
            <App />
          </CartProvider>
        </WishlistProvider>
      </AppProvider>
    </BrowserRouter>
  )
}
