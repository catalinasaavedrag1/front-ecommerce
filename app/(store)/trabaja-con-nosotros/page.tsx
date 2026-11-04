import type { Metadata } from 'next'
import { metadataForPath } from '@/lib/seo-next'
import CareersPage from '@/views/CareersPage'

/** Metadatos de seo-service (vía BFF) con respaldo propio si no responde. */
export async function generateMetadata(): Promise<Metadata> {
  return metadataForPath('/trabaja-con-nosotros', {
    title: { absolute: 'Trabaja con nosotros — Mimbral' },
    description: 'Ofertas laborales y postulaciones en Mimbral.',
  })
}

export default function Page() {
  return <CareersPage />
}
