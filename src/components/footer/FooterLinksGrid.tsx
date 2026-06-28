import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '@/components/Icon'

type Col = { title: string; links: { label: string; to: string }[] }

/** Nota: los enlaces sin página propia apuntan a rutas reales cercanas
 *  (p. ej. /ayuda) para no dejar links muertos. */
const COLUMNS: Col[] = [
  {
    title: 'Servicio al cliente',
    links: [
      { label: 'Centro de ayuda', to: '/ayuda' },
      { label: 'Cambios y devoluciones', to: '/ayuda' },
      { label: 'Despachos', to: '/ayuda' },
      { label: 'Seguimiento de pedido', to: '/seguimiento' },
      { label: 'Medios de pago', to: '/ayuda' },
      { label: 'Contacto', to: '/ayuda' },
    ],
  },
  {
    title: 'Comprar',
    links: [
      { label: 'Categorías', to: '/categorias' },
      { label: 'Ofertas', to: '/ofertas' },
      { label: 'Ideas y proyectos', to: '/inspiracion' },
      { label: 'Mis favoritos', to: '/favoritos' },
      { label: 'Mis listas', to: '/listas' },
      { label: 'Gift cards', to: '/ayuda' },
    ],
  },
  {
    title: 'Empresas B2B',
    links: [
      { label: 'Portal Empresas', to: '/empresas' },
      { label: 'Solicitar cotización', to: '/cotizacion' },
      { label: 'Línea de crédito Mimbral', to: '/empresas/credito' },
      { label: 'Licitaciones y grandes obras', to: '/cotizacion' },
      { label: 'Convenios empresa', to: '/empresas' },
      { label: 'Atención empresas', to: '/ayuda' },
    ],
  },
  {
    title: 'Tiendas y servicios',
    links: [
      { label: 'Ver tiendas', to: '/tiendas' },
      { label: 'Patio Constructor', to: '/tiendas' },
      { label: 'Retiro en tienda', to: '/en-tienda' },
      { label: 'Despacho a domicilio', to: '/ayuda' },
      { label: 'Arriendo de herramientas', to: '/ayuda' },
      { label: 'Corte y dimensionado', to: '/ayuda' },
    ],
  },
  {
    title: 'Mimbral',
    links: [
      { label: 'Sobre nosotros', to: '/nosotros' },
      { label: 'Trabaja con nosotros', to: '/nosotros' },
      { label: 'Proveedores', to: '/nosotros' },
      { label: 'Sustentabilidad', to: '/nosotros' },
      { label: 'Ideas y proyectos', to: '/inspiracion' },
      { label: 'Contacto corporativo', to: '/ayuda' },
    ],
  },
]

function Column({ col, openByDefault }: { col: Col; openByDefault: boolean }) {
  return (
    <details className="ft-col" open={openByDefault || undefined}>
      <summary>
        <h3 className="ft-col__title">{col.title}</h3>
        <Icon name="chevron" className="ft-col-chev" />
      </summary>
      <ul>
        {col.links.map((l) => (
          <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
        ))}
      </ul>
    </details>
  )
}

/** Grilla de 5 columnas en desktop / acordeones en mobile. */
export default function FooterLinksGrid() {
  // En desktop las columnas van siempre abiertas; en mobile colapsan.
  const [desktop, setDesktop] = useState(true)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 641px)')
    const sync = () => setDesktop(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <nav className={`ft-cols ${desktop ? 'is-desktop' : ''}`} aria-label="Enlaces del pie de página">
      {COLUMNS.map((c) => <Column key={c.title} col={c} openByDefault={desktop} />)}
    </nav>
  )
}
