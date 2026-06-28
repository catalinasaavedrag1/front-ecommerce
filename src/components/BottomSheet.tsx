import { useEffect, type ReactNode } from 'react'
import Icon, { type IconName } from './Icon'

interface Props {
  title: string
  icon?: IconName
  onClose: () => void
  children: ReactNode
}

/** Bottom sheet reutilizable (móvil) / modal centrado (desktop). */
export default function BottomSheet({ title, icon, onClose, children }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <div className="sheet__bar" />
        <header className={`sheet__head ${icon ? 'sheet__head--left' : ''}`}>
          {icon && <span className="sheet__head-ic"><Icon name={icon} /></span>}
          <span className="sheet__title">{title}</span>
          <button className="sheet__close" onClick={onClose} aria-label="Cerrar"><Icon name="close" /></button>
        </header>
        <div className="sheet__body">{children}</div>
      </div>
    </div>
  )
}
