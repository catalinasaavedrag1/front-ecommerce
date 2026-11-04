/**
 * Checkout: el BFF SIEMPRE recalcula (stock, precios, promos, despacho) antes
 * de confirmar. El front sólo captura datos y muestra lo que el BFF resuelve.
 *
 * Endpoints (el BFF usa cartId como identificador del checkout):
 *   GET   /checkout/:cartId
 *   POST  /checkout/:cartId/validate
 *   POST  /checkout/:cartId/delivery-options
 *   POST  /checkout/:cartId/payment-methods
 *   POST  /checkout/:cartId/confirm
 *
 * Existe además el flujo largo `/checkout/sessions/*` (22 operaciones:
 * dirección, crédito, aprobaciones, orden de compra, recuperación). Esta capa
 * usa el flujo corto, que es el que la UI actual cubre.
 */
import { webBffRequest, isBffEnabled } from './web-bff.client'
import { getCartId } from '@/lib/session'
import type {
  BffCheckoutHandoff,
  BffCheckoutView,
  BffFulfillmentOption,
  BffPaymentMethod,
} from './types'

/** Estado del checkout: carrito validado + opciones de cumplimiento. */
export function getCheckout(cartId: string): Promise<BffCheckoutView> {
  return webBffRequest<BffCheckoutView>(`/checkout/${cartId}`)
}

/** Revalida el carrito para el checkout. */
export function validateCheckout(cartId: string): Promise<BffCheckoutView> {
  return webBffRequest<BffCheckoutView>(`/checkout/${cartId}/validate`, { method: 'POST' })
}

/**
 * Opciones de cumplimiento del checkout (cart-service). El BFF lee sólo
 * `commune` y `storeId` del cuerpo (`CheckoutService.getDeliveryOptions`);
 * `region`/`addressLine1` no se usan ahí, así que no se declaran.
 *
 * Devuelve `BffFulfillmentOption[]` — forma distinta a la de
 * `/delivery/options`, que es `BffDeliveryOption[]`.
 */
export function getDeliveryOptions(
  cartId: string,
  payload: { commune?: string; storeId?: string },
): Promise<BffFulfillmentOption[]> {
  return webBffRequest<BffFulfillmentOption[]>(`/checkout/${cartId}/delivery-options`, {
    method: 'POST',
    body: payload,
  })
}

/**
 * Medios de pago. Hoy el BFF devuelve siempre `[]`: ningún microservicio del
 * repo los provee (`CheckoutService.getPaymentMethods`). Queda cableado, pero
 * la UI no debe depender de que llegue algo.
 */
export function getPaymentMethods(cartId: string): Promise<BffPaymentMethod[]> {
  return webBffRequest<BffPaymentMethod[]>(`/checkout/${cartId}/payment-methods`, { method: 'POST' })
}

/**
 * Fija el cumplimiento y hace el **handoff**: snapshot + lock del carro en
 * cart-service.
 *
 * El handoff NO crea la orden ni cobra — eso ocurre downstream (checkout/oms);
 * ver `CheckoutService.confirm` del BFF. Quien llame a esto no puede anunciar
 * "compra confirmada".
 *
 * Errores: con el BFF configurado **se propagan**. Antes esta función hacía
 * `catch { return null }`, y la pantalla trataba ese null igual que el modo
 * maqueta: mostraba "Tu compra fue confirmada" con un número de pedido
 * inventado y vaciaba el carro, sin que existiera nada downstream. `null`
 * ahora significa una sola cosa: no hay BFF con el que hacer handoff.
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
  return webBffRequest<BffCheckoutHandoff>(`/checkout/${cartId}/confirm`, {
    method: 'POST',
    body: {
      fulfillmentMethod: opts.method,
      commune: opts.commune,
      region: opts.region,
      addressLine1: opts.addressLine1,
      storeId: opts.storeId,
    },
  })
}
