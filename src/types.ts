export type SalesMode = 'b2c' | 'b2b'

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  /** Descripción breve para la cabecera de la categoría. */
  blurb?: string
  /** Subcategorías de muestra. */
  subcats?: string[]
}

export interface VolumeTier {
  /** Cantidad mínima para acceder al precio */
  minQty: number
  /** Precio unitario neto (sin IVA) para empresas en este tramo */
  unitNet: number
}

export type StockLevel = 'alto' | 'bajo' | 'sin'

export interface Product {
  id: string
  sku: string
  ean?: string
  name: string
  brand: string
  supplier?: string
  categoryId: string
  /** Precio normal de venta a público, con IVA incluido (CLP) */
  retailPrice: number
  /** Precio de oferta a público con IVA incluido, si aplica */
  retailOffer?: number
  /** Precio neto base para empresas (sin IVA) */
  b2bNet: number
  /** Tramos de descuento por volumen para empresas */
  volumeTiers?: VolumeTier[]
  /** Unidad de venta: unidad, caja, m², saco, litro, etc. */
  unit: string
  /** Glifo opcional (legacy). La imagen real se genera con ProductImage. */
  image?: string
  /** Palabra(s) clave para la foto de stock del producto. */
  photo?: string
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
  /** Disponible sólo en compra online. */
  onlineOnly?: boolean
  /** Disponible sólo en tienda. */
  storeOnly?: boolean
  /** Producto que se vende contra cotización. */
  requiresQuote?: boolean
  /** Producto pesado/voluminoso (despacho especial). */
  bulky?: boolean
  /** IDs de productos complementarios sugeridos. */
  complementaryIds?: string[]
  /** Tipo de calculadora aplicable en la ficha. */
  calculator?: 'pintura' | 'piso' | 'cemento' | 'cable'
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
  /** Rol del usuario dentro de la empresa (B2B). */
  role?: 'comprador' | 'aprobador' | 'administrador' | 'finanzas'
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
