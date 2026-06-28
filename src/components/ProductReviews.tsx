import { useState } from 'react'
import type { Product } from '@/types'
import Rating from './Rating'
import Icon from './Icon'

const AUTHORS = ['Carlos M.', 'María José P.', 'Rodrigo V.', 'Fernanda S.', 'Pedro A.', 'Javiera R.']
const SNIPPETS = [
  'Muy buena calidad y llegó antes de lo esperado. Lo recomiendo.',
  'Cumple bien para el uso que le doy en obra. Buen precio.',
  'Tal cual la descripción. Retiré en tienda sin problemas.',
  'Buen producto, aunque el despacho se demoró un poco.',
  'Excelente relación precio/calidad, volvería a comprar.',
  'Resistente y bien terminado. Ideal para proyectos del hogar.',
]

type Review = { author: string; text: string; stars: number; when: string }

/** Opiniones del producto: resumen + reseñas + formulario para agregar opinión. */
export default function ProductReviews({ product }: { product: Product }) {
  const [open, setOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [mine, setMine] = useState<Review[]>([])
  const [form, setForm] = useState({ author: '', text: '', stars: 5 })

  const seed = product.id.charCodeAt(product.id.length - 1)
  const sample: Review[] = Array.from({ length: 3 }, (_, i) => {
    const r = Math.max(3, Math.min(5, Math.round(product.rating) - (i % 2)))
    return {
      author: AUTHORS[(seed + i) % AUTHORS.length],
      text: SNIPPETS[(seed + i * 2) % SNIPPETS.length],
      stars: r,
      when: ['Hace 2 semanas', 'Hace 1 mes', 'Hace 2 meses'][i],
    }
  })
  const all = [...mine, ...sample]
  const total = product.reviews + mine.length
  const avg = mine.length
    ? (product.rating * product.reviews + mine.reduce((s, r) => s + r.stars, 0)) / total
    : product.rating

  const dist = [5, 4, 3, 2, 1].map((s) => ({
    s,
    pct: Math.max(2, Math.round(100 * Math.exp(-Math.abs(s - avg) * 1.1)) / (s <= 2 ? 2 : 1)),
  }))
  const maxPct = Math.max(...dist.map((d) => d.pct))

  const submit = () => {
    if (!form.text.trim()) return
    setMine((prev) => [{ author: form.author.trim() || 'Cliente Mimbral', text: form.text.trim(), stars: form.stars, when: 'Recién' }, ...prev])
    setForm({ author: '', text: '', stars: 5 })
    setShowForm(false)
  }

  return (
    <section className="reviews" id="opiniones">
      <div className="reviews__top">
        <h2 className="section-title">Opiniones</h2>
        <button className="btn btn--ghost btn--xs" onClick={() => setShowForm((v) => !v)}>
          <Icon name="star" /> Escribir opinión
        </button>
      </div>

      <div className="reviews__summary">
        <div className="reviews__score">
          <strong>{avg.toFixed(1)}</strong>
          <Rating value={avg} />
          <span>{total} opiniones</span>
        </div>
        <ul className="reviews__bars">
          {dist.map((d) => (
            <li key={d.s}>
              <span className="reviews__bars-n">{d.s}<Icon name="star" filled /></span>
              <span className="reviews__bar"><span style={{ width: `${(d.pct / maxPct) * 100}%` }} /></span>
            </li>
          ))}
        </ul>
      </div>

      {showForm && (
        <div className="reviewform">
          <span className="reviewform__label">Tu evaluación</span>
          <div className="reviewform__stars" role="radiogroup" aria-label="Evaluación">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" role="radio" aria-checked={form.stars === n} aria-label={`${n} estrellas`}
                className={`reviewform__star ${n <= form.stars ? 'is-on' : ''}`} onClick={() => setForm({ ...form, stars: n })}>
                <Icon name="star" filled={n <= form.stars} />
              </button>
            ))}
          </div>
          <input className="reviewform__name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} placeholder="Tu nombre (opcional)" />
          <textarea className="reviewform__text" value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="Cuéntanos tu experiencia con este producto" rows={3} />
          <div className="reviewform__actions">
            <button className="btn btn--ghost" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn--primary" onClick={submit} disabled={!form.text.trim()}>Publicar opinión</button>
          </div>
        </div>
      )}

      <ul className="reviews__list">
        {all.slice(0, open ? all.length : 3).map((rv, i) => (
          <li key={i} className="reviewcard">
            <div className="reviewcard__head">
              <span className="reviewcard__author">{rv.author}</span>
              <span className="reviewcard__when">{rv.when}</span>
            </div>
            <Rating value={rv.stars} />
            <p>{rv.text}</p>
          </li>
        ))}
      </ul>
      {!open && all.length > 3 && (
        <button className="btn btn--ghost btn--block reviews__more" onClick={() => setOpen(true)}>
          Ver todas las opiniones ({total})
        </button>
      )}
    </section>
  )
}
