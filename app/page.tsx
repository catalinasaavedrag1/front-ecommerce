import type { Metadata } from 'next'
import { fetchHome } from '@/api/home.api'
import { FALLBACK_METADATA, JsonLd, bffSeoToMetadata } from '@/lib/seo-next'
import SpaShell from './SpaShell'

/**
 * Home (F2): el <head> se resuelve EN EL SERVIDOR con el bloque `seo` que el
 * BFF compone (seo-service → BFF → aquí). ISR alineado al cache del BFF.
 * Degradación: sin BFF, metadata por defecto y el SPA opera en modo maqueta.
 */
export const revalidate = 300

export async function generateMetadata(): Promise<Metadata> {
  try {
    const home = await fetchHome()
    return bffSeoToMetadata(home.seo, '/')
  } catch {
    return FALLBACK_METADATA
  }
}

export default async function HomePage() {
  let structuredData: Record<string, unknown>[] | undefined
  try {
    const home = await fetchHome()
    structuredData = home.seo?.structuredData
  } catch {
    /* BFF no disponible: sin JSON-LD; el SPA degrada solo */
  }
  return (
    <>
      <JsonLd data={structuredData} />
      <SpaShell />
    </>
  )
}
