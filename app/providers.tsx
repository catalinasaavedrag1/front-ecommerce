'use client'

import { useEffect, type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { AppProvider } from '@/context/AppContext'
import { CartProvider } from '@/context/CartContext'
import { WishlistProvider } from '@/context/WishlistContext'

/** Redirige links históricos del SPA (/#/ruta) a la ruta real. */
function HashRedirect() {
  const router = useRouter()
  useEffect(() => {
    const { hash } = window.location
    if (hash.startsWith('#/')) router.replace(hash.slice(1))
  }, [router])
  return null
}

/** Contextos globales del storefront (client) para todo el árbol Next. */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <WishlistProvider>
        <CartProvider>
          <HashRedirect />
          {children}
        </CartProvider>
      </WishlistProvider>
    </AppProvider>
  )
}
