'use client'

import { Suspense, type ReactNode } from 'react'
import Layout from '@/components/Layout'

/**
 * Cáscara del storefront (header, footer, nav móvil) para las rutas del grupo
 * (store). El Suspense cubre los hooks de navegación (useSearchParams) que
 * Next exige envueltos durante el prerender.
 */
export default function StoreShell({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={null}>
      <Layout>{children}</Layout>
    </Suspense>
  )
}
