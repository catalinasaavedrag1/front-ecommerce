import { Link } from 'react-router-dom'

const LINKS: { label: string; to: string }[] = [
  { label: 'Términos y condiciones', to: '/legal/terminos' },
  { label: 'Privacidad', to: '/legal/privacidad' },
  { label: 'Políticas de despacho', to: '/legal/despacho' },
  { label: 'Cambios y devoluciones', to: '/legal/devoluciones' },
  { label: 'Tiendas', to: '/tiendas' },
  { label: 'Libro de reclamos', to: '/contacto?asunto=Libro de reclamos' },
  { label: 'Administración (CMS)', to: '/cms' },
]

/** Última línea legal: enlaces secundarios + copyright. */
export default function FooterLegalBar() {
  return (
    <div className="ft-legal">
      <div className="ft-legal__inner">
        <nav className="ft-legal__links" aria-label="Enlaces legales">
          {LINKS.map((l) => <Link key={l.label} to={l.to}>{l.label}</Link>)}
        </nav>
        <span className="ft-legal__copy">© {new Date().getFullYear()} Mimbral SpA · RUT 76.000.000-0 · Santiago de Chile</span>
      </div>
    </div>
  )
}
