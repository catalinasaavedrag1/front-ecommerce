/** Búsqueda: `GET /search?q=&page=&sort=&pageSize=`. */
import type { Product } from '@/types'
import { webBffRequest } from './web-bff.client'
import { cardToProduct } from './adapters'
import { registerProducts } from './registry'
import type { BffSearchPage, BffSuggestItem } from './types'

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

/**
 * Autocompletado — `GET /search/autocomplete` (BFF → search-service
 * `/search/suggest`). Devuelve términos, productos y categorías sugeridos.
 *
 * El debounce y la cancelación NO van aquí: son del hook que lo consume
 * (`useSearchAutocomplete`), para que cualquier otro llamador decida su propia
 * política sin heredar una escondida en la capa de datos.
 */
export function fetchAutocomplete(q: string, opts?: { signal?: AbortSignal }): Promise<BffSuggestItem[]> {
  return webBffRequest<BffSuggestItem[]>('/search/autocomplete', { query: { q }, signal: opts?.signal })
}

/** Sugerencias relacionadas — `GET /search/suggestions` (mismo contrato). */
export function fetchSuggestions(q: string, opts?: { signal?: AbortSignal }): Promise<BffSuggestItem[]> {
  return webBffRequest<BffSuggestItem[]>('/search/suggestions', { query: { q }, signal: opts?.signal })
}
