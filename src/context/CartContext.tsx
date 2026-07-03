import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartLine } from '@/types'
import { fetchCart, mirrorAdd, mirrorClear, mirrorRemove, mirrorSetQty } from '@/api/cart.api'
import { isBffEnabled } from '@/api/web-bff.client'
import type { BffCart } from '@/api/types'

interface CartState {
  lines: CartLine[]
  add: (productId: string, qty?: number, variant?: string) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
  count: number
  /** Último producto agregado (para mostrar confirmación/toast). */
  lastAdded: { productId: string; qty: number; ts: number } | null
  /**
   * Carrito recalculado por el BFF (cart-service): fuente autoritativa de
   * totales, stock validado y promociones cuando hay conexión. `null` en modo
   * maqueta o si el BFF/carrito no está disponible (la UI cae a `buildTotals`).
   */
  bffCart: BffCart | null
}

const CartContext = createContext<CartState | undefined>(undefined)
const CART_KEY = 'mimbral.cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() => {
    try {
      const raw = localStorage.getItem(CART_KEY)
      return raw ? (JSON.parse(raw) as CartLine[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(lines))
  }, [lines])

  const [lastAdded, setLastAdded] = useState<CartState['lastAdded']>(null)
  const [bffCart, setBffCart] = useState<BffCart | null>(null)

  // Al montar, si hay BFF y un carrito abierto, hidrata los totales del BFF.
  useEffect(() => {
    if (!isBffEnabled()) return
    let cancelled = false
    fetchCart()
      .then((cart) => {
        if (!cancelled && cart) setBffCart(cart)
      })
      .catch(() => {
        /* sin carrito o BFF caído: se queda en modo local */
      })
    return () => {
      cancelled = true
    }
  }, [])

  const add: CartState['add'] = (productId, qty = 1, variant) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId)
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + qty, variant: variant ?? l.variant } : l,
        )
      }
      return [...prev, { productId, qty, variant }]
    })
    setLastAdded({ productId, qty, ts: Date.now() })
    // Espejo hacia cart-service (solo si el BFF está configurado). El carrito
    // recalculado que devuelve pasa a ser la fuente autoritativa de totales.
    void mirrorAdd(productId, qty).then((cart) => cart && setBffCart(cart))
  }

  const setQty: CartState['setQty'] = (productId, qty) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) => (l.productId === productId ? { ...l, qty } : l)),
    )
    void (qty <= 0 ? mirrorRemove(productId) : mirrorSetQty(productId, qty)).then(
      (cart) => cart && setBffCart(cart),
    )
  }

  const remove: CartState['remove'] = (productId) => {
    setLines((prev) => prev.filter((l) => l.productId !== productId))
    void mirrorRemove(productId).then((cart) => cart && setBffCart(cart))
  }

  const clear = () => {
    setLines([])
    mirrorClear()
    setBffCart(null)
  }

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines])

  const value = useMemo<CartState>(
    () => ({ lines, add, setQty, remove, clear, count, lastAdded, bffCart }),
    [lines, count, lastAdded, bffCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartState {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
