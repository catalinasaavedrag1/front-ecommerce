/** Tipos de las respuestas del web-bff-service (espejo de sus *View).
 *
 * Verificado en vivo (BFF corriendo) el 2026-07: envelope, price, availability,
 * product-card, cart-item, filtros y promotions calzan exacto; se agregaron los
 * campos `seo`/`checkoutId`/`redirect` que faltaban (ver docs/CONTRATOS-BFF.md §5b). */

/** Espejo de SeoView del BFF (metadata para SEO/SSR). */
export interface BffSeo {
  title: string
  description?: string
  canonical?: string
  robots: string
  indexable: boolean
  keywords?: string
  openGraph?: Record<string, unknown>
  twitter?: Record<string, unknown>
  hreflang?: { hreflang: string; href: string }[]
  structuredData?: Record<string, unknown>[]
}

export interface BffPrice {
  amount: number
  formatted: string
  listAmount?: number
  listFormatted?: string
  hasDiscount: boolean
  discountLabel?: string
  currency: string
}

export interface BffAvailability {
  available: boolean
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | string
  label: string
  quantityLabel?: string
}

export interface BffProductCard {
  sku: string
  slug: string
  name: string
  url: string
  image?: string
  brand?: string
  price: BffPrice | null
  available: boolean
  availability: BffAvailability
  promotions: { badges: string[]; labels: string[] }
}

export interface BffProductDetail {
  sku: string
  slug: string
  title: string
  brand?: string
  category?: string
  url: string
  description?: string
  images: { url: string; alt?: string }[]
  specs: { label: string; value: string }[]
  measurementUnit?: string
  price: BffPrice | null
  available: boolean
  availability: BffAvailability
  promotions: { badges: string[]; labels: string[] }
  seo?: BffSeo | null
}

export interface BffFilter {
  code: string
  label: string
  options: { value: string; label: string; count: number }[]
}

/**
 * Sugerencia de autocompletado — `SuggestItem` de search-service, tal cual lo
 * reexpone el BFF en `GET /search/autocomplete` y `GET /search/suggestions`.
 * `label` es el texto a mostrar; `skuId`/`categoryId` permiten navegar directo
 * en vez de rehacer la búsqueda.
 */
export interface BffSuggestItem {
  type: 'QUERY' | 'PRODUCT' | 'CATEGORY' | (string & {})
  label: string
  skuId?: string
  categoryId?: string
}

export interface BffSearchPage {
  title: string
  query: string
  correctedQuery?: string
  total: number
  page: number
  pageSize: number
  products: BffProductCard[]
  filters: BffFilter[]
  sortOptions: { value: string; label: string }[]
  redirect?: { targetUrl: string; status: string } | null
}

export interface BffCategoryPage {
  category: { id: string; name: string; slug: string }
  breadcrumbs: { label: string; url: string }[]
  banners: unknown[]
  total: number
  page: number
  pageSize: number
  products: BffProductCard[]
  filters: BffFilter[]
  seo: BffSeo
}

export interface BffHomeSection {
  id: string
  type: string
  title?: string
  data?: Record<string, unknown>
  products?: BffProductCard[]
}

/** Banner publicado del CMS (espejo de CmsBanner que el BFF reexpone). */
export interface BffBanner {
  id: string
  name: string
  placement: string
  desktopImageUrl?: string | null
  mobileImageUrl?: string | null
  altText?: string | null
  targetUrl?: string | null
  salesChannel?: string | null
  priority: number
  status: string
}

export interface BffHome {
  hero?: Record<string, unknown> | null
  sections: BffHomeSection[]
  banners: BffBanner[]
  seo: BffSeo
}

export interface BffCartItem {
  itemId: string
  sku: string
  name: string
  image?: string
  quantity: number
  unitPriceFormatted: string
  totalFormatted: string
  availabilityStatus?: string
}

export interface BffCart {
  cartId: string
  itemCount: number
  totalQuantity: number
  currency: string
  items: BffCartItem[]
  totals: {
    subtotalFormatted: string
    discountFormatted: string
    shippingFormatted: string
    totalFormatted: string
  }
  checkoutId?: string
}

export interface BffCheckoutHandoff {
  cartId: string
  snapshotId: string
  lockId: string
  status: string
  expiresAt: string
  /** Id del checkout cuando cart-service ya lo creó. */
  checkoutId?: string | null
}

/* ------------------------------- Checkout ------------------------------- */

/**
 * Opción de despacho de `POST /delivery/options` y `/delivery/quote` —
 * `DeliveryOptionView` del BFF, que viene de **delivery-service** (no de
 * dom-service: dom no expone opciones al shopper, ver `DeliveryService` del
 * BFF).
 *
 * CORREGIDO: este tipo declaraba `available`, `etaLabel` y `storeId`, que el
 * BFF no envía, y le faltaba `id`. Son dos formas distintas y el front las
 * tenía mezcladas en una sola — la del checkout es `BffFulfillmentOption`.
 */
