import type { Product } from '@/types'
import type { BffProductCard, BffProductDetail } from './types'

/**
 * Adapta las vistas del BFF al tipo `Product` del front, para que TODOS los
 * componentes existentes (PriceTag, ProductCard, filtros, carrito) funcionen
 * sin cambios. Los campos que el BFF no provee se completan con valores
 * neutros de presentación (rating 0, sin tramos de volumen, etc.).
 */

const IVA = 1.19

function stockFrom(status: string, available: boolean): number {
  if (!available || status === 'out_of_stock') return 0
  if (status === 'low_stock') return 10 // < 30 => nivel "bajo" en el front
  return 50 // nivel "alto"
}

export function cardToProduct(card: BffProductCard, categoryId = ''): Product {
  const gross = card.price?.listAmount ?? card.price?.amount ?? 0
  const offer = card.price?.hasDiscount ? card.price.amount : undefined
  return {
    id: card.sku,
    sku: card.sku,
    name: card.name,
    brand: card.brand ?? 'Mimbral',
    categoryId,
    retailPrice: gross,
    retailOffer: offer,
    b2bNet: Math.round((offer ?? gross) / IVA),
    unit: 'un',
    imageUrl: card.image,
    rating: 0,
    reviews: 0,
    stock: stockFrom(card.availability.status, card.available),
    stockByWarehouse: {},
    description: '',
    specs: {},
    tags: card.promotions.badges.length ? card.promotions.badges : undefined,
  }
}

export function detailToProduct(d: BffProductDetail, categoryId = ''): Product {
  const gross = d.price?.listAmount ?? d.price?.amount ?? 0
  const offer = d.price?.hasDiscount ? d.price.amount : undefined
  const specs: Record<string, string> = {}
  for (const s of d.specs) specs[s.label] = s.value
  return {
    id: d.sku,
    sku: d.sku,
    name: d.title,
    brand: d.brand ?? 'Mimbral',
    categoryId,
    retailPrice: gross,
    retailOffer: offer,
    b2bNet: Math.round((offer ?? gross) / IVA),
    unit: d.measurementUnit ?? 'un',
    imageUrl: d.images[0]?.url,
    rating: 0,
    reviews: 0,
    stock: stockFrom(d.availability.status, d.available),
    stockByWarehouse: {},
    description: d.description ?? '',
    specs,
    tags: d.promotions.badges.length ? d.promotions.badges : undefined,
  }
}
