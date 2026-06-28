import { useState, type ReactNode } from 'react'
import Icon from './Icon'

interface Props {
  title: ReactNode
  children: ReactNode
  defaultOpen?: boolean
}

/** Sección colapsable reutilizable (estilo "About this item"). */
export default function Accordion({ title, children, defaultOpen = false }: Props) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className={`acc ${open ? 'is-open' : ''}`}>
      <button className="acc__head" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="acc__title">{title}</span>
        <Icon name="chevron" className={`acc__chev ${open ? 'rot-up' : 'rot-down'}`} />
      </button>
      {open && <div className="acc__body">{children}</div>}
    </div>
  )
}
