import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { products } from '@/data/products'
import ProductCard from '@/components/ProductCard'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').toLowerCase().trim()

  const results = useMemo(() => {
    if (!q) return []
    return products.filter((p) =>
      [p.name, p.brand, p.sku, ...(p.tags ?? [])]
        .join(' ')
        .toLowerCase()
        .includes(q),
    )
  }, [q])

  return (
    <div className="container">
      <h1 className="page-title">
        {q ? `Resultados para “${q}”` : 'Buscar'}
      </h1>
      {q && <p className="lead">{results.length} productos encontrados</p>}

      {results.length ? (
        <div className="grid">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <p>{q ? 'No encontramos productos con ese término.' : 'Escribe en la barra de búsqueda.'}</p>
          <Link to="/" className="btn btn--primary">Ver catálogo</Link>
        </div>
      )}
    </div>
  )
}
