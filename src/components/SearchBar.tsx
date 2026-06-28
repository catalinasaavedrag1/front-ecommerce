import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { categories, products } from '@/data/products'
import ProductImage from './ProductImage'
import Icon from './Icon'
import { formatCLP } from '@/utils/format'
import { priceFor } from '@/utils/pricing'
import { useApp } from '@/context/AppContext'

const POPULAR = ['Cemento', 'Taladro', 'Pintura blanca', 'Cerámica', 'Manguera', 'Foco LED']
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
          placeholder="Buscar cemento, pinturas, herramientas…"
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
                  {POPULAR.map((p) => (
                    <button key={p} className="ac__chip" onClick={() => commit(p)}>{p}</button>
                  ))}
                </div>
              </div>
            </>
          )}

          {term && sugg && !sugg.empty && (
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

          {term && sugg?.empty && (
            <div className="ac__empty">
              <p>Sin coincidencias para "<strong>{q}</strong>".</p>
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
