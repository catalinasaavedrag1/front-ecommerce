import type { Metadata } from 'next'
import '../src/index.css'

/**
 * Layout raiz del cascarón Next (F1 del plan de migración).
 * En F1 la app completa se monta client-side (ver app/[[...app]]/page.tsx);
 * en F2 las páginas SEO (home/PLP/PDP) pasan a server components con
 * generateMetadata desde el bloque `seo` del BFF.
 */
export const metadata: Metadata = {
  title: { default: 'Mimbral — Ferretería y Construcción', template: '%s | Mimbral' },
  description: 'Materiales de construcción, herramientas y más. Despacho a todo Chile o retiro en tienda.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
