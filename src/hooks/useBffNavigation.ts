import { useEffect, useState } from 'react'
import { isBffEnabled } from '@/api/web-bff.client'
import { fetchNavigation } from '@/api/navigation.api'
import type { BffMenuItem } from '@/api/types'
import { categoryTree, type SubCategory } from '@/data/menu'

/**
 * Árbol de subcategorías del mega-menú, administrado por marketing en el CMS
 * (menú `main`) y entregado por el BFF. Degradación elegante: sin BFF, sin
 * menú publicado o ante fallo, se usa el árbol local de la maqueta.
 *
 * Diseño: los TILES de categoría del header (íconos, blurbs) son mobiliario de
 * UX y siguen locales; lo editorial —qué subcategorías y links cuelgan de cada
 * categoría— es lo que el CMS controla.
 */

/** Saca el slug de la URL del item ("/categoria/herramientas" → "herramientas"). */
function slugOf(item: BffMenuItem): string | null {
  const url = item.url ?? ''
  const match = url.match(/\/categoria\/([a-z0-9-]+)/i)
  if (match) return match[1].toLowerCase()
  return null
}

/** Menú CMS (3 niveles) → árbol { slugCategoría: SubCategory[] } del front. */
export function menuToTree(items: BffMenuItem[]): Record<string, SubCategory[]> {
  const tree: Record<string, SubCategory[]> = {}
  for (const top of items) {
    if (top.isVisible === false) continue
    const slug = slugOf(top)
    if (!slug) continue
    const subs: SubCategory[] = (top.children ?? [])
      .filter((s) => s.isVisible !== false)
      .map((s) => ({
        name: s.label,
        children: (s.children ?? []).filter((g) => g.isVisible !== false).map((g) => g.label),
      }))
    if (subs.length > 0) tree[slug] = subs
  }
  return tree
}

interface NavigationResult {
  /** Árbol por slug de categoría: del CMS cuando live, local si no. */
  tree: Record<string, SubCategory[]>
  live: boolean
}

export function useBffNavigation(): NavigationResult {
  const [state, setState] = useState<NavigationResult>({ tree: categoryTree, live: false })

  useEffect(() => {
    if (!isBffEnabled()) return
    let cancelled = false
    fetchNavigation()
      .then((nav) => {
        if (cancelled) return
        const cmsTree = nav.menu?.items?.length ? menuToTree(nav.menu.items) : {}
        // Solo manda el CMS si publicó algo usable; si no, maqueta intacta.
        if (Object.keys(cmsTree).length > 0) {
          setState({ tree: { ...categoryTree, ...cmsTree }, live: true })
        }
      })
      .catch(() => {
        /* BFF caído: se queda el árbol local */
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
