import { useEffect, useState } from 'react'
import type { BffFulfillmentOption } from '@/api/types'
import { isBffEnabled } from '@/api/web-bff.client'
import { getCartId } from '@/lib/session'
import { getDeliveryOptions } from '@/api/checkout.api'

/**
 * Opciones de cumplimiento del carro — `POST /checkout/:cartId/delivery-options`
 * (cart-service a través del BFF).
 *
 * Esto es lo que trae la **promesa de entrega** (`promise`) y el costo ya
 * formateado para cada método. La promesa la resuelve el backend; el front la
 * muestra y no la calcula: las fechas locales de la maqueta son un relleno de
 * demostración, no un compromiso.
 *
 * Qué NO hace: elegir bodega. La asignación logística es de dom-service y se
 * decide en el checkout del lado del servidor — el navegador no participa.
 *
 * Degradación: sin BFF, sin carro o ante error queda `options: []` y la
 * pantalla sigue con sus valores locales.
 */
export function useFulfillmentOptions(commune?: string): {
  options: BffFulfillmentOption[]
  /** Opción para un método ('DELIVERY' | 'PICKUP'), si el backend la ofrece. */
  optionFor: (method: string) => BffFulfillmentOption | undefined
  loading: boolean
} {
  const [options, setOptions] = useState<BffFulfillmentOption[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const cartId = getCartId()
    if (!isBffEnabled() || !cartId) {
      setOptions([])
      return
    }
    let cancelled = false
    setLoading(true)
    getDeliveryOptions(cartId, { commune: commune || undefined })
      .then((res) => {
        if (!cancelled) setOptions(res ?? [])
      })
      .catch(() => {
        // Sin opciones del backend la pantalla usa sus valores locales.
        if (!cancelled) setOptions([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [commune])

  return {
    options,
    optionFor: (method: string) =>
      options.find((o) => o.method?.toUpperCase() === method.toUpperCase()),
    loading,
  }
}
