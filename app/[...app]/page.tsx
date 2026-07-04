import SpaShell from '../SpaShell'

/**
 * Catch-all para las rutas client (carro, checkout, cuenta, ayuda…): body SPA
 * con la metadata base del layout. Las rutas con valor SEO (/, /producto/:id,
 * /categoria/:slug) tienen página server propia con generateMetadata (F2).
 */
export default function CatchAllPage() {
  return <SpaShell />
}
