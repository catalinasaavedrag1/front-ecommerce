import FooterServiceStrip from './footer/FooterServiceStrip'
import FooterNewsletter from './footer/FooterNewsletter'
import FooterLinksGrid from './footer/FooterLinksGrid'
import FooterBrandBar from './footer/FooterBrandBar'
import FooterLegalBar from './footer/FooterLegalBar'

/** Footer retail: franja de servicio, newsletter, columnas, marca y legal. */
export default function Footer() {
  return (
    <footer className="ft">
      <FooterServiceStrip />
      <FooterNewsletter />
      <FooterLinksGrid />
      <FooterBrandBar />
      <FooterLegalBar />
    </footer>
  )
}
