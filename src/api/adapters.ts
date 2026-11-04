import type { Product } from '@/types'
import type { BffAvailability, BffProductCard, BffProductDetail } from './types'

/**
 * Adapta las vistas del BFF al tipo `Product` del front, para que TODOS los
 * componentes existentes (PriceTag, ProductCard, filtros, carrito) funcionen
 * sin cambios. Los campos que el BFF no provee se completan con valores
 * neutros de presentación (rating 0, sin tramos de volumen, etc.).
 */

const IVA = 1.19

/**
 * Tope del selector de cantidad cuando la cantidad exacta NO se publica al
 * canal. inventory-service-v3 entrega `availableStock` al BFF, y el BFF lo
 * traduce a una etiqueta cualitativa a propósito (`AvailabilityMapper`): el
 * navegador no recibe unidades. Antes se devolvía 10/50 aquí y la ficha los
 * imprimía como si fueran stock real ("50 unidades disponibles").
 *
 * No es stock: es el máximo que el stepper permite pedir. La disponibilidad
 * que se MUESTRA viaja en `Product.availability`.
 */
const TOPE_CANTIDAD_SIN_DATO = 30

/** 0 si no es vendible; si lo es, el tope del stepper (nunca se muestra). */
function sellableUnits(availability: BffAvailability, available: boolean): number {
  if (!available || availability.status === 'out_of_stock' || !availability.available) return 0
  return TOPE_CANTIDAD_SIN_DATO
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
    stock: sellableUnits(card.availability, card.available),
    // El BFF no expone el desglose por bodega al navegador (ver types.ts).
    stockByWarehouse: {},
    availability: card.availability,
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
    stock: sellableUnits(d.availability, d.available),
    // El BFF no expone el desglose por bodega al navegador (ver types.ts).
    stockByWarehouse: {},
    availability: d.availability,
    description: d.description ?? '',
    specs,
    tags: d.promotions.badges.length ? d.promotions.badges : undefined,
  }
}
