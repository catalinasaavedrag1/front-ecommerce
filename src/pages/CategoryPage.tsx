import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { categories, getCategory, productsByCategory } from '@/data/products'
import ProductCard from '@/components/ProductCard'

type SortKey = 'relevancia' | 'precio-asc' | 'precio-desc' | 'rating'

export default function CategoryPage() {
  const { slug = '' } = useParams()
  const category = getCategory(slug)
  const [sort, setSort] = useState<SortKey>('relevancia')
  const [onlyOffers, setOnlyOffers] = useState(false)

  const items = useMemo(() => {
    if (!category) return []
    let list = productsByCategory(category.id)
    if (onlyOffers) list = list.filter((p) => p.retailOffer)
    switch (sort) {
      case 'precio-asc':
        return [...list].sort((a, b) => (a.retailOffer ?? a.retailPrice) - (b.retailOffer ?? b.retailPrice))
      case 'precio-desc':
        return [...list].sort((a, b) => (b.retailOffer ?? b.retailPrice) - (a.retailOffer ?? a.retailPrice))
      case 'rating':
        return [...list].sort((a, b) => b.rating - a.rating)
      default:
        return list
    }
  }, [category, sort, onlyOffers])

  if (!category) {
    return (
      <div className="container empty">
        <h1>Categoría no encontrada</h1>
        <Link to="/" className="btn btn--primary">Volver al inicio</Link>
      </div>
    )
  }

  return (
    <div className="container">
      <nav className="breadcrumb">
        <Link to="/">Inicio</Link> <span>/</span> <span>{category.name}</span>
      </nav>

      <div className="cat-layout">
        <aside className="filters">
          <h3>Filtrar</h3>
          <label className="filters__check">
            <input
              type="checkbox"
              checked={onlyOffers}
              onChange={(e) => setOnlyOffers(e.target.checked)}
            />
            Solo ofertas
          </label>
          <h4>Otras categorías</h4>
          <ul className="filters__cats">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/categoria/${c.slug}`}
                  className={c.id === category.id ? 'is-active' : ''}
                >
                  {c.icon} {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <section className="cat-main">
          <div className="cat-head">
            <h1>
              {category.icon} {category.name}
            </h1>
            <div className="cat-head__tools">
              <span className="cat-head__count">{items.length} productos</span>
              <label>
                Ordenar:
                <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
                  <option value="relevancia">Relevancia</option>
                  <option value="precio-asc">Menor precio</option>
                  <option value="precio-desc">Mayor precio</option>
                  <option value="rating">Mejor evaluados</option>
                </select>
              </label>
            </div>
          </div>

          {items.length ? (
            <div className="grid">
              {items.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <p className="empty">No hay productos con esos filtros.</p>
          )}
        </section>
      </div>
    </div>
  )
}
