import type { Metadata } from 'next'
import { fetchProductDetailRaw } from '@/api/product.api'
import { detailToProduct } from '@/api/adapters'
import type { BffProductDetail } from '@/api/types'
import { FALLBACK_METADATA, JsonLd, bffSeoToMetadata } from '@/lib/seo-next'
import ProductPage from '@/views/ProductPage'

/** Ficha (F2+F3): head SSR por URL + body sembrado con la ficha real. */
export const revalidate = 120

interface Params {
  params: { id: string }
}

async function getDetail(id: string): Promise<BffProductDetail | null> {
  try {
    return await fetchProductDetailRaw(id)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const detail = await getDetail(params.id)
  if (!detail) return FALLBACK_METADATA
  if (detail.seo) return bffSeoToMetadata(detail.seo, `/producto/${params.id}`)
  return {
    title: { absolute: `${detail.title} | Mimbral` },
    description: detail.description?.slice(0, 160),
    alternates: { canonical: `/producto/${params.id}` },
  }
}

export default async function Page({ params }: Params) {
  const detail = await getDetail(params.id)
  return (
    <>
      <JsonLd data={detail?.seo?.structuredData} />
      <ProductPage initialProduct={detail ? detailToProduct(detail) : undefined} />
    </>
  )
}
