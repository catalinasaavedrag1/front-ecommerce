import type { Metadata } from 'next'
import { metadataForPath } from '@/lib/seo-next'
import B2BPortalPage from '@/views/B2BPortalPage'

/** Metadatos de seo-service (vía BFF) con respaldo propio si no responde. */
export async function generateMetadata(): Promise<Metadata> {
  return metadataForPath('/empresas', {
    title: { absolute: 'Portal Empresas — Mimbral' },
    description: 'Precios netos, descuentos por volumen, línea de crédito y despacho a faena para empresas.',
  })
}

export default function Page() {
  return <B2BPortalPage />
}
