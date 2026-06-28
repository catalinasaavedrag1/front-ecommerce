import type { Product } from '@/types'
import { products, getProduct, productsByCategory } from '@/data/products'

export interface Recommendations {
  similar: Product[]
  comparison: Product[]
  complements: Product[]
  frequentlyBoughtTogether: Product[]
}

const byId = (ids: string[]) => ids.map(getProduct).filter(Boolean) as Product[]
const dedupe = (list: Product[]) => {
  const seen = new Set<string>()
  return list.filter((p) => (seen.has(p.id) ? false : (seen.add(p.id), true)))
}

/**
 * Recomendaciones por producto (cliente). Cada sección puede venir vacía;
 * en ese caso el carrusel correspondiente no se muestra.
 */
export function getRecommendations(product: Product): Recommendations {
  const sameCat = productsByCategory(product.categoryId).filter((p) => p.id !== product.id)
  const complements = byId(product.complementaryIds ?? [])

  // Similares: misma categoría, mejor evaluados primero
  const similar = [...sameCat].sort((a, b) => b.rating - a.rating).slice(0, 12)

  // Comparación: el producto actual primero + similares
  const comparison = dedupe([product, ...similar]).slice(0, 4)

  // Complementa tu compra: complementos declarados; si faltan, rellena con la categoría
  const complementList = dedupe([...complements, ...similar]).slice(0, 10)

  // También compraron: complementos + populares de otras categorías (alta conversión)
  const popularOther = products
    .filter((p) => p.categoryId !== product.categoryId && p.id !== product.id)
    .sort((a, b) => b.reviews - a.reviews)
  const frequentlyBoughtTogether = dedupe([...complements, ...popularOther]).slice(0, 10)

  return { similar, comparison, complements: complementList, frequentlyBoughtTogether }
}
