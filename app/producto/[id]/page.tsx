import type { Metadata } from 'next'
import { fetchProductDetailRaw } from '@/api/product.api'
import { FALLBACK_METADATA, JsonLd, bffSeoToMetadata } from '@/lib/seo-next'
import SpaShell from '../../SpaShell'

/**
 * Ficha de producto (F2): head server-side por URL — title/description/
 * canonical/robots/OG y JSON-LD Product desde el bloque `seo` del BFF.
 * Si seo-service no aportó bloque, se construye una metadata mínima honesta
 * desde la ficha (sin inventar reglas SEO). ISR corto: precio/stock cambian.
 */
export const revalidate = 120

interface Params {
  params: { id: string }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  try {
    const detail = await fetchProductDetailRaw(params.id)
    if (detail.seo) return bffSeoToMetadata(detail.seo, `/producto/${params.id}`)
    return {
      title: { absolute: `${detail.title} | Mimbral` },
      description: detail.description?.slice(0, 160),
      alternates: { canonical: `/producto/${params.id}` },
    }
  } catch {
    return FALLBACK_METADATA
  }
}

export default async function ProductPage({ params }: Params) {
  let structuredData: Record<string, unknown>[] | undefined
  try {
    const detail = await fetchProductDetailRaw(params.id)
    structuredData = detail.seo?.structuredData
  } catch {
    /* degradación: el SPA muestra su ficha local */
  }
  return (
    <>
      <JsonLd data={structuredData} />
      <SpaShell />
    </>
  )
}
