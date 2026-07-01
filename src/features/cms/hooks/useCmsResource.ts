'use client'

import { useEffect, useState } from 'react'
import type { LoadState } from '@/features/cms/types'

/** Hook genérico de carga con estados loading / success / empty / error. */
export function useCmsResource<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<LoadState>('loading')
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    setState('loading')
    setError(null)
    loader()
      .then((d) => {
        if (!alive) return
        setData(d)
        setState(Array.isArray(d) && d.length === 0 ? 'empty' : 'success')
      })
      .catch((e) => {
        if (!alive) return
        setError(e instanceof Error ? e.message : 'Error desconocido')
        setState('error')
      })
    return () => {
      alive = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { state, data, error }
}
