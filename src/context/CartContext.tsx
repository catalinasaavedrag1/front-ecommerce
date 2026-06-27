import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { CartLine } from '@/types'

interface CartState {
  lines: CartLine[]
  add: (productId: string, qty?: number) => void
  setQty: (productId: string, qty: number) => void
  remove: (productId: string) => void
  clear: () => void
  count: number
  /** Último producto agregado (para mostrar confirmación/toast). */
  lastAdded: { productId: string; qty: number; ts: number } | null
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

  const add: CartState['add'] = (productId, qty = 1) => {
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId)
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, qty: l.qty + qty } : l,
        )
      }
      return [...prev, { productId, qty }]
    })
    setLastAdded({ productId, qty, ts: Date.now() })
  }

  const setQty: CartState['setQty'] = (productId, qty) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.productId !== productId)
        : prev.map((l) => (l.productId === productId ? { ...l, qty } : l)),
    )
  }

  const remove: CartState['remove'] = (productId) =>
    setLines((prev) => prev.filter((l) => l.productId !== productId))

  const clear = () => setLines([])

  const count = useMemo(() => lines.reduce((sum, l) => sum + l.qty, 0), [lines])

  const value = useMemo<CartState>(
    () => ({ lines, add, setQty, remove, clear, count, lastAdded }),
    [lines, count, lastAdded],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart(): CartState {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>')
  return ctx
}
