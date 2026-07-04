'use client'

import dynamic from 'next/dynamic'

/**
 * F1: catch-all que monta el SPA existente (react-router) client-side bajo
 * Next, con URLs REALES (sin #). ssr:false porque react-router v6 no se
 * renderiza en servidor; en F2 las rutas SEO se extraen a páginas server-side
 * propias y este catch-all queda solo para las rutas client (carro, cuenta…).
 */
const AppRoot = dynamic(() => import('@/AppRoot'), { ssr: false })

export default function CatchAllPage() {
  return <AppRoot />
}
