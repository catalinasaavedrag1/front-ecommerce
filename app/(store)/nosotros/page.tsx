import type { Metadata } from 'next'
import { metadataForPath } from '@/lib/seo-next'
import AboutPage from '@/views/AboutPage'

/** Metadatos de seo-service (vía BFF) con respaldo propio si no responde. */
export async function generateMetadata(): Promise<Metadata> {
  return metadataForPath('/nosotros', {
    title: { absolute: 'Nosotros — Mimbral' },
    description: 'Quiénes somos: Mimbral, retail de construcción y mejoramiento del hogar.',
  })
}

export default function Page() {
  return <AboutPage />
}
