import { useEffect, useRef, type ReactNode } from 'react'
import Icon, { type IconName } from './Icon'

interface Props {
  title: string
  icon?: IconName
  onClose: () => void
  children: ReactNode
}

/** Bottom sheet reutilizable (móvil) / modal centrado (desktop). */
export default function BottomSheet({ title, icon, onClose, children }: Props) {
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const prevFocus = document.activeElement as HTMLElement | null
    const sheet = sheetRef.current
    // Mueve el foco dentro del panel al abrir.
    const focusables = () => sheet?.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') ?? ([] as unknown as NodeListOf<HTMLElement>)
    const first = focusables()[0]
    ;(first ?? sheet)?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return }
      if (e.key === 'Tab') {
        const items = Array.from(focusables())
        if (!items.length) return
        const firstEl = items[0]
        const lastEl = items[items.length - 1]
        if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus() }
        else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus() }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => { document.removeEventListener('keydown', onKey); prevFocus?.focus?.() }
  }, [onClose])

  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div ref={sheetRef} tabIndex={-1} className="sheet" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
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
