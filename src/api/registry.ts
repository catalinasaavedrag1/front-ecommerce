import type { Product } from '@/types'

/**
 * Registro en memoria (+ sessionStorage) de los productos que llegaron del
 * BFF ya adaptados al tipo `Product` del front. Permite que TODO el código
 * existente que resuelve por id (carrito, vistos recientemente, carruseles)
 * siga funcionando cuando los ids son SKUs reales y no existen en los mocks.
 */
const KEY = 'mimbral.bff.products'
const mem = new Map<string, Product>()

function hydrate(): void {
  if (mem.size > 0) return
  try {
    const raw = sessionStorage.getItem(KEY)
    if (raw) {
      for (const p of JSON.parse(raw) as Product[]) mem.set(p.id, p)
    }
  } catch {
    /* cache corrupta: se ignora */
  }
}

function persist(): void {
  try {
    // Se acota para no crecer sin límite dentro de la sesión.
    sessionStorage.setItem(KEY, JSON.stringify([...mem.values()].slice(-300)))
  } catch {
    /* sessionStorage lleno: el registro sigue en memoria */
  }
}

export function registerProducts(items: Product[]): void {
  hydrate()
  for (const p of items) mem.set(p.id, p)
  persist()
}

export function getRegisteredProduct(id: string): Product | undefined {
  hydrate()
  return mem.get(id)
}
