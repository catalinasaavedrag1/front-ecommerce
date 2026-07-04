import type { Metadata } from 'next'
import type { BffSeo } from '@/api/types'

/**
 * F2 de la migración: traducción ÚNICA del bloque `seo` del BFF (BffSeo,
 * espejo de SeoView de seo-service) a la Metadata API de Next. Un solo lugar
 * donde vive el mapeo — el front no inventa reglas SEO, solo traduce.
 */

/** Metadata por defecto cuando el BFF no está disponible (degradación). */
export const FALLBACK_METADATA: Metadata = {
  title: { absolute: 'Mimbral — Ferretería y Construcción' },
  description: 'Materiales de construcción, herramientas y más. Despacho a todo Chile o retiro en tienda.',
}

export function bffSeoToMetadata(seo: BffSeo | null | undefined, canonicalPath?: string): Metadata {
  if (!seo) return FALLBACK_METADATA
  const og = (seo.openGraph ?? {}) as Record<string, unknown>
  const tw = (seo.twitter ?? {}) as Record<string, unknown>
  return {
    // `absolute`: el title del BFF ya viene completo; no aplicar template.
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords,
    robots: seo.robots ?? (seo.indexable === false ? 'noindex,nofollow' : undefined),
    alternates: {
      canonical: seo.canonical ?? canonicalPath,
      languages: seo.hreflang?.length
        ? Object.fromEntries(seo.hreflang.map((h) => [h.hreflang, h.href]))
        : undefined,
    },
    openGraph: {
      title: (og.title as string) ?? seo.title,
      description: (og.description as string) ?? seo.description,
      images: og.image ? [String(og.image)] : undefined,
      type: 'website',
    },
    twitter: {
      card: (tw.card as 'summary' | 'summary_large_image') ?? 'summary_large_image',
      title: (tw.title as string) ?? seo.title,
      description: (tw.description as string) ?? seo.description,
    },
  }
}

/** JSON-LD (schema.org) en el HTML crudo — lo que Google lee para rich results. */
export function JsonLd({ data }: { data: Record<string, unknown>[] | undefined | null }) {
  if (!data?.length) return null
  return (
    <>
      {data.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  )
}
