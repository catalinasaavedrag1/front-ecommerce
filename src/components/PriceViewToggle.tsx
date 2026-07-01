import { useApp } from '@/context/AppContext'
import type { PriceView } from '@/types'

const OPTS: { key: PriceView; label: string }[] = [
  { key: 'neto', label: 'Neto' },
  { key: 'bruto', label: 'Bruto' },
  { key: 'ambos', label: 'Ambos' },
]

/** Segmentado para elegir cómo ver los precios B2B (neto / con IVA / ambos). */
export default function PriceViewToggle({ className }: { className?: string }) {
  const { priceView, setPriceView } = useApp()
  return (
    <div className={`pvtoggle ${className ?? ''}`} role="group" aria-label="Ver precios">
      <span className="pvtoggle__lbl">Ver precios:</span>
      <div className="pvtoggle__opts">
        {OPTS.map((o) => (
          <button
            key={o.key}
            type="button"
            className={priceView === o.key ? 'is-active' : ''}
            aria-pressed={priceView === o.key}
            onClick={() => setPriceView(o.key)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
