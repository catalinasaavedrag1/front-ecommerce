/**
 * Despacho / retiro. El front solo pide opciones y muestra lo que el BFF
 * resuelve (no calcula reglas de despacho).
 *
 * Endpoints:
 *   POST /delivery/options
 *   GET  /delivery/pickup-locations
 *   GET  /delivery/zones
 *   POST /delivery/quote
 */
import { webBffRequest } from './web-bff.client'
import type { BffDeliveryOption } from './types'

export function fetchDeliveryOptions(payload: {
  commune?: string
  region?: string
  addressLine1?: string
  skus?: string[]
}): Promise<BffDeliveryOption[]> {
  return webBffRequest<BffDeliveryOption[]>('/delivery/options', { method: 'POST', body: payload })
}

export function fetchPickupLocations(commune?: string): Promise<
  { storeId: string; name: string; address: string; available: boolean }[]
> {
  return webBffRequest('/delivery/pickup-locations', { query: { commune } })
}

export function fetchDeliveryZones(): Promise<{ region: string; communes: string[] }[]> {
  return webBffRequest('/delivery/zones')
}

export function quoteDelivery(payload: {
  commune?: string
  region?: string
  addressLine1?: string
  skus?: string[]
}): Promise<{ costFormatted: string; etaLabel?: string; available: boolean }> {
  return webBffRequest('/delivery/quote', { method: 'POST', body: payload })
}
