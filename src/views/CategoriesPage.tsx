'use client'

import { Link } from '@/nav'
import { categories } from '@/data/products'
import { useBffNavigation } from '@/hooks/useBffNavigation'
import Icon, { CategoryIcon } from '@/components/Icon'

export default function CategoriesPage() {
  const { tree: categoryTree } = useBffNavigation()
  return (
    <div className="container catspage">
      <h1 className="page-title">Categorías</h1>
      <p className="catspage__sub">Explora todo nuestro catálogo por categoría.</p>

      <div className="catspage__list">
        {categories.map((c) => {
          const subs = categoryTree[c.id] ?? []
          return (
            <section className="catcard" key={c.id}>
              <Link to={`/categoria/${c.slug}`} className="catcard__head">
                <span className="catcard__ic"><CategoryIcon id={c.id} /></span>
                <span className="catcard__name">{c.name}</span>
                <Icon name="chevron" className="catcard__chev" />
              </Link>
              {subs.length > 0 && (
                <div className="catcard__subs">
                  {subs.slice(0, 6).map((s) => (
                    <Link key={s.name} to={`/categoria/${c.slug}`} className="catcard__chip">{s.name}</Link>
                  ))}
                </div>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}
