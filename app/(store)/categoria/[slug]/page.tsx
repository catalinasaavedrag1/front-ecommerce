import type { Metadata } from 'next'
import { fetchCategoryPage } from '@/api/category.api'
import { cardToProduct } from '@/api/adapters'
import type { BffCategoryPage } from '@/api/types'
import { FALLBACK_METADATA, JsonLd, bffSeoToMetadata } from '@/lib/seo-next'
import CategoryPage from '@/views/CategoryPage'

/** Categoría/PLP (F2+F3): head SSR por URL + body sembrado con los productos reales. */
export const revalidate = 180

interface Params {
  params: { slug: string }
}

async function getPage(slug: string): Promise<BffCategoryPage | null> {
  try {
    return await fetchCategoryPage(slug)
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const page = await getPage(params.slug)
  return page ? bffSeoToMetadata(page.seo, `/categoria/${params.slug}`) : FALLBACK_METADATA
}

export default async function Page({ params }: Params) {
  const page = await getPage(params.slug)
  const initial = page ? page.products.map((c) => cardToProduct(c, page.category.slug)) : undefined
  return (
    <>
      <JsonLd data={page?.seo?.structuredData} />
      <CategoryPage initialProducts={initial} />
    </>
  )
}
