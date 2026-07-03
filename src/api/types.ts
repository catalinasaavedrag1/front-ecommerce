/** Tipos de las respuestas del web-bff-service (espejo de sus *View). */

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
}

export interface BffHomeSection {
  id: string
  type: string
  title?: string
  data?: Record<string, unknown>
  products?: BffProductCard[]
}

export interface BffHome {
  hero?: Record<string, unknown> | null
  sections: BffHomeSection[]
  banners: unknown[]
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
}

export interface BffCheckoutHandoff {
  cartId: string
  snapshotId: string
  lockId: string
  status: string
  expiresAt: string
}
