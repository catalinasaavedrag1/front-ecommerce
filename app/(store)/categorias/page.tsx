import type { Metadata } from 'next'
import { metadataForPath } from '@/lib/seo-next'
import CategoriesPage from '@/views/CategoriesPage'

/** Metadatos de seo-service (vía BFF) con respaldo propio si no responde. */
export async function generateMetadata(): Promise<Metadata> {
  return metadataForPath('/categorias', {
    title: { absolute: 'Categorías — Mimbral' },
    description: 'Explora todas las categorías de Mimbral: construcción, herramientas, pinturas, jardín y más.',
  })
}

export default function Page() {
  return <CategoriesPage />
}
