import { Link } from 'react-router-dom'
import type { Product } from '@/types'
import ProductCard from './ProductCard'

interface Props {
  title: string
  products: Product[]
  viewAllTo?: string
  /** Productos patrocinados (se marcan discretamente). */
  sponsoredIds?: string[]
}

/** Carrusel horizontal de productos reutilizable (peek en móvil, 4-5 en desktop). */
export default function ProductCarousel({ title, products, viewAllTo, sponsoredIds }: Props) {
  if (!products.length) return null
  return (
    <section className="pcar">
      <div className="pcar__head">
        <h2 className="section-title">{title}</h2>
        {viewAllTo && <Link to={viewAllTo} className="row__more">Ver todos →</Link>}
      </div>
      <div className="pcar__track" role="list">
        {products.map((p) => (
          <div className="pcar__item" role="listitem" key={p.id}>
            <ProductCard product={p} />
            {sponsoredIds?.includes(p.id) && <span className="pcar__sponsored">Patrocinado</span>}
          </div>
        ))}
      </div>
    </section>
  )
}
