import type { CartLine, Customer, Product, SalesMode } from '@/types'
import { getProduct } from '@/data/products'
import { priceFor } from './pricing'
import { IVA_RATE } from './format'

export interface DetailedLine {
  product: Product
  qty: number
  unitGross: number
  unitNet: number
  lineNet: number
  lineGross: number
}

export interface CartTotals {
  lines: DetailedLine[]
  net: number
  iva: number
  gross: number
  /** Ahorro total respecto al precio de lista a público. */
  savings: number
  itemCount: number
}

export function buildTotals(
  cartLines: CartLine[],
  mode: SalesMode,
  customer?: Customer | null,
): CartTotals {
  const lines: DetailedLine[] = []
  for (const line of cartLines) {
    const product = getProduct(line.productId)
    if (!product) continue
    const price = priceFor(product, line.qty, mode, customer)
    lines.push({
      product,
      qty: line.qty,
      unitGross: price.unitGross,
      unitNet: price.unitNet,
      lineNet: price.unitNet * line.qty,
      lineGross: price.unitGross * line.qty,
    })
  }

  const gross = lines.reduce((s, l) => s + l.lineGross, 0)
  const net = mode === 'b2b' ? lines.reduce((s, l) => s + l.lineNet, 0) : gross / (1 + IVA_RATE)
  const iva = gross - net
  const savings = lines.reduce(
    (s, l) => s + Math.max(0, (l.product.retailPrice - l.unitGross) * l.qty),
    0,
  )
  const itemCount = lines.reduce((s, l) => s + l.qty, 0)

  return { lines, net, iva, gross, savings, itemCount }
}
