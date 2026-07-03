/** Ficha de producto: `GET /products/:slug`. */
import type { Product } from '@/types'
import { webBffRequest } from './web-bff.client'
import { detailToProduct } from './adapters'
import { registerProducts } from './registry'
import type { BffProductDetail } from './types'

/** Detalle crudo del BFF (imágenes, specs, precio, stock, promos, SEO…). */
export function fetchProductDetailRaw(slugOrSku: string): Promise<BffProductDetail> {
  return webBffRequest<BffProductDetail>(`/products/${encodeURIComponent(slugOrSku)}`)
}

/** Ficha completa adaptada al tipo del front. */
export async function fetchProductDetail(slugOrSku: string): Promise<Product> {
  const detail = await fetchProductDetailRaw(slugOrSku)
  const item = detailToProduct(detail)
  registerProducts([item])
  return item
}
