import type { Metadata } from 'next'
import { metadataForPath } from '@/lib/seo-next'
import HelpPage from '@/views/HelpPage'

/** Metadatos de seo-service (vía BFF) con respaldo propio si no responde. */
export async function generateMetadata(): Promise<Metadata> {
  return metadataForPath('/ayuda', {
    title: { absolute: 'Centro de ayuda — Mimbral' },
    description: 'Respuestas sobre despacho, retiro en tienda, pagos, devoluciones y garantías.',
  })
}

export default function Page() {
  return <HelpPage />
}
