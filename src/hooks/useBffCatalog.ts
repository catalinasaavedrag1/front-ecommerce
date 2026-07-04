import { useEffect, useState } from 'react'
import type { Product } from '@/types'
import { isBffEnabled } from '@/api/web-bff.client'
import { fetchHomeProducts } from '@/api/home.api'
import { fetchCategoryProducts } from '@/api/category.api'
import { searchProducts } from '@/api/search.api'
import { fetchProductDetail } from '@/api/product.api'
import { getRegisteredProduct } from '@/api/registry'
import { getProduct as getMockProduct, products as mockProducts, productsByCategory } from '@/data/products'

/**
 * Hooks de datos con degradación elegante: si `VITE_BFF_URL` no está
 * configurada, devuelven los datos de ejemplo locales al instante (la app se
 * comporta exactamente como la maqueta). Si está configurada, cargan del BFF
 * y, ante cualquier error, vuelven a los datos locales.
 */

interface Result<T> {
  data: T
  /** true si `data` viene del BFF (datos reales). */
  live: boolean
  loading: boolean
}

function useBffList(fallback: Product[], loader: (() => Promise<Product[]>) | null, deps: unknown[]): Result<Product[]> {
  const [state, setState] = useState<Result<Product[]>>({ data: fallback, live: false, loading: loader !== null })
  useEffect(() => {
    if (!loader) {
      setState({ data: fallback, live: false, loading: false })
      return
    }
    let cancelled = false
    setState((s) => ({ ...s, loading: true }))
    loader()
      .then((items) => {
        if (!cancelled) setState({ data: items.length > 0 ? items : fallback, live: items.length > 0, loading: false })
      })
      .catch(() => {
        if (!cancelled) setState({ data: fallback, live: false, loading: false })
      })
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
  return state
}

/** Catálogo para la home (destacados/ofertas). */
export function useHomeProducts(): Result<Product[]> {
  return useBffList(mockProducts, isBffEnabled() ? fetchHomeProducts : null, [])
}

/** Productos de una categoría. */
export function useCategoryProducts(categoryId: string, slug: string, initial?: Product[]): Result<Product[]> {
  // `initial` (F3): productos ya obtenidos en el servidor; sin fetch client-side.
  const seeded = useBffList(
    productsByCategory(categoryId),
    initial || !isBffEnabled() ? null : () => fetchCategoryProducts(slug),
    [categoryId, slug],
  )
  if (initial && initial.length > 0) return { data: initial, live: true, loading: false }
  return seeded
}

/** Resultados de búsqueda (server-side con BFF; local sin él). */
export function useSearchProducts(q: string): Result<Product[]> {
  const local = q.trim()
    ? mockProducts.filter((p) => `${p.name} ${p.brand} ${p.sku}`.toLowerCase().includes(q.trim().toLowerCase()))
    : []
  return useBffList(local, isBffEnabled() && q.trim() ? () => searchProducts(q.trim()) : null, [q])
}

/** Ficha de producto: mock/registro al instante + enriquecimiento del BFF. */
export function useProductDetail(idOrSlug: string, initialLive?: Product): Result<Product | undefined> {
  const initial = initialLive ?? getRegisteredProduct(idOrSlug) ?? getMockProduct(idOrSlug)
  const [state, setState] = useState<Result<Product | undefined>>({
    data: initial,
    live: !!initialLive,
    loading: !initialLive && isBffEnabled(),
  })
  useEffect(() => {
    if (initialLive) return
    const base = getRegisteredProduct(idOrSlug) ?? getMockProduct(idOrSlug)
    if (!isBffEnabled()) {
      setState({ data: base, live: false, loading: false })
      return
    }
    let cancelled = false
    setState({ data: base, live: false, loading: true })
    fetchProductDetail(idOrSlug)
      .then((p) => {
        if (!cancelled) setState({ data: p, live: true, loading: false })
      })
      .catch(() => {
        if (!cancelled) setState({ data: base, live: false, loading: false })
      })
    return () => {
      cancelled = true
    }
  }, [idOrSlug])
  return state
}
