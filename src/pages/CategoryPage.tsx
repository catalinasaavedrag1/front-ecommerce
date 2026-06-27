import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { categories, getCategory, productsByCategory } from '@/data/products'
import { availabilityFor } from '@/utils/catalog'
import ProductCard from '@/components/ProductCard'
import ProductImage from '@/components/ProductImage'
import Icon, { CategoryIcon } from '@/components/Icon'
import { ProductGridSkeleton } from '@/components/Skeleton'
import { useBriefLoading } from '@/hooks/useBriefLoading'

type SortKey = 'relevancia' | 'precio-asc' | 'precio-desc' | 'vendidos' | 'rating' | 'disponibilidad'

export default function CategoryPage() {
  const { slug = '' } = useParams()
  const category = getCategory(slug)
  const [sort, setSort] = useState<SortKey>('relevancia')
  const [onlyOffers, setOnlyOffers] = useState(false)
  const [pickup, setPickup] = useState(false)
  const [delivery, setDelivery] = useState(false)
  const [brands, setBrands] = useState<string[]>([])
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const loading = useBriefLoading([slug, sort, onlyOffers, pickup, delivery, brands.join(',')])

  const all = category ? productsByCategory(category.id) : []
  const brandList = useMemo(() => Array.from(new Set(all.map((p) => p.brand))).sort(), [all])

  const items = useMemo(() => {
    let list = all
    if (onlyOffers) list = list.filter((p) => p.retailOffer)
    if (brands.length) list = list.filter((p) => brands.includes(p.brand))
    if (pickup) list = list.filter((p) => availabilityFor(p).pickupToday)
    if (delivery) list = list.filter((p) => availabilityFor(p).delivery)
    const price = (p: (typeof list)[number]) => p.retailOffer ?? p.retailPrice
    switch (sort) {
      case 'precio-asc': return [...list].sort((a, b) => price(a) - price(b))
      case 'precio-desc': return [...list].sort((a, b) => price(b) - price(a))
      case 'vendidos': return [...list].sort((a, b) => b.reviews - a.reviews)
      case 'rating': return [...list].sort((a, b) => b.rating - a.rating)
      case 'disponibilidad': return [...list].sort((a, b) => b.stock - a.stock)
      default: return list
    }
  }, [all, sort, onlyOffers, brands, pickup, delivery])

  const toggleBrand = (b: string) =>
    setBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]))

  const clearFilters = () => { setOnlyOffers(false); setPickup(false); setDelivery(false); setBrands([]) }
  const activeCount = (onlyOffers ? 1 : 0) + (pickup ? 1 : 0) + (delivery ? 1 : 0) + brands.length

  if (!category) {
    return (
      <div className="container empty">
        <h1>Categoría no encontrada</h1>
        <Link to="/" className="btn btn--primary">Volver al inicio</Link>
      </div>
    )
  }

  const FiltersPanel = (
    <>
      <div className="filters__group">
        <h4>Disponibilidad</h4>
        <label className="filters__check"><input type="checkbox" checked={pickup} onChange={(e) => setPickup(e.target.checked)} /> Retiro hoy en tienda</label>
        <label className="filters__check"><input type="checkbox" checked={delivery} onChange={(e) => setDelivery(e.target.checked)} /> Disponible para despacho</label>
        <label className="filters__check"><input type="checkbox" checked={onlyOffers} onChange={(e) => setOnlyOffers(e.target.checked)} /> Solo ofertas</label>
      </div>
      <div className="filters__group">
        <h4>Marca</h4>
        {brandList.map((b) => (
          <label className="filters__check" key={b}>
            <input type="checkbox" checked={brands.includes(b)} onChange={() => toggleBrand(b)} /> {b}
          </label>
        ))}
      </div>
      <div className="filters__group">
        <h4>Otras categorías</h4>
        <ul className="filters__cats">
          {categories.map((c) => (
            <li key={c.id}>
              <Link to={`/categoria/${c.slug}`} className={c.id === category.id ? 'is-active' : ''}>
                <CategoryIcon id={c.id} /> {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )

  return (
    <div className="container">
      <nav className="breadcrumb">
        <Link to="/">Inicio</Link> <span>/</span> <span>{category.name}</span>
      </nav>

      <header className="cat-intro">
        <h1><CategoryIcon id={category.id} className="cat-intro__icon" /> {category.name}</h1>
        {category.blurb && <p>{category.blurb}</p>}
      </header>

      {category.subcats?.length ? (
        <div className="cat-subnav" role="navigation" aria-label="Subcategorías">
          {category.subcats.map((s, i) => {
            const rep = all[i % Math.max(1, all.length)]
            return (
              <button key={s} className="subtile" onClick={() => setFiltersOpen(false)}>
                <span className="subtile__img">
                  {rep ? <ProductImage product={rep} variant={i + 1} /> : <span aria-hidden>{category.icon}</span>}
                </span>
                <span className="subtile__label">{s}</span>
              </button>
            )
          })}
        </div>
      ) : null}

      <div className="cat-toolbar">
        <button className="cat-toolbar__filter" onClick={() => setFiltersOpen(true)}>
          <Icon name="filter" /> Filtros{activeCount ? <span className="cat-toolbar__count">{activeCount}</span> : null}
        </button>
        <span className="cat-toolbar__results">{items.length} productos</span>
        <div className="viewtoggle" role="group" aria-label="Vista">
          <button className={view === 'grid' ? 'is-active' : ''} onClick={() => setView('grid')} aria-label="Vista grilla"><Icon name="filter" /></button>
          <button className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')} aria-label="Vista lista"><Icon name="list" /></button>
        </div>
        <label className="cat-toolbar__sort">
          Ordenar
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="relevancia">Relevancia</option>
            <option value="precio-asc">Menor precio</option>
            <option value="precio-desc">Mayor precio</option>
            <option value="vendidos">Más vendidos</option>
            <option value="rating">Mejor evaluados</option>
            <option value="disponibilidad">Disponibilidad</option>
          </select>
        </label>
      </div>

      {activeCount > 0 && (
        <div className="active-filters">
          {onlyOffers && <button className="afchip" onClick={() => setOnlyOffers(false)}>Ofertas <Icon name="close" /></button>}
          {pickup && <button className="afchip" onClick={() => setPickup(false)}>Retiro hoy <Icon name="close" /></button>}
          {delivery && <button className="afchip" onClick={() => setDelivery(false)}>Despacho <Icon name="close" /></button>}
          {brands.map((b) => (
            <button key={b} className="afchip" onClick={() => toggleBrand(b)}>{b} <Icon name="close" /></button>
          ))}
          <button className="afchip afchip--clear" onClick={clearFilters}>Limpiar todo</button>
        </div>
      )}

      <div className="cat-layout">
        <aside className="filters filters--desk">
          <div className="filters__top">
            <h3>Filtrar</h3>
            {activeCount > 0 && <button className="link-btn" onClick={clearFilters}>Limpiar</button>}
          </div>
          {FiltersPanel}
        </aside>

        <section className="cat-main">
          {loading ? (
            <ProductGridSkeleton count={Math.min(8, Math.max(4, all.length))} />
          ) : items.length ? (
            <div className={`grid ${view === 'list' ? 'grid--list' : ''}`}>
              {items.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="empty">
              <p>No hay productos con esos filtros.</p>
              <button className="btn btn--ghost" onClick={clearFilters}>Limpiar filtros</button>
            </div>
          )}
        </section>
      </div>

      {/* Drawer de filtros (mobile) */}
      {filtersOpen && (
        <div className="drawer-overlay" onClick={() => setFiltersOpen(false)}>
          <div className="drawer drawer--bottom" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Filtros">
            <div className="drawer__head">
              <h3>Filtrar</h3>
              <button className="drawer__close" onClick={() => setFiltersOpen(false)} aria-label="Cerrar"><Icon name="close" /></button>
            </div>
            <div className="drawer__body filters">{FiltersPanel}</div>
            <div className="drawer__foot">
              <button className="btn btn--ghost" onClick={clearFilters}>Limpiar</button>
              <button className="btn btn--primary" onClick={() => setFiltersOpen(false)}>Ver {items.length} productos</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
