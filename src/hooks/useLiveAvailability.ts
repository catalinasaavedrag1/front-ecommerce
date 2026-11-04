import { useEffect, useState } from 'react'
import type { Product, ProductAvailability } from '@/types'
import { isBffEnabled } from '@/api/web-bff.client'
import { fetchAvailability } from '@/api/inventory.api'

/**
 * Disponibilidad fresca de un SKU (inventory-service-v3 vía web-bff-service).
 *
 * La ficha del BFF se cachea (120 s para B2C), así que su `availability` puede
 * llegar tibia: justo el dato que no conviene mostrar viejo. Este hook la
 * revalida en el cliente y deja el resto de la ficha intacto.
 *
 * Degradación: sin BFF, sin SKU o ante error/timeout se conserva la
 * disponibilidad que ya traía el producto. Nunca deja la ficha sin dato ni
 * bloquea el render — es lo mismo que hace el BFF con inventory (fail-open).
 */
export function useLiveAvailability(product: Product | null | undefined): {
  availability: ProductAvailability | undefined
  /** true si el dato se revalidó contra el BFF en esta visita. */
  live: boolean
  loading: boolean
} {
  const sku = product?.sku
  // Sólo se revalida lo que YA vino del BFF: en maqueta `availability` no
  // existe y pedirlo no tendría contra qué comparar.
  const enabled = isBffEnabled() && Boolean(sku) && Boolean(product?.availability)
  const [fresh, setFresh] = useState<ProductAvailability | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setFresh(null)
    if (!enabled || !sku) return
    const controller = new AbortController()
    let cancelled = false
    setLoading(true)
    fetchAvailability(sku, { signal: controller.signal })
      .then((a) => {
        if (!cancelled) setFresh(a)
      })
      .catch(() => {
        // Se mantiene la disponibilidad de la ficha.
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
      controller.abort()
    }
  }, [enabled, sku])

  return {
    availability: fresh ?? product?.availability,
    live: fresh !== null,
    loading,
  }
}
