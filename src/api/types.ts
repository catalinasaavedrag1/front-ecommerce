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
}

/* ------------------------------- Checkout ------------------------------- */

export interface BffDeliveryOption {
  type: 'pickup' | 'home_delivery' | string
  label: string
  available: boolean
  costFormatted?: string
  etaLabel?: string
  storeId?: string
}

export interface BffPaymentMethod {
  code: string
  label: string
  available: boolean
}

export interface BffCheckoutView {
  checkoutId?: string
  cartId: string
  cart?: BffCart
  deliveryOptions?: BffDeliveryOption[]
  paymentMethods?: BffPaymentMethod[]
  status?: string
  order?: { orderId: string; status: string } | null
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

export interface BffOrderSummary {
  orderId: string
  createdAt: string
  statusLabel: string
  totalFormatted: string
  itemCount: number
}

export interface BffOrderDetail extends BffOrderSummary {
  items: { sku: string; name: string; quantity: number; totalFormatted: string; image?: string }[]
  fulfillment?: { method: string; statusLabel: string; trackingUrl?: string }
  documents?: { type: string; label: string; url: string }[]
  totals?: Record<string, string>
}

/* ------------------------------ Autenticación --------------------------- */

export interface BffSession {
  sessionId: string
  customerId?: string
  isAuthenticated: boolean
  cartId?: string
}
