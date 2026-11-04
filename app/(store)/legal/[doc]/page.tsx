import type { Metadata } from 'next'
import { metadataForPath } from '@/lib/seo-next'
import LegalPage from '@/views/LegalPage'

type Params = { params: { doc: string } }

/**
 * Metadatos de seo-service (vía BFF) por documento legal, con respaldo propio.
 * Cada documento es una URL distinta: pedir el bloque por ruta evita que todos
 * compartan el mismo title/canonical (contenido duplicado para el buscador).
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return metadataForPath(`/legal/${params.doc}`, {
    title: { absolute: 'Información legal — Mimbral' },
    description: 'Términos y condiciones, política de privacidad y documentos legales de Mimbral.',
    alternates: { canonical: `/legal/${params.doc}` },
  })
}

export default function Page() {
  return <LegalPage />
}
