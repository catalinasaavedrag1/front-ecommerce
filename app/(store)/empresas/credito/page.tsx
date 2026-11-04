import type { Metadata } from 'next'
import { metadataForPath } from '@/lib/seo-next'
import CreditPage from '@/views/CreditPage'

/** Metadatos de seo-service (vía BFF) con respaldo propio si no responde. */
export async function generateMetadata(): Promise<Metadata> {
  return metadataForPath('/empresas/credito', {
    title: { absolute: 'Línea de crédito para empresas — Mimbral' },
    description: 'Compra con crédito Mimbral: plazos comerciales, cupos y condiciones para tu empresa.',
  })
}

export default function Page() {
  return <CreditPage />
}
