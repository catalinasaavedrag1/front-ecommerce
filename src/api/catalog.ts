import type { Product } from '@/types'
import { bff } from './bff'
import { cardToProduct, detailToProduct } from './adapters'
import { registerProducts } from './registry'
import type { BffCategoryPage, BffHome, BffProductDetail, BffSearchPage } from './types'

/** Productos de los carruseles de la home (aplanados y adaptados). */
export async function fetchHomeProducts(): Promise<Product[]> {
  const home = await bff<BffHome>('/home')
  const cards = home.sections.flatMap((s) => s.products ?? [])
  const items = cards.map((c) => cardToProduct(c))
  registerProducts(items)
  return items
}

/** Productos de una categoría (server-side por search-service). */
export async function fetchCategoryProducts(slug: string, pageSize = 48): Promise<Product[]> {
  const page = await bff<BffCategoryPage>(`/categories/${encodeURIComponent(slug)}?pageSize=${pageSize}`)
  const items = page.products.map((c) => cardToProduct(c, page.category.slug))
  registerProducts(items)
  return items
}

/** Búsqueda por texto. */
export async function searchProducts(q: string, pageSize = 48): Promise<Product[]> {
  const page = await bff<BffSearchPage>(`/search?q=${encodeURIComponent(q)}&pageSize=${pageSize}`)
  const items = page.products.map((c) => cardToProduct(c))
  registerProducts(items)
  return items
}

/** Ficha completa de un producto por slug/SKU. */
export async function fetchProductDetail(slugOrSku: string): Promise<Product> {
  const detail = await bff<BffProductDetail>(`/products/${encodeURIComponent(slugOrSku)}`)
  const item = detailToProduct(detail)
  registerProducts([item])
  return item
}
