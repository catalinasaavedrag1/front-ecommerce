import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from '@/nav'
import { categories, products } from '@/data/products'
import ProductImage from './ProductImage'
import Icon from './Icon'
import { formatCLP } from '@/utils/format'
import { priceFor } from '@/utils/pricing'
import { useApp } from '@/context/AppContext'
import { useSearchAutocomplete } from '@/hooks/useSearchAutocomplete'

const POPULAR: Record<'b2c' | 'b2b', string[]> = {
  b2c: ['Cemento', 'Taladro', 'Pintura blanca', 'Cerámica', 'Manguera', 'Foco LED'],
  b2b: ['Cemento por pallet', 'Fierro 8mm', 'OSB estructural', 'Cable 2.5mm', 'Cotizar grifería', 'Despacho a obra'],
}
const RECENT_KEY = 'mimbral.recent'
const brands = Array.from(new Set(products.map((p) => p.brand)))

function readRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]')
  } catch {
    return []
  }
}

export default function SearchBar() {
  const navigate = useNavigate()
  const { mode, customer } = useApp()
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [recent, setRecent] = useState<string[]>(readRecent)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const term = q.trim().toLowerCase()

  /**
   * Autocompletado de search-service (vía BFF), con debounce y cancelación en
   * el hook. Cuando responde, MANDA sobre el filtro local de `src/data`: es el
   * índice real, con el catálogo vigente. Sin BFF o ante error, `live` queda
   * en false y se sigue usando `sugg` (degradación elegante, igual que el
   * resto de las pantallas).
   */
  const auto = useSearchAutocomplete(q)
  const liveItems = auto.live ? auto.items : []
  const liveTerms = liveItems.filter((i) => i.type === 'QUERY')
  const liveCats = liveItems.filter((i) => i.type === 'CATEGORY')
  const liveProds = liveItems.filter((i) => i.type === 'PRODUCT')

  const sugg = useMemo(() => {
    if (!term) return null
    const prods = products
      .filter((p) => `${p.name} ${p.brand} ${p.sku}`.toLowerCase().includes(term))
      .slice(0, 6)
    const cats = categories.filter((c) => c.name.toLowerCase().includes(term)).slice(0, 4)
    const brs = brands.filter((b) => b.toLowerCase().includes(term)).slice(0, 4)
    return { prods, cats, brs, empty: prods.length + cats.length + brs.length === 0 }
  }, [term])

  const commit = (text: string) => {
    const t = text.trim()
    if (!t) return
    const next = [t, ...recent.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, 6)
    setRecent(next)
    localStorage.setItem(RECENT_KEY, JSON.stringify(next))
    setOpen(false)
    navigate(`/buscar?q=${encodeURIComponent(t)}`)
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    commit(q)
  }

  const clearRecent = () => {
    setRecent([])
    localStorage.removeItem(RECENT_KEY)
  }

  return (
    <div className="searchwrap" ref={ref}>
      <form className="search" onSubmit={submit} role="search">
        <input
          type="search"
          placeholder={mode === 'b2b' ? 'Busca por SKU, lista, obra o producto mayorista…' : 'Buscar cemento, pinturas, herramientas…'}
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          aria-label="Buscar productos"
        />
        <button type="submit" aria-label="Buscar"><Icon name="search" /></button>
      </form>

      {open && (
        <div className="ac" role="listbox">
          {!term && (
            <>
              {recent.length > 0 && (
                <div className="ac__sec">
                  <div className="ac__head"><span>Búsquedas recientes</span><button className="ac__clear" onClick={clearRecent}>Borrar</button></div>
                  {recent.map((r) => (
                    <button key={r} className="ac__row ac__row--term" onClick={() => commit(r)}>
                      <Icon name="clock" /> {r}
                    </button>
                  ))}
                </div>
              )}
              <div className="ac__sec">
                <div className="ac__head"><span>Búsquedas populares</span></div>
                <div className="ac__chips">
                  {POPULAR[mode].map((p) => (
                    <button key={p} className="ac__chip" onClick={() => commit(p)}>{p}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Sugerencias del índice real. Todas navegan a la página de
              búsqueda por su texto: el autocomplete entrega el UUID técnico
              del SKU, y la ficha se resuelve por slug o por código comercial
              (ADR-013 §1) — mandar el UUID daría 404. */}
          {term && liveItems.length > 0 && (
            <>
              {liveTerms.length > 0 && (
                <div className="ac__sec">
                  <div className="ac__head"><span>Sugerencias</span></div>
                  {liveTerms.map((i) => (
                    <button key={`q-${i.label}`} className="ac__row ac__row--term" onClick={() => commit(i.label)}>
                      <Icon name="search" /> {i.label}
                    </button>
                  ))}
                </div>
              )}
              {liveCats.length > 0 && (
                <div className="ac__sec">
                  <div className="ac__head"><span>Categorías</span></div>
                  {liveCats.map((i) => (
                    <button key={`c-${i.categoryId ?? i.label}`} className="ac__row ac__row--term" onClick={() => commit(i.label)}>
                      <Icon name="filter" /> {i.label}
                    </button>
                  ))}
                </div>
              )}
              {liveProds.length > 0 && (
                <div className="ac__sec">
                  <div className="ac__head"><span>Productos</span></div>
                  {liveProds.map((i) => (
                    <button key={`p-${i.skuId ?? i.label}`} className="ac__row ac__row--term" onClick={() => commit(i.label)}>
                      <Icon name="box" /> {i.label}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {term && liveItems.length === 0 && sugg && !sugg.empty && (
            <>
              {sugg.cats.length > 0 && (
                <div className="ac__sec">
                  <div className="ac__head"><span>Categorías</span></div>
                  {sugg.cats.map((c) => (
                    <button key={c.id} className="ac__row ac__row--term" onClick={() => { setOpen(false); navigate(`/categoria/${c.slug}`) }}>
                      <Icon name="filter" /> {c.name}
                    </button>
                  ))}
                </div>
              )}
              {sugg.brs.length > 0 && (
                <div className="ac__sec">
                  <div className="ac__head"><span>Marcas</span></div>
                  <div className="ac__chips">
                    {sugg.brs.map((b) => (
                      <button key={b} className="ac__chip" onClick={() => commit(b)}>{b}</button>
                    ))}
                  </div>
                </div>
              )}
              {sugg.prods.length > 0 && (
                <div className="ac__sec">
                  <div className="ac__head"><span>Productos</span></div>
                  {sugg.prods.map((p) => (
                    <button key={p.id} className="ac__prod" onClick={() => { setOpen(false); navigate(`/producto/${p.id}`) }}>
                      <span className="ac__prod-img"><ProductImage product={p} /></span>
                      <span className="ac__prod-info">
                        <span className="ac__prod-name">{p.name}</span>
                        <span className="ac__prod-brand">{p.brand}</span>
                      </span>
                      <span className="ac__prod-price">{formatCLP(priceFor(p, 1, mode, customer).unitGross)}</span>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {term && liveItems.length === 0 && !auto.loading && sugg?.empty && (
            <div className="ac__empty">
              <p>Sin coincidencias para "<strong>{q}</strong>".</p>
              {mode === 'b2b' && (
                <button className="ac__quote" onClick={() => { setOpen(false); navigate(`/cotizacion?producto=${encodeURIComponent(q)}`) }}>
                  <Icon name="doc" /> Solicitar cotización con este texto
                </button>
              )}
              <div className="ac__chips">
                {categories.slice(0, 6).map((c) => (
                  <button key={c.id} className="ac__chip" onClick={() => { setOpen(false); navigate(`/categoria/${c.slug}`) }}>{c.name}</button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
