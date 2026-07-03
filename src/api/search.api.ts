/** Búsqueda: `GET /search?q=&page=&sort=&pageSize=`. */
import type { Product } from '@/types'
import { webBffRequest } from './web-bff.client'
import { cardToProduct } from './adapters'
import { registerProducts } from './registry'
import type { BffSearchPage } from './types'

/** Página de resultados cruda (total, filtros, facets, orden…). */
export function fetchSearchPage(
  q: string,
  opts: { page?: number; sort?: string; pageSize?: number } = {},
): Promise<BffSearchPage> {
  return webBffRequest<BffSearchPage>('/search', {
    query: { q, page: opts.page, sort: opts.sort, pageSize: opts.pageSize ?? 48 },
  })
}

/** Búsqueda por texto, productos adaptados. */
export async function searchProducts(q: string, pageSize = 48): Promise<Product[]> {
  const page = await fetchSearchPage(q, { pageSize })
  const items = page.products.map((c) => cardToProduct(c))
  registerProducts(items)
  return items
}
