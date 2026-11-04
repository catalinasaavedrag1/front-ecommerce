import type { Metadata } from 'next'
import { metadataForPath } from '@/lib/seo-next'
import InspirationPage from '@/views/InspirationPage'

/** Metadatos de seo-service (vía BFF) con respaldo propio si no responde. */
export async function generateMetadata(): Promise<Metadata> {
  return metadataForPath('/inspiracion', {
    title: { absolute: 'Inspiración — Mimbral' },
    description: 'Ideas y proyectos para tu casa, patio y obra.',
  })
}

export default function Page() {
  return <InspirationPage />
}
