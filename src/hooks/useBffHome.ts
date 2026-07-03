import { useEffect, useState } from 'react'
import type { Product } from '@/types'
import type { Slide } from '@/components/HeroCarousel'
import { isBffEnabled } from '@/api/web-bff.client'
import { fetchHome } from '@/api/home.api'
import { cardToProduct } from '@/api/adapters'
import { registerProducts } from '@/api/registry'
import type { BffBanner, BffHome, BffHomeSection } from '@/api/types'
import { products as mockProducts } from '@/data/products'

/**
 * Home completa desde el BFF: contenido CMS (hero, secciones, banners) +
 * productos ya enriquecidos (precio/stock/promos). Una sola llamada a
 * `GET /home`; con esto la página que arma marketing en el CMS llega tal cual
 * al cliente (CMS → cms-service → BFF → aquí). Degradación elegante: sin BFF
 * (o ante fallo) `home` queda null y la página usa su maqueta local.
 */

export interface HomeResult {
  /** Página cruda del BFF (null en modo maqueta o ante fallo). */
  home: BffHome | null
  /** Productos de todas las secciones, adaptados al tipo del front. */
  products: Product[]
  /** true si los datos vienen del BFF. */
  live: boolean
  loading: boolean
}

export function useBffHome(): HomeResult {
  const [state, setState] = useState<HomeResult>({
    home: null,
    products: mockProducts,
    live: false,
    loading: isBffEnabled(),
  })

  useEffect(() => {
    if (!isBffEnabled()) return
    let cancelled = false
    fetchHome()
      .then((home) => {
        if (cancelled) return
        const items = home.sections.flatMap((s) => s.products ?? []).map((c) => cardToProduct(c))
        registerProducts(items)
        setState({
          home,
          products: items.length > 0 ? items : mockProducts,
          live: true,
          loading: false,
        })
      })
      .catch(() => {
        if (!cancelled) setState({ home: null, products: mockProducts, live: false, loading: false })
      })
    return () => {
      cancelled = true
    }
  }, [])

  return state
}

/* ------------------- Adaptadores contenido CMS → UI ---------------------- */

function str(v: unknown): string | undefined {
  return typeof v === 'string' && v.trim() ? v : undefined
}

/** Solo rutas internas sirven para <Link>; URLs externas caen al fallback. */
function internalPath(url: string | null | undefined, fallback: string): string {
  return url && url.startsWith('/') ? url : fallback
}

const HERO_FALLBACK_BG = 'linear-gradient(120deg,#102a63,#1f4aa8)'

/** Banner del CMS → slide del carrusel de la home. */
function bannerToSlide(b: BffBanner): Slide {
  return {
    id: b.id,
    bg: HERO_FALLBACK_BG,
    eyebrow: b.name,
    title: b.altText ?? b.name,
    ctaLabel: 'Ver más',
    ctaTo: internalPath(b.targetUrl, '/ofertas'),
    imageUrl: b.desktopImageUrl ?? b.mobileImageUrl ?? undefined,
    imageAlt: b.altText ?? b.name,
  }
}

/** Bloque hero de la página CMS (data libre) → slide, si trae lo mínimo. */
function heroDataToSlide(data: Record<string, unknown>): Slide | null {
  const title = str(data.title) ?? str(data.headline)
  if (!title) return null
  return {
    id: 'cms-hero',
    bg: str(data.background) ?? str(data.backgroundColor) ?? HERO_FALLBACK_BG,
    eyebrow: str(data.eyebrow) ?? str(data.subtitle) ?? '',
    title,
    ctaLabel: str(data.ctaLabel) ?? 'Ver más',
    ctaTo: internalPath(str(data.ctaUrl) ?? str(data.link), '/ofertas'),
    imageUrl: str(data.image) ?? str(data.imageDesktop),
    imageAlt: str(data.alt) ?? title,
  }
}

/**
 * Slides del carrusel a partir del contenido CMS publicado. Prioriza los
 * banners con placement de hero; suma el bloque hero de la página si existe.
 * Devuelve [] si el CMS no publicó nada usable (la home usa sus slides locales).
 */
export function cmsSlides(home: BffHome | null): Slide[] {
  if (!home) return []
  const slides: Slide[] = []
  const hero = home.hero && typeof home.hero === 'object' ? heroDataToSlide(home.hero) : null
  if (hero) slides.push(hero)
  const banners = [...home.banners]
    .filter((b) => (b.status ?? '').toUpperCase() !== 'INACTIVE')
    .filter((b) => !b.placement || /hero/i.test(b.placement))
    .sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0))
  slides.push(...banners.map(bannerToSlide))
  return slides
}

/** Secciones CMS que traen productos (carruseles/destacados armados por marketing). */
export function cmsProductSections(home: BffHome | null): BffHomeSection[] {
  if (!home) return []
  return home.sections.filter((s) => (s.products?.length ?? 0) > 0)
}

/**
 * Banners de imagen para la franja intermedia: solo placements que NO son de
 * hero (esos ya van al carrusel). Hoy el BFF entrega el placement `home-hero`,
 * así que esta franja se activa cuando publique otros placements.
 */
export function cmsStripBanners(home: BffHome | null): BffBanner[] {
  if (!home) return []
  return home.banners.filter(
    (b) => !/hero/i.test(b.placement ?? '') && !!(b.desktopImageUrl ?? b.mobileImageUrl),
  )
}
