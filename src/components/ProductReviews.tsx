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

/** Opiniones del producto (resumen + reseñas de muestra). */
export default function ProductReviews({ product }: { product: Product }) {
  const [open, setOpen] = useState(false)
  const seed = product.id.charCodeAt(product.id.length - 1)
  const sample = Array.from({ length: 3 }, (_, i) => {
    const r = Math.max(3, Math.min(5, Math.round(product.rating) - (i % 2)))
    return {
      author: AUTHORS[(seed + i) % AUTHORS.length],
      text: SNIPPETS[(seed + i * 2) % SNIPPETS.length],
      stars: r,
      when: ['Hace 2 semanas', 'Hace 1 mes', 'Hace 2 meses'][i],
    }
  })
  // Distribución (mock) ponderada al rating
  const dist = [5, 4, 3, 2, 1].map((s) => ({
    s,
    pct: Math.max(2, Math.round(100 * Math.exp(-Math.abs(s - product.rating) * 1.1)) / (s <= 2 ? 2 : 1)),
  }))
  const maxPct = Math.max(...dist.map((d) => d.pct))

  return (
    <section className="reviews" id="opiniones">
      <h2 className="section-title">Opiniones</h2>
      <div className="reviews__summary">
        <div className="reviews__score">
          <strong>{product.rating.toFixed(1)}</strong>
          <Rating value={product.rating} />
          <span>{product.reviews} opiniones</span>
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
      <ul className="reviews__list">
        {sample.slice(0, open ? sample.length : 2).map((rv, i) => (
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
      {!open && product.reviews > 2 && (
        <button className="btn btn--ghost btn--block reviews__more" onClick={() => setOpen(true)}>
          Ver todas las opiniones ({product.reviews})
        </button>
      )}
    </section>
  )
}
