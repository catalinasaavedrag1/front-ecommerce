/**
 * Carrito: el BFF (cart-service) es la fuente de verdad de totales, stock
 * validado y promociones cuando está conectado. El carrito local sigue
 * existiendo como fallback de maqueta / caída del BFF, pero NO calcula negocio
 * cuando hay BFF (ver docs/CONTRATOS-BFF.md → "Carrito y precios").
 *
 * Endpoints (prefijo del BFF, cartId en la ruta):
 *   POST   /cart
 *   GET    /cart/:cartId
 *   POST   /cart/:cartId/items
 *   PATCH  /cart/:cartId/items/:itemId
 *   DELETE /cart/:cartId/items/:itemId
 *   POST   /cart/:cartId/apply-coupon
 *   DELETE /cart/:cartId/coupon/:code
 *   POST   /cart/:cartId/validate
 */
import { webBffRequest, isBffEnabled } from './web-bff.client'
import { getCartId, setCartId } from '@/lib/session'
import type { BffCart } from './types'

/** itemId del BFF por SKU (para update/remove sin recordar ids en la UI). */
const itemIdBySku = new Map<string, string>()

function indexItems(cart: BffCart): BffCart {
  itemIdBySku.clear()
  for (const item of cart.items) itemIdBySku.set(item.sku, item.itemId)
  return cart
}

/** Crea (si hace falta) y devuelve el cartId activo. null si el BFF está off. */
export async function ensureCart(): Promise<string | null> {
  if (!isBffEnabled()) return null
  const existing = getCartId()
  if (existing) return existing
  const cart = await webBffRequest<BffCart>('/cart', { method: 'POST' })
  setCartId(cart.cartId)
  return cart.cartId
}

/** Carrito recalculado actual (o null si no hay BFF/cart). */
export async function fetchCart(): Promise<BffCart | null> {
  const cartId = getCartId()
  if (!isBffEnabled() || !cartId) return null
  const cart = await webBffRequest<BffCart>(`/cart/${cartId}`)
  return indexItems(cart)
}

/** Agrega un SKU y devuelve el carrito recalculado. */
export async function addItem(sku: string, quantity: number): Promise<BffCart | null> {
  const cartId = await ensureCart()
  if (!cartId) return null
  const cart = await webBffRequest<BffCart>(`/cart/${cartId}/items`, {
    method: 'POST',
    body: { sku, quantity },
  })
  return indexItems(cart)
}

/** Fija la cantidad de un SKU (crea el item si no existía). */
export async function setItemQty(sku: string, quantity: number): Promise<BffCart | null> {
  const cartId = getCartId()
  if (!isBffEnabled() || !cartId) return null
  const itemId = itemIdBySku.get(sku)
  const cart = itemId
    ? await webBffRequest<BffCart>(`/cart/${cartId}/items/${itemId}`, { method: 'PATCH', body: { quantity } })
    : await webBffRequest<BffCart>(`/cart/${cartId}/items`, { method: 'POST', body: { sku, quantity } })
  return indexItems(cart)
}

/** Elimina un SKU del carrito. */
export async function removeItem(sku: string): Promise<BffCart | null> {
  const cartId = getCartId()
  const itemId = itemIdBySku.get(sku)
  if (!isBffEnabled() || !cartId || !itemId) return null
  const cart = await webBffRequest<BffCart>(`/cart/${cartId}/items/${itemId}`, { method: 'DELETE' })
  return indexItems(cart)
}

/** Aplica un cupón; el BFF devuelve el carrito con el descuento ya calculado. */
export async function applyCoupon(code: string): Promise<BffCart | null> {
  const cartId = getCartId()
  if (!isBffEnabled() || !cartId) return null
  const cart = await webBffRequest<BffCart>(`/cart/${cartId}/apply-coupon`, { method: 'POST', body: { code } })
  return indexItems(cart)
}

/** Quita un cupón aplicado. */
export async function removeCoupon(code: string): Promise<BffCart | null> {
  const cartId = getCartId()
  if (!isBffEnabled() || !cartId) return null
  const cart = await webBffRequest<BffCart>(`/cart/${cartId}/coupon/${encodeURIComponent(code)}`, { method: 'DELETE' })
  return indexItems(cart)
}

/** Valida el carrito contra stock/precio antes de checkout. */
export async function validateCart(): Promise<BffCart | null> {
  const cartId = getCartId()
  if (!isBffEnabled() || !cartId) return null
  const cart = await webBffRequest<BffCart>(`/cart/${cartId}/validate`, { method: 'POST' })
  return indexItems(cart)
}

/** Olvida la referencia local del carrito (el del BFF expira solo). */
export function forgetCart(): void {
  setCartId(null)
  itemIdBySku.clear()
}

/* --------------------------------------------------------------------------
 * Compat: la UI actual mantiene el carrito local como estado visual y espeja
 * la intención al BFF (best-effort, sin romper la maqueta). Estos wrappers
 * conservan los nombres que ya consumen CartContext / CheckoutPage mientras
 * migramos la UI a "BFF manda" (Fase 4).
 * ------------------------------------------------------------------------ */

export async function mirrorAdd(sku: string, qty: number): Promise<void> {
  try {
    await addItem(sku, qty)
  } catch {
    /* best-effort */
  }
}

export async function mirrorSetQty(sku: string, qty: number): Promise<void> {
  try {
    await setItemQty(sku, qty)
  } catch {
    /* best-effort */
  }
}

export async function mirrorRemove(sku: string): Promise<void> {
  try {
    await removeItem(sku)
  } catch {
    /* best-effort */
  }
}

export function mirrorClear(): void {
  forgetCart()
}
