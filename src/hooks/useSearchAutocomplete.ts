import { useEffect, useRef, useState } from 'react'
import type { BffSuggestItem } from '@/api/types'
import { isBffEnabled } from '@/api/web-bff.client'
import { fetchAutocomplete } from '@/api/search.api'

/** Nada de pedir por cada tecla: se espera a que la escritura se asiente. */
const DEBOUNCE_MS = 250
/** Con una letra el índice devuelve ruido; no vale el viaje. */
const MIN_CHARS = 2

export interface AutocompleteState {
  items: BffSuggestItem[]
  /** true si las sugerencias vienen de search-service (no del filtro local). */
  live: boolean
  loading: boolean
}

const EMPTY: AutocompleteState = { items: [], live: false, loading: false }

/**
 * Autocompletado de búsqueda contra search-service (vía BFF).
 *
 * Política de consultas, acá y no en `search.api.ts`:
 *   - debounce de 250 ms,
 *   - mínimo 2 caracteres,
 *   - cada término nuevo aborta la petición anterior (`AbortController`), así
 *     no gana la respuesta que llegue tarde y la lista no "parpadea" a un
 *     resultado viejo,
 *   - sin BFF configurado no se pide nada: el llamador usa su filtro local.
 *
 * Ante error o timeout se devuelve `live: false` con la lista vacía, para que
 * la UI caiga a sus sugerencias locales en vez de quedarse sin nada.
 */
export function useSearchAutocomplete(term: string): AutocompleteState {
  const [state, setState] = useState<AutocompleteState>(EMPTY)
  // Guarda el término de la petición en vuelo para descartar respuestas viejas.
  const lastTerm = useRef('')

  useEffect(() => {
    const q = term.trim()
    if (!isBffEnabled() || q.length < MIN_CHARS) {
      setState(EMPTY)
      return
    }
    const controller = new AbortController()
    lastTerm.current = q
    setState((s) => ({ ...s, loading: true }))

    const timer = setTimeout(() => {
      fetchAutocomplete(q, { signal: controller.signal })
        .then((items) => {
          if (lastTerm.current !== q) return
          setState({ items, live: true, loading: false })
        })
        .catch(() => {
          if (lastTerm.current !== q) return
          setState(EMPTY)
        })
    }, DEBOUNCE_MS)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [term])

  return state
}
