import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { categories, products } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import { CategoryIcon } from '@/components/Icon'
import { ProductGridSkeleton } from '@/components/Skeleton'
import { useBriefLoading } from '@/hooks/useBriefLoading'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = (params.get('q') ?? '').toLowerCase().trim()
  const loading = useBriefLoading([q])

  const results = useMemo(() => {
    if (!q) return []
    return products.filter((p) =>
      [p.name, p.brand, p.sku, ...(p.tags ?? [])].join(' ').toLowerCase().includes(q),
    )
  }, [q])

  // Categorías relacionadas (por coincidencia en sus productos) para el estado vacío.
  const related = useMemo(() => {
    if (!q) return categories.slice(0, 6)
    const ids = new Set(
      products.filter((p) => `${p.name} ${p.brand}`.toLowerCase().includes(q)).map((p) => p.categoryId),
    )
    const rel = categories.filter((c) => ids.has(c.id))
    return (rel.length ? rel : categories).slice(0, 6)
  }, [q])

  return (
    <div className="container">
      <nav className="breadcrumb"><Link to="/">Inicio</Link> <span>/</span> <span>Búsqueda</span></nav>
      <h1 className="page-title">{q ? `Resultados para “${q}”` : 'Buscar'}</h1>
      {q && !loading && results.length > 0 && <p className="lead">{results.length} productos encontrados</p>}

      {loading && q ? (
        <ProductGridSkeleton />
      ) : results.length ? (
        <div className="grid">
          {results.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="noresults">
          <h2>No encontramos productos para “{q}”.</h2>
          <p>Te sugerimos:</p>
          <ul className="noresults__tips">
            <li>Revisa la ortografía o usa términos más generales (ej. “pintura” en vez de la marca).</li>
            <li>Busca por categoría más abajo.</li>
            <li>Si necesitas algo específico para tu empresa, solicítalo por cotización.</li>
          </ul>
          <div className="noresults__cats">
            {related.map((c) => (
              <Link key={c.id} to={`/categoria/${c.slug}`} className="noresults__cat">
                <CategoryIcon id={c.id} /> {c.name}
              </Link>
            ))}
          </div>
          <div className="noresults__actions">
            <Link to="/cotizacion" className="btn btn--ghost">Solicitar cotización</Link>
            <Link to="/ayuda" className="btn btn--ghost">Contactar a ventas</Link>
            <Link to="/" className="btn btn--primary">Ver catálogo</Link>
          </div>
        </div>
      )}
    </div>
  )
}
