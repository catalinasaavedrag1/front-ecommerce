import type { Metadata } from 'next'
import { metadataForPath } from '@/lib/seo-next'
import LegalPage from '@/views/LegalPage'

/** Metadatos de seo-service (vía BFF) con respaldo propio si no responde. */
export async function generateMetadata(): Promise<Metadata> {
  return metadataForPath('/legal', {
    title: { absolute: 'Información legal — Mimbral' },
    description: 'Términos y condiciones, política de privacidad y documentos legales de Mimbral.',
  })
}

export default function Page() {
  return <LegalPage />
}
