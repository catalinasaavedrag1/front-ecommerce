/** Categoría: `GET /categories/:slug` (breadcrumbs, filtros, productos…). */
import type { Product } from '@/types'
import { webBffRequest } from './web-bff.client'
import { cardToProduct } from './adapters'
import { registerProducts } from './registry'
import type { BffCategoryPage } from './types'

/** Página de categoría cruda del BFF. */
export function fetchCategoryPage(slug: string, pageSize = 48): Promise<BffCategoryPage> {
  return webBffRequest<BffCategoryPage>(`/categories/${encodeURIComponent(slug)}`, { query: { pageSize } })
}

/** Productos de una categoría, adaptados al tipo del front. */
export async function fetchCategoryProducts(slug: string, pageSize = 48): Promise<Product[]> {
  const page = await fetchCategoryPage(slug, pageSize)
  const items = page.products.map((c) => cardToProduct(c, page.category.slug))
  registerProducts(items)
  return items
}
