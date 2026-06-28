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
  const [subcat, setSubcat] = useState<string | null>(null)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const loading = useBriefLoading([slug, sort, onlyOffers, pickup, delivery, brands.join(','), subcat ?? ''])

  const all = category ? productsByCategory(category.id) : []
  const brandList = useMemo(() => Array.from(new Set(all.map((p) => p.brand))).sort(), [all])
  const subcatTiles = useMemo(() => (category?.subcats ?? []).map((name) => {
    const terms = name.toLowerCase().split(/\s+/).filter((t) => t.length > 2)
    const product = all.find((p) => {
      const hay = `${p.name} ${p.brand} ${Object.values(p.specs).join(' ')}`.toLowerCase()
      return terms.some((t) => hay.includes(t))
    }) ?? all[0]
    return { name, product }
  }), [all, category])

  const items = useMemo(() => {
    let list = all
    if (subcat) {
      const terms = subcat.toLowerCase().split(/\s+/).filter((t) => t.length > 2)
      list = list.filter((p) => {
        const hay = `${p.name} ${p.brand} ${Object.values(p.specs).join(' ')}`.toLowerCase()
        return terms.some((t) => hay.includes(t))
      })
      // Si el match es demasiado estrecho, no dejamos la grilla vacía.
      if (!list.length) list = all
    }
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
  }, [all, sort, onlyOffers, brands, pickup, delivery, subcat])

  const toggleBrand = (b: string) =>
    setBrands((prev) => (prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]))

  const clearFilters = () => { setOnlyOffers(false); setPickup(false); setDelivery(false); setBrands([]); setSubcat(null) }
  const activeCount = (onlyOffers ? 1 : 0) + (pickup ? 1 : 0) + (delivery ? 1 : 0) + brands.length + (subcat ? 1 : 0)

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

  const sortSelect = (
    <label className="toolbar__sort">
      <span className="toolbar__sort-lbl">Ordenar</span>
      <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Ordenar productos">
        <option value="relevancia">Relevancia</option>
        <option value="precio-asc">Menor precio</option>
        <option value="precio-desc">Mayor precio</option>
        <option value="vendidos">Más vendidos</option>
        <option value="rating">Mejor evaluados</option>
        <option value="disponibilidad">Disponibilidad</option>
      </select>
    </label>
  )

  return (
    <div className="container catpage">
      <nav className="breadcrumb breadcrumb--cat" aria-label="Ruta de navegación">
        <Link to="/">Inicio</Link> <span aria-hidden>/</span> <span>{category.name}</span> <span aria-hidden>/</span> <strong>{subcat ?? 'Todo'}</strong>
      </nav>

      {subcatTiles.length ? (
        <section className="subrail" aria-label="Subcategorías destacadas">
          {subcatTiles.map(({ name, product }) => (
            <button key={name} className={`subtile ${subcat === name ? 'is-active' : ''}`} aria-pressed={subcat === name} onClick={() => setSubcat(subcat === name ? null : name)}>
              <span className="subtile__media">
                {product ? <ProductImage product={product} className="subtile__img" /> : <CategoryIcon id={category.id} />}
              </span>
              <span>{name}</span>
            </button>
          ))}
          <button className={`subtile subtile--all ${!subcat ? 'is-active' : ''}`} aria-pressed={!subcat} onClick={() => setSubcat(null)}>
            <span className="subtile__media"><CategoryIcon id={category.id} /></span>
            <span>Ver todo</span>
          </button>
        </section>
      ) : null}

      <div className="cat-layout">
        <aside className="filters filters--desk">
          <div className="filters__summary">
            <span>{category.name}</span>
            <strong>{subcat ?? 'Todo el catálogo'}</strong>
            <small>{items.length} resultados</small>
          </div>
          <div className="filters__top">
            <h3>Filtrar</h3>
            {activeCount > 0 && <button className="link-btn" onClick={clearFilters}>Limpiar</button>}
          </div>
          {FiltersPanel}
        </aside>

        <section className="cat-main">
          <header className="cathead">
            <div>
              <span className="cathead__eyebrow">{category.name}</span>
              <h1 className="cathead__title">{subcat ?? category.name}</h1>
            </div>
            {category.blurb && <p className="cathead__desc">{category.blurb}</p>}
          </header>

          <div className="toolbar">
            <div className="toolbar__left">
              <button className="toolbar__filter" onClick={() => setFiltersOpen(true)}>
                <Icon name="filter" /> Filtros{activeCount ? <span className="toolbar__count">{activeCount}</span> : null}
              </button>
              <span className="toolbar__results" aria-live="polite">{items.length} {items.length === 1 ? 'producto' : 'productos'}</span>
            </div>
            <div className="toolbar__right">
              {sortSelect}
              <div className="viewtoggle" role="group" aria-label="Tipo de vista">
                <button className={view === 'grid' ? 'is-active' : ''} onClick={() => setView('grid')} aria-label="Vista grilla" aria-pressed={view === 'grid'}><Icon name="grid" /></button>
                <button className={view === 'list' ? 'is-active' : ''} onClick={() => setView('list')} aria-label="Vista lista" aria-pressed={view === 'list'}><Icon name="list" /></button>
              </div>
            </div>
          </div>

          {activeCount > 0 && (
            <div className="activechips">
              {subcat && <button className="afchip" onClick={() => setSubcat(null)}>{subcat} <Icon name="close" /></button>}
              {onlyOffers && <button className="afchip" onClick={() => setOnlyOffers(false)}>Ofertas <Icon name="close" /></button>}
              {pickup && <button className="afchip" onClick={() => setPickup(false)}>Retiro hoy <Icon name="close" /></button>}
              {delivery && <button className="afchip" onClick={() => setDelivery(false)}>Despacho <Icon name="close" /></button>}
              {brands.map((b) => (
                <button key={b} className="afchip" onClick={() => toggleBrand(b)}>{b} <Icon name="close" /></button>
              ))}
              <button className="activechips__clear" onClick={clearFilters}>Limpiar todo</button>
            </div>
          )}

          {loading ? (
            <ProductGridSkeleton count={Math.min(10, Math.max(5, all.length))} />
          ) : items.length ? (
            <div className={`grid ${view === 'list' ? 'grid--list' : ''}`}>
              {items.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div className="empty empty--cat">
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
