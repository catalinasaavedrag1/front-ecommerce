import type { Metadata } from 'next'
import { metadataForPath } from '@/lib/seo-next'
import GiftCardsPage from '@/views/GiftCardsPage'

/** Metadatos de seo-service (vía BFF) con respaldo propio si no responde. */
export async function generateMetadata(): Promise<Metadata> {
  return metadataForPath('/gift-cards', {
    title: { absolute: 'Gift Cards — Mimbral' },
    description: 'Regala una Gift Card Mimbral para construcción y mejoramiento del hogar.',
  })
}

export default function Page() {
  return <GiftCardsPage />
}
