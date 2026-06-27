import { useApp } from '@/context/AppContext'

/** Conmutador entre venta a personas (B2C) y empresas (B2B). */
export default function ModeSwitch() {
  const { mode, setMode } = useApp()
  return (
    <div className="modeswitch" role="tablist" aria-label="Tipo de cliente">
      <button
        role="tab"
        aria-selected={mode === 'b2c'}
        className={`modeswitch__opt ${mode === 'b2c' ? 'is-active' : ''}`}
        onClick={() => setMode('b2c')}
      >
        Personas
      </button>
      <button
        role="tab"
        aria-selected={mode === 'b2b'}
        className={`modeswitch__opt ${mode === 'b2b' ? 'is-active' : ''}`}
        onClick={() => setMode('b2b')}
      >
        Empresas
      </button>
    </div>
  )
}
