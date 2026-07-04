import type { Metadata } from 'next'
import { fetchHome } from '@/api/home.api'
import type { BffHome } from '@/api/types'
import { FALLBACK_METADATA, JsonLd, bffSeoToMetadata } from '@/lib/seo-next'
import HomePage from '@/views/HomePage'

/**
 * Home (F2+F3): head SSR con el bloque `seo` del BFF y BODY server-rendered —
 * la vista se siembra con la misma página obtenida en el servidor, así el
 * HTML inicial trae el contenido real y la hidratación coincide.
 */
export const revalidate = 300

async function getHome(): Promise<BffHome | null> {
  try {
    return await fetchHome()
  } catch {
    return null
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const home = await getHome()
  return home ? bffSeoToMetadata(home.seo, '/') : FALLBACK_METADATA
}

export default async function Page() {
  const home = await getHome()
  return (
    <>
      <JsonLd data={home?.seo?.structuredData} />
      <HomePage initialHome={home} />
    </>
  )
}
