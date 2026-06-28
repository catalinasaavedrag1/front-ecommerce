import { Link, useNavigate } from 'react-router-dom'
import type { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { getVariants } from '@/utils/variants'
import ProductImage from './ProductImage'
import { formatCLP } from '@/utils/format'

/** "Compara tu producto": producto actual + similares con tabla de atributos. */
export default function CompareTable({ current, products }: { current: Product; products: Product[] }) {
  const { add } = useCart()
  const navigate = useNavigate()
  const all = [current, ...products.filter((p) => p.id !== current.id)].slice(0, 4)
  if (all.length < 2) return null

  // Atributos comparables: unión de specs (según la categoría), máximo 6
  const keys: string[] = []
  for (const p of all) for (const k of Object.keys(p.specs)) if (!keys.includes(k)) keys.push(k)
  const attrs = keys.slice(0, 6)

  const val = (p: Product, k: string) => p.specs[k] || 'No informado'
  const priceOf = (p: Product) => p.retailOffer ?? p.retailPrice

  return (
    <section className="compare">
      <h2 className="section-title">Compara tu producto</h2>
      <div className="compare__scroll">
        <table className="compare__table">
          <thead>
            <tr>
              <th className="compare__corner" scope="col"><span className="sr-only">Atributo</span></th>
              {all.map((p) => (
                <th key={p.id} className={`compare__prod ${p.id === current.id ? 'is-current' : ''}`} scope="col">
                  {p.id === current.id && <span className="compare__badge">Estás viendo</span>}
                  <Link to={`/producto/${p.id}`} className="compare__thumb"><ProductImage product={p} /></Link>
                  <span className="compare__brand">{p.brand}</span>
                  <Link to={`/producto/${p.id}`} className="compare__name">{p.name}</Link>
                  <span className="compare__price">{formatCLP(priceOf(p))}</span>
                  {getVariants(p).length || p.stock <= 0 ? (
                    <button className="btn btn--primary btn--xs compare__add" disabled={p.stock <= 0} onClick={() => navigate(`/producto/${p.id}`)}>{p.stock <= 0 ? 'Sin stock' : 'Elegir'}</button>
                  ) : (
                    <button className="btn btn--primary btn--xs compare__add" onClick={() => add(p.id, 1)}>Agregar</button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">Evaluación</th>{all.map((p) => <td key={p.id}>{p.rating.toFixed(1)} ({p.reviews})</td>)}</tr>
            <tr><th scope="row">Marca</th>{all.map((p) => <td key={p.id}>{p.brand}</td>)}</tr>
            {attrs.map((k) => (
              <tr key={k}><th scope="row">{k}</th>{all.map((p) => <td key={p.id}>{val(p, k)}</td>)}</tr>
            ))}
            <tr><th scope="row">Unidad</th>{all.map((p) => <td key={p.id}>{p.unit}</td>)}</tr>
            <tr><th scope="row">Disponibilidad</th>{all.map((p) => <td key={p.id}>{p.stock > 0 ? 'Disponible' : 'Sin stock'}</td>)}</tr>
          </tbody>
        </table>
      </div>
    </section>
  )
}
