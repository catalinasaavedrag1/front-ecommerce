import type { Metadata } from 'next'
import { metadataForPath } from '@/lib/seo-next'
import OffersPage from '@/views/OffersPage'

/** Metadatos de seo-service (vía BFF) con respaldo propio si no responde. */
export async function generateMetadata(): Promise<Metadata> {
  return metadataForPath('/ofertas', {
    title: { absolute: 'Ofertas — Mimbral' },
    description: 'Ofertas vigentes en materiales de construcción, herramientas y mejoramiento del hogar.',
  })
}

export default function Page() {
  return <OffersPage />
}
