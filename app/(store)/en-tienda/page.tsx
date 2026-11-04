import type { Metadata } from 'next'
import { metadataForPath } from '@/lib/seo-next'
import EnTiendaPage from '@/views/EnTiendaPage'

/** Metadatos de seo-service (vía BFF) con respaldo propio si no responde. */
export async function generateMetadata(): Promise<Metadata> {
  return metadataForPath('/en-tienda', {
    title: { absolute: 'Compra en tienda — Mimbral' },
    description: 'Servicios y facilidades disponibles en nuestras tiendas.',
  })
}

export default function Page() {
  return <EnTiendaPage />
}
