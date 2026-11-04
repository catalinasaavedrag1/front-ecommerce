/**
 * Despacho y retiro. El front sólo pide opciones y muestra lo que el BFF
 * resuelve: no calcula reglas de despacho ni elige bodega.
 *
 * De dónde sale el dato (verificado en `web-bff-service/src/modules/delivery`):
 * la fuente storefront es **delivery-service**, no dom-service — dom no expone
 * opciones al shopper. La asignación logística definitiva (qué bodega
 * despacha) es de DOM y se resuelve en el checkout, no acá.
 *
 * La comuna se resuelve en el BFF como `body.commune ?? header x-commune`, que
 * el cliente HTTP ya envía con la comuna elegida.
 */
import { webBffRequest } from './web-bff.client'
import type { BffDeliveryOption } from './types'

/**
 * Parámetros que el BFF acepta (`DeliveryOptionsDto`). Sólo estos tres:
 * `region`/`addressLine1` no están en el DTO y se descartan, así que no se
 * declaran para no prometer un filtro que no existe.
 */
export interface DeliveryQuery {
  skus?: string[]
  cartId?: string
  commune?: string
}

/** `POST /delivery/options` — opciones de despacho para la comuna/los SKUs. */
export function fetchDeliveryOptions(payload: DeliveryQuery): Promise<BffDeliveryOption[]> {
  return webBffRequest<BffDeliveryOption[]>('/delivery/options', { method: 'POST', body: payload })
}

/**
 * `GET /delivery/pickup-locations`.
 *
 * LÍMITE REAL: hoy el BFF devuelve siempre `[]` —
 * `DeliveryService.getPickupLocations` es un stub porque no hay catálogo de
 * puntos de retiro storefront en delivery/dom. Se deja tipado como lista
 * vacía a propósito: afirmar una forma que nunca llega haría que la UI
 * mostrara campos `undefined`.
 */
export function fetchPickupLocations(commune?: string): Promise<unknown[]> {
  return webBffRequest<unknown[]>('/delivery/pickup-locations', { query: { commune } })
}

/** `GET /delivery/zones` — cobertura, tal cual la entrega delivery-service. */
export function fetchDeliveryZones(): Promise<unknown> {
  return webBffRequest<unknown>('/delivery/zones')
}

/**
 * `POST /delivery/quote` — cotización. Devuelve la MISMA lista de opciones que
 * `/delivery/options` (el BFF llama a `checkOptions` en ambos casos), no un
 * único costo: antes este tipo prometía `{ costFormatted, etaLabel, available }`.
 */
export function quoteDelivery(payload: DeliveryQuery): Promise<BffDeliveryOption[]> {
  return webBffRequest<BffDeliveryOption[]>('/delivery/quote', { method: 'POST', body: payload })
}
