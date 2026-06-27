import { useEffect, useState } from 'react'

/**
 * Devuelve `true` durante un breve lapso cada vez que cambian las dependencias,
 * para dar feedback de carga (skeletons) al filtrar, ordenar o buscar.
 */
export function useBriefLoading(deps: unknown[], ms = 260): boolean {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), ms)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return loading
}
