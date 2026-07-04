import { useState, type FormEvent } from 'react'
import PageHero from '@/components/PageHero'
import Icon from '@/components/Icon'

const steps = [
  { key: 'recibido', label: 'Pedido recibido', desc: 'Confirmamos tu compra' },
  { key: 'preparando', label: 'En preparación', desc: 'Estamos armando tu pedido' },
  { key: 'despachado', label: 'Despachado', desc: 'Va en camino a tu dirección' },
  { key: 'entregado', label: 'Entregado', desc: 'Pedido recibido' },
]

export default function TrackingPage() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<{ code: string; current: number } | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const clean = code.trim()
    if (!clean) return
    // Demostración: el estado se deriva del código ingresado.
    const current = (clean.length % 3) + 1
    setResult({ code: clean.toUpperCase(), current })
  }

  return (
    <div>
      <PageHero
        eyebrow="Estado de tu compra"
        title="Seguimiento de pedido"
        icon="📦"
        subtitle="Ingresa tu número de pedido (ej. MIM-528413) para ver su estado."
      />
      <div className="container track">
        <form className="track-form" onSubmit={submit}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="N° de pedido, ej. MIM-528413"
            aria-label="Número de pedido"
          />
          <button type="submit" className="btn btn--primary">Buscar</button>
        </form>

        {result && (
          <div className="panel track-result">
            <div className="track-result__head">
              <div>
                <span className="dashcard__label">Pedido</span>
                <strong>{result.code}</strong>
              </div>
              <span className="status status--despachado">{steps[result.current].label}</span>
            </div>
            <ol className="timeline">
              {steps.map((s, i) => (
                <li
                  key={s.key}
                  className={`timeline__step ${i < result.current ? 'is-done' : ''} ${i === result.current ? 'is-current' : ''}`}
                >
                  <span className="timeline__dot" aria-hidden>{i < result.current ? '✓' : i + 1}</span>
                  <div>
                    <strong>{s.label}</strong>
                    <span>{s.desc}</span>
                  </div>
                </li>
              ))}
            </ol>
            <p className="track-result__eta"><Icon name="calendar" /> Entrega estimada: 1-3 días hábiles</p>
          </div>
        )}
      </div>
    </div>
  )
}
