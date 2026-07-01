import { useEffect, useState } from 'react'
import { useApp } from '@/context/AppContext'
import { comunas } from '@/data/comunas'
import { formatCLP } from '@/utils/format'
import Icon from './Icon'

/** Selector global de comuna de despacho. Ajusta precio y plazo en todo el sitio.
 *  variant "top" para la barra superior (desktop) y "bar" para la franja móvil. */
export default function DeliveryPicker({ variant = 'bar' }: { variant?: 'bar' | 'top' }) {
  const { comuna, setComuna } = useApp()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className={`locpick locpick--${variant}`}>
      <button className="locpick__btn" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="listbox">
        <Icon name="pin" />
        <span className="locpick__btn-txt">Despacha a <strong>{comuna}</strong></span>
        <Icon name="chevron" className="locpick__chev" />
      </button>

      {open && (
        <>
          <div className="locpick__backdrop" onClick={() => setOpen(false)} />
          <div className="locpick__menu" role="listbox" aria-label="Comuna de despacho">
            <div className="locpick__head">
              <Icon name="truck" /> Elige tu comuna de despacho
            </div>
            <div className="locpick__list">
              {comunas.map((c) => (
                <button
                  key={c.name}
                  role="option"
                  aria-selected={c.name === comuna}
                  className={`locpick__opt ${c.name === comuna ? 'is-active' : ''} ${!c.coverage ? 'is-off' : ''}`}
                  onClick={() => { setComuna(c.name); setOpen(false) }}
                >
                  <span className="locpick__opt-name">
                    {c.name}
                    {c.name === comuna && <Icon name="check" />}
                  </span>
                  <span className="locpick__opt-meta">
                    {c.coverage ? `${c.days <= 1 ? '24 h' : `${c.days} días`} · ${formatCLP(c.cost)}` : 'Sin cobertura'}
                  </span>
                </button>
              ))}
            </div>
            <p className="locpick__note">Plazos en días hábiles. Costo referencial; puede variar por volumen del pedido.</p>
          </div>
        </>
      )}
    </div>
  )
}
