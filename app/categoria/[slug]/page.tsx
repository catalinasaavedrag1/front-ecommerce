import type { Metadata } from 'next'
import { fetchCategoryPage } from '@/api/category.api'
import { FALLBACK_METADATA, JsonLd, bffSeoToMetadata } from '@/lib/seo-next'
import SpaShell from '../../SpaShell'

/**
 * Categoría / PLP (F2): head server-side por URL desde `BffCategoryPage.seo`.
 * Las URLs con filtros (?marca=…) canonicalizan a la categoría limpia hasta
 * que seo-service defina las reglas de facetas (backlog SEO #2).
 */
export const revalidate = 180

interface Params {
  params: { slug: string }
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  try {
    const page = await fetchCategoryPage(params.slug)
    return bffSeoToMetadata(page.seo, `/categoria/${params.slug}`)
  } catch {
    return FALLBACK_METADATA
  }
}

export default async function CategoryPage({ params }: Params) {
  let structuredData: Record<string, unknown>[] | undefined
  try {
    const page = await fetchCategoryPage(params.slug)
    structuredData = page.seo?.structuredData
  } catch {
    /* degradación: el SPA muestra la categoría local */
  }
  return (
    <>
      <JsonLd data={structuredData} />
      <SpaShell />
    </>
  )
}
