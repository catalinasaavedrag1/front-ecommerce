/**
 * Checkout: el BFF SIEMPRE recalcula (stock, precios, promos, despacho) antes
 * de confirmar. El front solo captura datos y muestra lo que el BFF resuelve.
 *
 * Endpoints (el BFF usa cartId como identificador del checkout):
 *   GET   /checkout/:cartId
 *   POST  /checkout/:cartId/validate
 *   POST  /checkout/:cartId/delivery-options
 *   POST  /checkout/:cartId/payment-methods
 *   POST  /checkout/:cartId/confirm
 */
import { webBffRequest, isBffEnabled } from './web-bff.client'
import { getCartId } from '@/lib/session'
import type { BffCheckoutHandoff, BffCheckoutView, BffDeliveryOption, BffPaymentMethod } from './types'

/** Estado del checkout (carrito validado + opciones). */
export function getCheckout(cartId: string): Promise<BffCheckoutView> {
  return webBffRequest<BffCheckoutView>(`/checkout/${cartId}`)
}

/** Revalida el carrito para el checkout. */
export function validateCheckout(cartId: string): Promise<BffCheckoutView> {
  return webBffRequest<BffCheckoutView>(`/checkout/${cartId}/validate`, { method: 'POST' })
}

/** Opciones de despacho/retiro para el checkout. */
export function getDeliveryOptions(
  cartId: string,
  payload: { commune?: string; region?: string; addressLine1?: string },
): Promise<BffDeliveryOption[]> {
  return webBffRequest<BffDeliveryOption[]>(`/checkout/${cartId}/delivery-options`, { method: 'POST', body: payload })
}

/** Medios de pago disponibles. */
export function getPaymentMethods(cartId: string): Promise<BffPaymentMethod[]> {
  return webBffRequest<BffPaymentMethod[]>(`/checkout/${cartId}/payment-methods`, { method: 'POST' })
}

/**
 * Confirma el checkout: snapshot + lock en cart-service y creación de la orden
 * (OMS) vía BFF. Degradable: devuelve null si el BFF no está o el handoff falla,
 * para que la maqueta muestre su confirmación local de demostración.
 */
export async function confirmCheckout(opts: {
  method: 'PICKUP' | 'DELIVERY'
  commune?: string
  region?: string
  addressLine1?: string
  storeId?: string
}): Promise<BffCheckoutHandoff | null> {
  const cartId = getCartId()
  if (!isBffEnabled() || !cartId) return null
  try {
    return await webBffRequest<BffCheckoutHandoff>(`/checkout/${cartId}/confirm`, {
      method: 'POST',
      body: {
        fulfillmentMethod: opts.method,
        commune: opts.commune,
        region: opts.region,
        addressLine1: opts.addressLine1,
        storeId: opts.storeId,
      },
    })
  } catch {
    return null
  }
}
