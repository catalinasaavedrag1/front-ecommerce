import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import type { Product } from '@/types'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import { priceFor } from '@/utils/pricing'
import { warehouseStock } from '@/utils/catalog'
import { getVariants } from '@/utils/variants'
import { formatCLP } from '@/utils/format'
import ProductImage from './ProductImage'
import Icon from './Icon'

/** Vista tabla para compradores B2B frecuentes: SKU, marca, stock, precio y compra rápida. */
export default function ProductTable({ products }: { products: Product[] }) {
  const { mode, customer, priceView } = useApp()
  const { add } = useCart()
  const navigate = useNavigate()
  const [qtys, setQtys] = useState<Record<string, number>>({})
  const qtyOf = (id: string) => qtys[id] ?? 1
  const setQ = (id: string, n: number) => setQtys((s) => ({ ...s, [id]: Math.max(1, Math.min(999, n)) }))

  const priceCol = priceView === 'bruto' ? 'Precio con IVA' : priceView === 'ambos' ? 'Neto / c-IVA' : 'Precio neto'

  return (
    <div className="ptable-wrap">
      <table className="ptable">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Producto</th>
            <th>Marca</th>
            <th>Stock</th>
            <th className="ptable__num">{priceCol}</th>
            <th>Cant.</th>
            <th><span className="sr-only">Agregar</span></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const q = qtyOf(p.id)
            const price = priceFor(p, q, mode, customer)
            const stock = warehouseStock(p, q)
            const hasVariants = getVariants(p).length > 0
            return (
              <tr key={p.id}>
                <td className="ptable__sku">{p.sku}</td>
                <td>
                  <div className="ptable__prod">
                    <Link to={`/producto/${p.id}`} className="ptable__thumb"><ProductImage product={p} /></Link>
                    <Link to={`/producto/${p.id}`} className="ptable__name">{p.name}</Link>
                  </div>
                </td>
                <td>{p.brand}</td>
                <td className="ptable__stock">
                  <span className={`stkdot stkdot--${stock.overall}`} aria-hidden />
                  {stock.total > 0 ? `${stock.total} u.` : 'Sin stock'}
                </td>
                <td className="ptable__num">
                  {priceView === 'bruto' ? (
                    formatCLP(price.unitGross)
                  ) : priceView === 'ambos' ? (
                    <span className="ptable__both">{formatCLP(price.unitNet)}<small>{formatCLP(price.unitGross)} c/IVA</small></span>
                  ) : (
                    formatCLP(price.unitNet)
                  )}
                </td>
                <td>
                  <div className="ptable__qty">
                    <button type="button" onClick={() => setQ(p.id, q - 1)} disabled={q <= 1} aria-label="Restar">−</button>
                    <input inputMode="numeric" value={q} onChange={(e) => setQ(p.id, Number(e.target.value) || 1)} aria-label={`Cantidad de ${p.name}`} />
                    <button type="button" onClick={() => setQ(p.id, q + 1)} aria-label="Sumar">+</button>
                  </div>
                </td>
                <td>
                  {hasVariants ? (
                    <button className="btn btn--ghost btn--xs" onClick={() => navigate(`/producto/${p.id}`)}>Opciones</button>
                  ) : (
                    <button className="btn btn--primary btn--xs ptable__add" disabled={stock.total <= 0} onClick={() => add(p.id, q)} aria-label={`Agregar ${p.name}`}>
                      <Icon name="cart" /> Agregar
                    </button>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
