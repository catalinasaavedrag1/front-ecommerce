import type { Metadata } from 'next'
import { metadataForPath } from '@/lib/seo-next'
import ServicesPage from '@/views/ServicesPage'

/** Metadatos de seo-service (vía BFF) con respaldo propio si no responde. */
export async function generateMetadata(): Promise<Metadata> {
  return metadataForPath('/servicios', {
    title: { absolute: 'Servicios — Mimbral' },
    description: 'Asesoría, despacho, instalación y servicios para tu proyecto.',
  })
}

export default function Page() {
  return <ServicesPage />
}
