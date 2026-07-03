/** Home: `GET /home`. El BFF ya arma la página (CMS + catálogo + precios…). */
import type { Product } from '@/types'
import { webBffRequest } from './web-bff.client'
import { cardToProduct } from './adapters'
import { registerProducts } from './registry'
import type { BffHome } from './types'

/** Home cruda del BFF (hero, secciones, banners). */
export function fetchHome(): Promise<BffHome> {
  return webBffRequest<BffHome>('/home')
}

/** Productos de los carruseles de la home, aplanados y adaptados al front. */
export async function fetchHomeProducts(): Promise<Product[]> {
  const home = await fetchHome()
  const cards = home.sections.flatMap((s) => s.products ?? [])
  const items = cards.map((c) => cardToProduct(c))
  registerProducts(items)
  return items
}
