import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'

interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
  icon?: string
  children?: ReactNode
  crumb?: string
}

/** Cabecera consistente para las páginas de contenido (ayuda, tiendas, etc.). */
export default function PageHero({ eyebrow, title, subtitle, children, crumb }: Props) {
  return (
    <div className="pagehero">
      <div className="pagehero__inner">
        <nav className="breadcrumb breadcrumb--light">
          <Link to="/">Inicio</Link> <span>/</span> <span>{crumb ?? title}</span>
        </nav>
        {eyebrow && <span className="pagehero__eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
        {children && <div className="pagehero__actions">{children}</div>}
      </div>
    </div>
  )
}
