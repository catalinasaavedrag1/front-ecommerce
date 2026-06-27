import type { Customer, Product, SalesMode } from '@/types'
import { addIVA } from './format'

export interface PriceResult {
  /** Precio unitario a mostrar, con IVA incluido (lo que paga finalmente). */
  unitGross: number
  /** Precio unitario neto (sin IVA). */
  unitNet: number
  /** Precio de lista unitario con IVA, antes de descuentos (para mostrar tachado). */
  listGross: number
  /** Fracción de descuento aplicada respecto al precio de lista (0-1). */
  discount: number
  /** Etiqueta del origen del precio. */
  source: 'retail' | 'oferta' | 'volumen' | 'corporativo'
}

/**
 * Calcula el precio unitario de un producto según el modo de venta, la cantidad
 * y el cliente. En B2C se usa el precio a público (con oferta si existe). En B2B
 * se parte del neto base, se aplican tramos por volumen y el descuento
 * corporativo del cliente; el resultado se expresa también con IVA.
 */
export function priceFor(
  product: Product,
  qty: number,
  mode: SalesMode,
  customer?: Customer | null,
): PriceResult {
  const listGross = product.retailPrice

  if (mode === 'b2c') {
    const gross = product.retailOffer ?? product.retailPrice
    return {
      unitGross: gross,
      unitNet: gross / 1.19,
      listGross,
      discount: product.retailOffer ? 1 - product.retailOffer / product.retailPrice : 0,
      source: product.retailOffer ? 'oferta' : 'retail',
    }
  }

  // B2B: arranca del neto base
  let net = product.b2bNet
  let source: PriceResult['source'] = 'retail'

  if (product.volumeTiers?.length) {
    const applicable = [...product.volumeTiers]
      .filter((t) => qty >= t.minQty)
      .sort((a, b) => b.minQty - a.minQty)[0]
    if (applicable) {
      net = applicable.unitNet
      source = 'volumen'
    }
  }

  if (customer?.corporateDiscount) {
    net = net * (1 - customer.corporateDiscount)
    source = 'corporativo'
  }

  const unitGross = addIVA(net)
  return {
    unitGross,
    unitNet: net,
    listGross,
    discount: Math.max(0, 1 - unitGross / listGross),
    source,
  }
}

/** Próximo tramo de volumen que el cliente podría alcanzar para ahorrar más. */
export function nextVolumeTier(product: Product, qty: number) {
  if (!product.volumeTiers?.length) return undefined
  return [...product.volumeTiers].sort((a, b) => a.minQty - b.minQty).find((t) => qty < t.minQty)
}
