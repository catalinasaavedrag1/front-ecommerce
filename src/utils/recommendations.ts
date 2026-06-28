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

// Accesorios típicos que complementan una compra (brocha, rodillo, lija, discos…)
const ACCESSORY_RE = /brocha|rodillo|bandeja|lija|cinta|masking|esp[aá]tula|guante|gafas|disco|broca|sellad|fragu|frag[uü]e|adhesiv|silicona|huincha|cola fr[ií]a|set|kit|organizador|tornill|fijaci|abrazadera|conector|protector|terminal|ampolleta|extensi[oó]n|alargador|sopl|llave|destornillad/i

// Categorías cuyos productos complementan a cada categoría (compra cruzada)
const COMPLEMENTS_FROM: Record<string, string[]> = {
  pinturas: ['pinturas', 'ferreteria'],
  herramientas: ['ferreteria', 'herramientas'],
  construccion: ['herramientas', 'ferreteria'],
  ferreteria: ['herramientas', 'ferreteria'],
  gasfiteria: ['ferreteria', 'gasfiteria'],
  pisos: ['ferreteria', 'pinturas'],
  bano: ['gasfiteria', 'ferreteria', 'decoracion'],
  cocina: ['cocina', 'electrohogar', 'ferreteria'],
  electrohogar: ['ferreteria', 'automovil'],
  muebles: ['decoracion', 'dormitorio'],
  dormitorio: ['dormitorio', 'decoracion'],
  decoracion: ['decoracion', 'muebles'],
  jardin: ['herramientas', 'aire-libre', 'ferreteria'],
  'aire-libre': ['aire-libre', 'jardin'],
  automovil: ['automovil', 'ferreteria'],
}

/** Complementos reales (accesorios de categorías afines), priorizando los declarados. */
function getComplements(product: Product): Product[] {
  const declared = byId(product.complementaryIds ?? [])
  const cats = COMPLEMENTS_FROM[product.categoryId] ?? ['ferreteria']
  const pool = products.filter((p) => p.id !== product.id && cats.includes(p.categoryId))
  const accessories = pool.filter((p) => ACCESSORY_RE.test(p.name)).sort((a, b) => b.rating - a.rating)
  const rest = pool.filter((p) => !ACCESSORY_RE.test(p.name)).sort((a, b) => b.rating - a.rating)
  return dedupe([...declared, ...accessories, ...rest]).slice(0, 10)
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

  // Complementa tu compra: accesorios reales de categorías afines (brocha, lija, discos…)
  const complementList = getComplements(product)

  // También compraron: complementos + populares de otras categorías (alta conversión)
  const popularOther = products
    .filter((p) => p.categoryId !== product.categoryId && p.id !== product.id)
    .sort((a, b) => b.reviews - a.reviews)
  const frequentlyBoughtTogether = dedupe([...complements, ...complementList, ...popularOther]).slice(0, 10)

  return { similar, comparison, complements: complementList, frequentlyBoughtTogether }
}
