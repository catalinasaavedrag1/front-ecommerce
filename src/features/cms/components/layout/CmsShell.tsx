'use client'

import { useEffect, useState, type ReactNode } from 'react'
import Link from '@/features/cms/compat/next-link'
import { usePathname } from '@/features/cms/compat/next-navigation'
import { NAV, CMS_BASE, activeNav } from '@/features/cms/constants'
import { CmsIcon } from '@/features/cms/components/ui'
import '@/features/cms/cms.css'

export function CmsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { group, item } = activeNav(pathname)
  const [collapsed, setCollapsed] = useState(false)
  const [openKey, setOpenKey] = useState(group.key)

  useEffect(() => {
    setCollapsed(localStorage.getItem('cms.side.collapsed') === '1')
  }, [])
  useEffect(() => {
    setOpenKey(group.key)
  }, [group.key])

  const toggleCollapse = () =>
    setCollapsed((c) => {
      localStorage.setItem('cms.side.collapsed', c ? '0' : '1')
      return !c
    })

  return (
    <div className="jc-app">
      <aside className={`jc-side ${collapsed ? 'jc-side--collapsed' : ''}`}>
        <div className="jc-side__top">
          <Link href={`${CMS_BASE}/dashboard`} className="jc-side__logo" aria-label="CMS Web">
            <span className="jc-side__logomark"><CmsIcon name="logo" /></span>
            {!collapsed && <span className="jc-side__brand">CMS Web<small>Comercial Web</small></span>}
          </Link>
          <button className="jc-side__toggle" onClick={toggleCollapse} aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}>
            <CmsIcon name="chevron" className={collapsed ? '' : 'jc-flip'} />
          </button>
        </div>

        <nav className="jc-side__nav" aria-label="Navegación CMS">
          {NAV.map((g) => {
            const activeSection = g.key === group.key
            const single = g.items.length === 1
            const open = openKey === g.key
            return (
              <div key={g.key} className="jc-side__group">
                {single ? (
                  <Link href={g.items[0].href} className={`jc-side__head ${item?.key === g.items[0].key ? 'is-active' : ''}`}>
                    <CmsIcon name={g.icon} className="jc-side__ic" />
                    <span className="jc-side__label">{g.title}</span>
                    <Flyout group={g} activeItem={item?.key} />
                  </Link>
                ) : (
                  <>
                    <button className={`jc-side__head ${activeSection ? 'is-active' : ''}`} onClick={() => setOpenKey(open ? '' : g.key)} aria-expanded={open}>
                      <CmsIcon name={g.icon} className="jc-side__ic" />
                      <span className="jc-side__label">{g.title}</span>
                      <span className="jc-side__count">{g.items.length}</span>
                      <CmsIcon name="chevron" className={`jc-side__caret ${open ? 'is-open' : ''}`} />
                      <Flyout group={g} activeItem={item?.key} />
                    </button>
                    {open && (
                      <div className="jc-side__items">
                        {g.items.map((it) => (
                          <Link key={it.key} href={it.href} className={`jc-side__item ${item?.key === it.key ? 'is-active' : ''}`}>
                            <CmsIcon name={it.icon} className="jc-side__itemic" />
                            {it.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </nav>

        <div className="jc-side__user">
          <span className="jc-rail__avatar">MG</span>
          {!collapsed && <span className="jc-side__userinfo"><strong>María González</strong><small>Editora de contenido</small></span>}
        </div>
      </aside>

      <div className="jc-main">
        <div className="jc-topbar">
          <button className="jc-topbar__burger" onClick={toggleCollapse} aria-label="Menú"><CmsIcon name="menu" /></button>
          <nav className="jc-crumbs2" aria-label="Ruta">
            <CmsIcon name={group.icon} />
            <span>{group.title}</span>
            {item && group.items.length > 1 && <><CmsIcon name="chevron" /><strong>{item.label}</strong></>}
          </nav>
          <a
            className="jc-topbar__store"
            href="#/"
            target="_blank"
            rel="noopener noreferrer"
            title="Abrir la tienda en una pestaña nueva"
          >
            <CmsIcon name="external" />
            <span>Ver tienda</span>
          </a>
        </div>
        <main className="jc-content">{children}</main>
      </div>
    </div>
  )
}

/** Popover que aparece al pasar el mouse cuando el sidebar está colapsado. */
function Flyout({ group, activeItem }: { group: (typeof NAV)[number]; activeItem?: string }) {
  return (
    <span className="jc-fly">
      <span className="jc-fly__title">{group.title}</span>
      {group.items.map((it) => (
        <Link key={it.key} href={it.href} className={`jc-fly__item ${activeItem === it.key ? 'is-active' : ''}`}>
          <CmsIcon name={it.icon} /> {it.label}
        </Link>
      ))}
    </span>
  )
}
