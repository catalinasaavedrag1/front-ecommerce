export type SalesMode = 'b2c' | 'b2b'

/** Cómo mostrar los precios B2B: neto (sin IVA), bruto (con IVA) o ambos. */
export type PriceView = 'neto' | 'bruto' | 'ambos'

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

/**
 * Disponibilidad tal como la publica el BFF (`AvailabilityView` de
 * web-bff-service). `status` es el vocabulario del BFF; `label` y
 * `quantityLabel` son los textos ya resueltos para mostrar, sin cantidades.
 */
export interface ProductAvailability {
  available: boolean
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | (string & {})
  label: string
  quantityLabel?: string
}

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
  /** URL de imagen real (cuando el producto viene del BFF). */
  imageUrl?: string
  /** Palabra(s) clave para la foto de stock del producto. */
  photo?: string
  rating: number
  reviews: number
  /**
   * Unidades vendibles. En la maqueta es el stock del catálogo demo; con el
   * BFF conectado es sólo un TOPE para el selector de cantidad (ver
   * `api/adapters.ts`), porque inventory-service no publica la cantidad exacta
   * al canal. Nunca se muestra como número cuando existe `availability`.
   */
  stock: number
  /**
   * Stock por sucursal/CD (vista B2B). Sólo la maqueta lo tiene: el BFF no
   * expone el desglose por bodega al navegador, así que con el BFF conectado
   * llega vacío y la UI debe omitir el panel en vez de leerlo como "Sin stock".
   */
  stockByWarehouse: Record<string, number>
  /**
   * Disponibilidad comercial resuelta por el BFF (inventory-service-v3 ->
   * web-bff-service). Cuando viene, MANDA sobre `stock`/`stockByWarehouse`.
   * Es cualitativa a propósito: el canal muestra si se puede vender, no el
   * inventario físico ni el stock reservado.
   */
  availability?: ProductAvailability
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
  /** Variante elegida (ej. "Negro · 1 Litro"), si el producto tiene variantes. */
  variant?: string
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
  /** Total ya formateado por el BFF (manda sobre `total` cuando viene). */
  totalLabel?: string
  /** Estado tal como lo entrega el BFF, entendible para el cliente. */
  statusLabel?: string
  /**
   * Id INTERNO de la orden en OMS. `id` es el número que ve el cliente
   * (`commerceId`); las rutas `/orders/:orderId/...` del BFF piden este otro.
   */
  omsId?: string
}
