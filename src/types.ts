export type SalesMode = 'b2c' | 'b2b'

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
}

export interface VolumeTier {
  /** Cantidad mínima para acceder al precio */
  minQty: number
  /** Precio unitario neto (sin IVA) para empresas en este tramo */
  unitNet: number
}

export interface Product {
  id: string
  sku: string
  name: string
  brand: string
  categoryId: string
  /** Precio normal de venta a público, con IVA incluido (CLP) */
  retailPrice: number
  /** Precio de oferta a público con IVA incluido, si aplica */
  retailOffer?: number
  /** Precio neto base para empresas (sin IVA) */
  b2bNet: number
  /** Tramos de descuento por volumen para empresas */
  volumeTiers?: VolumeTier[]
  unit: string
  image: string
  rating: number
  reviews: number
  /** Stock total disponible a público */
  stock: number
  /** Stock por sucursal/centro de distribución, usado en vista B2B */
  stockByWarehouse: Record<string, number>
  description: string
  specs: Record<string, string>
  tags?: string[]
  freeShipping?: boolean
}

export interface CartLine {
  productId: string
  qty: number
}

export interface Customer {
  name: string
  email: string
  type: SalesMode
  /** Razón social (B2B) */
  company?: string
  /** RUT empresa o persona */
  rut?: string
  /** Línea de crédito aprobada (B2B), CLP */
  creditLine?: number
  creditUsed?: number
  /** Descuento corporativo adicional (fracción 0-1) */
  corporateDiscount?: number
  priceList?: string
}

export interface QuoteRequest {
  id: string
  createdAt: string
  lines: CartLine[]
  status: 'enviada' | 'en_revision' | 'aprobada'
  netTotal: number
}

export interface OrderRecord {
  id: string
  date: string
  mode: SalesMode
  total: number
  status: 'preparando' | 'despachado' | 'entregado'
  items: number
}
