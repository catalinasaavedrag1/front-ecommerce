import { bff, bffCartId, isBffEnabled, setBffCartId } from './bff'
import type { BffCart, BffCheckoutHandoff } from './types'

/**
 * Espejo del carrito hacia cart-service (vía BFF). El carrito local
 * (localStorage) sigue siendo la fuente de la UI: estas llamadas son
 * best-effort para que el backend conozca la intención de compra y el
 * checkout pueda hacer el handoff real. Si el BFF no está configurado o
 * falla, la experiencia local no se ve afectada.
 */

async function ensureCart(): Promise<string | null> {
  if (!isBffEnabled()) return null
  const existing = bffCartId()
  if (existing) return existing
  try {
    const cart = await bff<BffCart>('/cart', { method: 'POST' })
    setBffCartId(cart.cartId)
    return cart.cartId
  } catch {
    return null
  }
}

/** El itemId del BFF por SKU (para update/remove). */
const itemIdBySku = new Map<string, string>()

function indexItems(cart: BffCart): void {
  itemIdBySku.clear()
  for (const item of cart.items) itemIdBySku.set(item.sku, item.itemId)
}

export async function mirrorAdd(sku: string, qty: number): Promise<void> {
  const cartId = await ensureCart()
  if (!cartId) return
  try {
    const cart = await bff<BffCart>(`/cart/${cartId}/items`, {
      method: 'POST',
      body: JSON.stringify({ sku, quantity: qty }),
    })
    indexItems(cart)
  } catch {
    /* best-effort */
  }
}

export async function mirrorSetQty(sku: string, qty: number): Promise<void> {
  const cartId = bffCartId()
  if (!isBffEnabled() || !cartId) return
  const itemId = itemIdBySku.get(sku)
  try {
    const cart = itemId
      ? await bff<BffCart>(`/cart/${cartId}/items/${itemId}`, {
          method: 'PATCH',
          body: JSON.stringify({ quantity: qty }),
        })
      : await bff<BffCart>(`/cart/${cartId}/items`, {
          method: 'POST',
          body: JSON.stringify({ sku, quantity: qty }),
        })
    indexItems(cart)
  } catch {
    /* best-effort */
  }
}

export async function mirrorRemove(sku: string): Promise<void> {
  const cartId = bffCartId()
  const itemId = itemIdBySku.get(sku)
  if (!isBffEnabled() || !cartId || !itemId) return
  try {
    const cart = await bff<BffCart>(`/cart/${cartId}/items/${itemId}`, { method: 'DELETE' })
    indexItems(cart)
  } catch {
    /* best-effort */
  }
}

export function mirrorClear(): void {
  // El carrito del BFF expira solo; basta con olvidar la referencia local.
  setBffCartId(null)
  itemIdBySku.clear()
}

/**
 * Handoff real del checkout (snapshot + lock en cart-service). Devuelve null
 * si el BFF no está configurado o el handoff falla: el front continúa con su
 * confirmación local de demostración.
 */
export async function confirmCheckout(opts: {
  method: 'PICKUP' | 'DELIVERY'
  commune?: string
  region?: string
  addressLine1?: string
  storeId?: string
}): Promise<BffCheckoutHandoff | null> {
  const cartId = bffCartId()
  if (!isBffEnabled() || !cartId) return null
  try {
    return await bff<BffCheckoutHandoff>(`/checkout/${cartId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({
        fulfillmentMethod: opts.method,
        commune: opts.commune,
        region: opts.region,
        addressLine1: opts.addressLine1,
        storeId: opts.storeId,
      }),
    })
  } catch {
    return null
  }
}
