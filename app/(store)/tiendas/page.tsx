import type { Metadata } from 'next'
import { metadataForPath } from '@/lib/seo-next'
import StoresPage from '@/views/StoresPage'

/** Metadatos de seo-service (vía BFF) con respaldo propio si no responde. */
export async function generateMetadata(): Promise<Metadata> {
  return metadataForPath('/tiendas', {
    title: { absolute: 'Tiendas — Mimbral' },
    description: 'Direcciones, horarios y servicios de las tiendas Mimbral.',
  })
}

export default function Page() {
  return <StoresPage />
}
