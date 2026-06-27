import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

interface WishlistState {
  ids: string[]
  has: (id: string) => boolean
  toggle: (id: string) => void
  count: number
}

const WishlistContext = createContext<WishlistState | undefined>(undefined)
const KEY = 'mimbral.wishlist'

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? (JSON.parse(raw) as string[]) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(ids))
  }, [ids])

  const toggle = (id: string) =>
    setIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))

  const value = useMemo<WishlistState>(
    () => ({ ids, has: (id) => ids.includes(id), toggle, count: ids.length }),
    [ids],
  )

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}

export function useWishlist(): WishlistState {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist debe usarse dentro de <WishlistProvider>')
  return ctx
}
