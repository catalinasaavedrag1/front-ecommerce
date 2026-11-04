import type { Metadata } from 'next'
import { metadataForPath } from '@/lib/seo-next'
import ContactPage from '@/views/ContactPage'

/** Metadatos de seo-service (vía BFF) con respaldo propio si no responde. */
export async function generateMetadata(): Promise<Metadata> {
  return metadataForPath('/contacto', {
    title: { absolute: 'Contacto — Mimbral' },
    description: 'Escríbenos o llámanos: atención a personas y empresas en todo Chile.',
  })
}

export default function Page() {
  return <ContactPage />
}
