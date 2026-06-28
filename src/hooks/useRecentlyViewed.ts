import { useEffect, useState } from 'react'
import type { Product } from '@/types'
import { getProduct } from '@/data/products'

const KEY = 'mimbral.recent'
const MAX = 12

function read(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

/**
 * Registra el producto actual como visto y devuelve los vistos anteriormente
 * (excluyendo el actual). Persistencia por sesión vía localStorage.
 */
export function useRecentlyViewed(currentId: string): Product[] {
  const [prev, setPrev] = useState<string[]>([])

  useEffect(() => {
    const stored = read()
    setPrev(stored.filter((idx) => idx !== currentId))
    const next = [currentId, ...stored.filter((idx) => idx !== currentId)].slice(0, MAX)
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }, [currentId])

  return prev.map(getProduct).filter(Boolean) as Product[]
}
