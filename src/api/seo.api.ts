/**
 * Metadatos SEO por ruta — seo-service a través del web-bff-service.
 *
 * El front NO decide reglas SEO: pide el bloque de la ruta y lo traduce a la
 * Metadata API de Next (`lib/seo-next.tsx`). Quién se indexa y quién no lo
 * decide seo-service y la `SeoIndexingPolicy` del BFF (p. ej. las páginas de
 * búsqueda son `noindex, follow`).
 *
 * Las páginas que ya traen su `seo` embebido (home, ficha, categoría) no pasan
 * por acá: usan el bloque que llegó con el contenido, en una sola llamada.
 * Esto es para las rutas que no tienen un recurso del BFF detrás.
 */
import { webBffRequest } from './web-bff.client'
import type { BffSeo } from './types'

/** `GET /seo/meta?path=` — metadatos de una ruta del sitio. */
export function fetchSeoMeta(path: string): Promise<BffSeo> {
  return webBffRequest<BffSeo>('/seo/meta', { query: { path } })
}

/** `GET /seo/structured-data/product/:slug` — schema.org del producto. */
export function fetchProductStructuredData(slug: string): Promise<Record<string, unknown>[]> {
  return webBffRequest<Record<string, unknown>[]>(
    `/seo/structured-data/product/${encodeURIComponent(slug)}`
  )
}