export interface BffDeliveryOption {
  /** `carrierId` del transportista en delivery-service. */
  id: string
  type: string
  label: string
  /** Ya formateado por el BFF, o 'Gratis'. */
  costFormatted: string
  eta?: string
}

/**
 * Opción de cumplimiento del checkout — `FulfillmentOptionView` del BFF
 * (`POST /checkout/:cartId/delivery-options`, vía cart-service). `promise` es
 * la promesa de entrega; el reparto entre bodegas lo decide DOM, no el front.
 */
export interface BffFulfillmentOption {
  /** 'PICKUP' | 'DELIVERY' | mixto, tal como lo entrega cart-service. */
  method: string
  label: string
  storeId?: string
  commune?: string
  region?: string
  costFormatted: string
  promise?: string
}

/**
 * Medio de pago. OJO: hoy el BFF devuelve siempre `[]` — ningún microservicio
 * del repo provee medios de pago (`CheckoutService.getPaymentMethods`). El
 * tipo queda para cuando exista; la UI no debe asumir que llega algo.
 */
export interface BffPaymentMethod {
  code: string
  label: string
  available: boolean
}

/**
 * Vista del checkout — `CheckoutView` del BFF.
 *
 * CORREGIDO: antes declaraba `checkoutId`/`cart`/`deliveryOptions`/`order`,
 * que no existen en la respuesta, y no declaraba `summary` ni `currency`, que
 * son el cuerpo del dato.
 */
export interface BffCheckoutView {
  cartId: string
  status: string
  currency: string
  summary: {
    subtotalFormatted: string
    discountFormatted: string
    shippingFormatted: string
    totalFormatted: string
  }
  fulfillmentOptions: BffFulfillmentOption[]
  /** Siempre vacío hoy (ver `BffPaymentMethod`). */
  paymentMethods: unknown[]
}

/* -------------------------------- Cuenta -------------------------------- */

export interface BffAddress {
  id: string
  label?: string
  addressLine1: string
  commune?: string
  region?: string
  isDefault?: boolean
}

export interface BffAccountProfile {
  customerId: string
  name: string
  email: string
  type: 'b2c' | 'b2b' | string
  company?: string
  rut?: string
  roles?: string[]
  priceListId?: string
  hasCredit?: boolean
}

/* -------------------------------- Pedidos ------------------------------- */

/**
 * Pedido en la lista — `OrderView` de web-bff-service (`OrderMapper.toView`).
 *
 * CORREGIDO contra el código del BFF: antes este tipo declaraba
 * `orderId`/`statusLabel`/`itemCount`, campos que el BFF nunca envía. Con
 * sesión real la lista quedaba sin id, con 0 ítems y todos los pedidos en
 * "preparando", porque el mapeo leía `undefined`.
 */
export interface BffOrderSummary {
  /** Id interno de la orden en OMS (el que piden `/orders/:orderId/...`). */
  id: string
  /** Número de pedido de cara al cliente (OMS `commerceId`). */
  commerceId: string
  /** Estado crudo de OMS. El front lo traduce; no viene rotulado. */
  status: string
  totalFormatted: string
  currency: string
  createdAt: string
  items: { sku?: string; name: string; quantity: number }[]
}

/** Evento del historial de la orden — `OrderTrackingView` del BFF. */
export interface BffOrderTracking {
  orderId: string
  status: string
  events: { event: string; at: string }[]
}

/** Documento tributario — `FinanceDocumentView` (finance-service). */
export interface BffOrderDocument {
  id: string
  folio?: string
  number?: string
  url?: string
  issuedAt?: string
  amount: number
}

/** Adjunto de la orden en OMS — `OrderAttachment` (`GET /orders/:id/documents`). */
export interface BffOrderAttachment {
  id: string
  type: string
  name: string
  size: number
  expireAt?: string | null
  dateCreated: string
  downloadUrl?: string
}

/**
 * Detalle de pedido — `OrderDetailView` del BFF: orden + tracking derivado del
 * historial de OMS + documentos de finance. NO extiende el resumen: es un
 * sobre con tres bloques.
 */
export interface BffOrderDetail {
  order: BffOrderSummary
  tracking: BffOrderTracking
  documents: BffOrderDocument[]
}

/* ------------------------------- Navegación ----------------------------- */

/** Item del menú publicado en el CMS (árbol recursivo). */
export interface BffMenuItem {
  id: string
  label: string
  url?: string | null
  position?: number
  isVisible?: boolean
  children?: BffMenuItem[]
}

/** Respuesta de GET /navigation: menú editorial (CMS) + categorías raíz (catálogo). */
export interface BffNavigation {
  menu: { id: string; code: string; name: string; items: BffMenuItem[] } | null
  categories: { id: string; name: string; reference: string | null }[]
}

/* ------------------------------ Autenticación --------------------------- */

export interface BffSession {
  sessionId: string
  customerId?: string
  isAuthenticated: boolean
  cartId?: string
}
