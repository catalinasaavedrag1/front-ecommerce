'use client'

import dynamic from 'next/dynamic'

/**
 * Monta el SPA (react-router) client-side. Compartido por el catch-all y por
 * las páginas SSR de F2: estas entregan el <head> real (metadata + JSON-LD)
 * desde el servidor y el body interactivo se hidrata aquí. ssr:false porque
 * react-router v6 no se renderiza en servidor; el body server-rendered llega
 * en F3 al desacoplar los componentes compartidos de react-router.
 */
const AppRoot = dynamic(() => import('@/AppRoot'), { ssr: false })

export default function SpaShell() {
  return <AppRoot />
}
