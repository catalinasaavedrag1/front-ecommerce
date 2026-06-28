import { useState } from 'react'
import type { Product } from '@/types'
import Icon from './Icon'

type QA = { q: string; a: string; asker: string; ans: string; date: string; useful: number }

const ASKERS = ['Cristián', 'Paula', 'Diego', 'Valentina', 'Mauricio', 'Camila']
const BANK = [
  { q: '¿Sirve para uso profesional o solo doméstico?', a: 'Está diseñado para ambos usos según sus especificaciones; muchos maestros lo usan en obra.' },
  { q: '¿Incluye garantía y puedo pedir factura?', a: 'Sí, cuenta con garantía del fabricante y puedes solicitar boleta o factura en el checkout.' },
  { q: '¿Puedo retirarlo el mismo día en tienda?', a: 'Si hay stock en la tienda seleccionada, el retiro queda disponible el mismo día.' },
  { q: '¿Hacen despacho a regiones?', a: 'Sí, despachamos a todo Chile; el costo y la fecha se calculan según tu comuna.' },
  { q: '¿Qué mantención requiere?', a: 'Una limpieza simple después de cada uso prolonga su vida útil; revisa la guía del fabricante.' },
]

/** Preguntas y respuestas del producto: lista con autor, respuesta y votos de utilidad. */
export default function ProductQA({ product }: { product: Product }) {
  const [query, setQuery] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [draft, setDraft] = useState('')
  const [mine, setMine] = useState<QA[]>([])

  const seed = product.id.charCodeAt(product.id.length - 1)
  const n = (seed % 3) + 3
  const base: QA[] = Array.from({ length: n }, (_, i) => {
    const item = BANK[(seed + i) % BANK.length]
    return { q: item.q, a: item.a, asker: ASKERS[(seed + i) % ASKERS.length], ans: 'Equipo Mimbral', date: ['Hace 1 semana', 'Hace 3 semanas', 'Hace 1 mes', 'Hace 2 meses'][i % 4], useful: ((seed + i * 7) % 18) + 1 }
  })
  const all = [...mine, ...base]
  const total = all.length
  const filtered = query.trim() ? all.filter((x) => (x.q + x.a).toLowerCase().includes(query.toLowerCase())) : all

  const submit = () => {
    if (!draft.trim()) return
    setMine((p) => [{ q: draft.trim(), a: 'Pregunta enviada. Te responderemos por correo y aparecerá aquí.', asker: 'Tú', ans: 'Pendiente de respuesta', date: 'Recién', useful: 0 }, ...p])
    setDraft(''); setShowForm(false)
  }

  return (
    <section className="qa" id="preguntas">
      <div className="qa__top">
        <h2 className="section-title">Preguntas y respuestas <span className="qa__count">({total})</span></h2>
        <button className="btn btn--ghost btn--xs" onClick={() => setShowForm((v) => !v)}><Icon name="chat" /> Hacer una pregunta</button>
      </div>

      {showForm && (
        <div className="qa__form">
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={2} placeholder="Escribe tu pregunta sobre este producto" />
          <div className="qa__form-actions">
            <button className="btn btn--ghost" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn--primary" onClick={submit} disabled={!draft.trim()}>Enviar pregunta</button>
          </div>
        </div>
      )}

      <div className="qa__search">
        <Icon name="search" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar en preguntas" aria-label="Buscar en preguntas" />
      </div>

      <ul className="qa__list">
        {filtered.map((x, i) => (
          <li className="qacard" key={i}>
            <p className="qacard__q"><span className="qacard__badge">P</span> {x.q}</p>
            <span className="qacard__meta">Preguntado por {x.asker} · {x.date}</span>
            <div className="qacard__a">
              <span className="qacard__badge qacard__badge--a">R</span>
              <div>
                <p>{x.a}</p>
                <span className="qacard__by">Respondido por <strong>{x.ans}</strong></span>
              </div>
            </div>
            <button className="qacard__useful" aria-label="Marcar como útil"><Icon name="thumb" /> Útil ({x.useful})</button>
          </li>
        ))}
        {!filtered.length && <li className="qa__empty">No encontramos preguntas para “{query}”. ¡Haz la primera!</li>}
      </ul>
    </section>
  )
}
