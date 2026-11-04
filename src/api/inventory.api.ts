/**
 * Disponibilidad por SKU — inventory-service-v3 a través del web-bff-service.
 *
 * Por qué existe aparte de la ficha: el BFF cachea la ficha de producto (120 s
 * para B2C, ver `ProductService.getProductPage`), así que su bloque
 * `availability` puede llegar tibio. Este endpoint es el dato fresco y barato
 * para refrescarlo sin volver a pedir toda la ficha.
 *
 * Lo que NO hace, a propósito:
 *   - no reserva stock (eso es de OMS/DOM en el checkout),
 *   - no pide ni expone el desglose por bodega ni posiciones físicas del WMS,
 *   - no recibe cantidades: el BFF entrega una etiqueta cualitativa.
 */
import type { ProductAvailability } from '@/types'
import { webBffRequest } from './web-bff.client'

/** `GET /products/:sku/availability` → `AvailabilityView` del BFF. */
export function fetchAvailability(sku: string, opts?: { signal?: AbortSignal }): Promise<ProductAvailability> {
  return webBffRequest<ProductAvailability>(`/products/${encodeURIComponent(sku)}/availability`, {
    signal: opts?.signal,
  })
}

/**
 * Lote por fan-out, igual que hace el BFF contra inventory (el servicio no
 * tiene batch de lectura). Fail-open por SKU: un SKU que falla no rompe la
 * grilla, simplemente queda sin dato fresco.
 */
export async function fetchAvailabilityBatch(
  skus: string[],
  opts?: { signal?: AbortSignal }
): Promise<Record<string, ProductAvailability>> {
  const unique = [...new Set(skus.filter(Boolean))]
  const settled = await Promise.allSettled(unique.map((sku) => fetchAvailability(sku, opts)))
  const out: Record<string, ProductAvailability> = {}
  settled.forEach((r, i) => {
    if (r.status === 'fulfilled') out[unique[i]] = r.value
  })
  return out
}
