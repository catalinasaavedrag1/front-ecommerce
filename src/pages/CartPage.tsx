import { useMemo, useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { buildTotals } from '@/utils/cart'
import { formatCLP } from '@/utils/format'
import { getRecommendations } from '@/utils/recommendations'
import ProductImage from '@/components/ProductImage'
import QuantityStepper from '@/components/QuantityStepper'
import Icon from '@/components/Icon'

const FREE_SHIP = 49990

export default function CartPage() {
  const { mode, customer } = useApp()
  const { lines, setQty, remove, clear, add } = useCart()
  const wishlist = useWishlist()
  const navigate = useNavigate()

  const [selected, setSelected] = useState<Set<string>>(() => new Set(lines.map((l) => l.productId)))
  const [groupOpen, setGroupOpen] = useState(true)
  const [menuFor, setMenuFor] = useState<string | null>(null)
  const [altFor, setAltFor] = useState<string | null>(null)
  const swap = (oldId: string, newId: string, qty: number) => { remove(oldId); add(newId, qty); setAltFor(null) }
  const [headerMenu, setHeaderMenu] = useState(false)
  const [confirmClear, setConfirmClear] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(false)

  // Selección efectiva: si nunca se tocó, todos seleccionados
  const isSel = (id: string) => selected.has(id)
  const toggle = (id: string) => setSelected((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })
  const allSelected = lines.length > 0 && lines.every((l) => selected.has(l.productId))
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(lines.map((l) => l.productId)))

  const selectedLines = lines.filter((l) => isSel(l.productId))
  const totals = useMemo(() => buildTotals(selectedLines, mode, customer), [selectedLines, mode, customer])
  const missingForFree = Math.max(0, FREE_SHIP - totals.gross)

  if (!lines.length) {
    return (
      <CartShell title="Carro">
        <div className="cart2-empty">
          <span className="cart2-empty__ic"><Icon name="cart" /></span>
          <h1>{mode === 'b2b' ? 'Tu orden está vacía' : 'Tu carro está vacío'}</h1>
          <p>Agrega productos para continuar tu compra.</p>
          <Link to="/" className="btn btn--primary">Ir a comprar</Link>
        </div>
      </CartShell>
    )
  }

  const detail = buildTotals(lines, mode, customer) // todos, para etiquetas globales

  return (
    <CartShell
      title={`Carro (${detail.itemCount} ${detail.itemCount === 1 ? 'producto' : 'productos'})`}
      menu={
        <div className="cart2-menu">
          <button className="cart2-hd__menu" aria-label="Acciones del carro" onClick={() => setHeaderMenu((v) => !v)}><Icon name="dots" /></button>
          {headerMenu && (
            <>
              <div className="cart2-menu__back" onClick={() => setHeaderMenu(false)} />
              <div className="cart2-menu__list" role="menu">
                <button onClick={() => { setHeaderMenu(false); setConfirmClear(true) }}><Icon name="trash" /> Vaciar carro</button>
              </div>
            </>
          )}
        </div>
      }
    >
      {/* Dirección de despacho */}
      <Link to="/tiendas" className="cart2-addr">
        <Icon name="pin" />
        <span>Despacha a <strong>Santiago Centro</strong></span>
        <Icon name="chevron" className="cart2-addr__chev" />
      </Link>

      {/* Progreso despacho gratis */}
      {missingForFree > 0 ? (
        <div className="cart2-ship">
          <Icon name="truck" /> Te faltan <strong>{formatCLP(missingForFree)}</strong> para <strong>despacho gratis</strong>
        </div>
      ) : (
        <div className="cart2-ship cart2-ship--ok"><Icon name="check" /> ¡Tienes <strong>despacho gratis</strong>!</div>
      )}

      {/* Grupo de vendedor */}
      <section className="cart2-group">
        <header className="cart2-group__head">
          <label className="cart2-check">
            <input type="checkbox" checked={allSelected} onChange={toggleAll} aria-label="Seleccionar todos" />
          </label>
          <strong>Vendido por Mimbral</strong>
          <button className="cart2-group__toggle" onClick={() => setGroupOpen((v) => !v)} aria-expanded={groupOpen} aria-label={groupOpen ? 'Contraer' : 'Expandir'}>
            <Icon name="chevron" className={groupOpen ? 'rot-up' : 'rot-down'} />
          </button>
        </header>

        {groupOpen && (
          <ul className="cart2-list">
            {detail.lines.map((l) => {
              const overStock = l.qty > l.product.stock
              const maxStock = Math.min(l.product.stock, 99)
              return (
                <li key={l.product.id} className={`citem ${isSel(l.product.id) ? '' : 'is-off'}`}>
                  <label className="cart2-check citem__check">
                    <input type="checkbox" checked={isSel(l.product.id)} onChange={() => toggle(l.product.id)} aria-label={`Seleccionar ${l.product.name}`} />
                  </label>
                  <Link to={`/producto/${l.product.id}`} className="citem__media"><ProductImage product={l.product} /></Link>
                  <div className="citem__main">
                    <div className="citem__row1">
                      <Link to={`/producto/${l.product.id}`} className="citem__name">{l.product.name}</Link>
                      <div className="citem__menu">
                        <button aria-label="Más acciones" onClick={() => setMenuFor(menuFor === l.product.id ? null : l.product.id)}><Icon name="dots" /></button>
                        {menuFor === l.product.id && (
                          <>
                            <div className="cart2-menu__back" onClick={() => setMenuFor(null)} />
                            <div className="cart2-menu__list" role="menu">
                              <button onClick={() => { setMenuFor(null); navigate(`/producto/${l.product.id}`) }}><Icon name="search" /> Ver producto</button>
                              <button onClick={() => { wishlist.toggle(l.product.id); remove(l.product.id); setMenuFor(null) }}><Icon name="heart" /> Guardar para después</button>
                              <button onClick={() => { remove(l.product.id); setMenuFor(null) }}><Icon name="trash" /> Eliminar</button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <span className="citem__brand">{l.product.brand} · {l.product.sku}</span>
                    {l.product.bulky && <span className="citem__tag">Voluminoso</span>}
                    {overStock && <span className="citem__alert"><Icon name="box" /> Solo quedan {l.product.stock} u.</span>}
                    <div className="citem__row2">
                      <span className="citem__price">{formatCLP(l.lineGross)}</span>
                      <div className="citem__qtywrap">
                        <QuantityStepper value={l.qty} max={maxStock} size="sm" onChange={(n) => setQty(l.product.id, n)} ariaLabel={`Cantidad de ${l.product.name}`} />
                        <span className="citem__max">Máx {maxStock} u.</span>
                      </div>
                    </div>
                    <button className={`citem__alt-btn ${overStock ? 'is-alert' : ''}`} onClick={() => setAltFor(altFor === l.product.id ? null : l.product.id)} aria-expanded={altFor === l.product.id}>
                      <Icon name="return" /> Encontrar alternativa
                    </button>
                    {altFor === l.product.id && (
                      <div className="citem__alts">
                        {getRecommendations(l.product).similar.filter((a) => a.stock > 0).slice(0, 6).map((a) => (
                          <div className="altcard" key={a.id}>
                            <Link to={`/producto/${a.id}`} className="altcard__media"><ProductImage product={a} /></Link>
                            <span className="altcard__name">{a.name}</span>
                            <span className="altcard__price">{formatCLP(a.retailOffer ?? a.retailPrice)}</span>
                            <button className="btn btn--ghost btn--xs" onClick={() => swap(l.product.id, a.id, Math.min(l.qty, a.stock))}>Cambiar</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <div className="cart2-spacer" />

      {/* Resumen fijo inferior */}
      <div className={`cart2-summary ${summaryOpen ? 'is-open' : ''}`}>
        <button className="cart2-summary__expand" onClick={() => setSummaryOpen((v) => !v)} aria-expanded={summaryOpen}>
          {summaryOpen ? 'Ocultar detalle' : 'Ver detalle'} <Icon name="chevron" className={summaryOpen ? 'rot-up' : 'rot-down'} />
        </button>
        {summaryOpen && (
          <dl className="cart2-summary__detail">
            <div><dt>Neto</dt><dd>{formatCLP(totals.net)}</dd></div>
            <div><dt>IVA (19%)</dt><dd>{formatCLP(totals.iva)}</dd></div>
            <div><dt>Despacho</dt><dd>{missingForFree > 0 ? 'Por calcular' : 'Gratis'}</dd></div>
            {totals.savings > 0 && <div className="cart2-summary__save"><dt>Ahorro</dt><dd>-{formatCLP(totals.savings)}</dd></div>}
          </dl>
        )}
        <div className="cart2-summary__bar">
          <div className="cart2-summary__total">
            <small>Total ({selectedLines.reduce((s, l) => s + l.qty, 0)} productos)</small>
            <strong>{formatCLP(totals.gross)}</strong>
          </div>
          <button className="btn btn--primary cart2-summary__cta" disabled={!selectedLines.length} onClick={() => navigate('/checkout')}>
            Continuar al pago
          </button>
        </div>
      </div>

      {/* Confirmar vaciar */}
      {confirmClear && (
        <div className="cart2-confirm" role="dialog" aria-modal="true">
          <div className="cart2-confirm__back" onClick={() => setConfirmClear(false)} />
          <div className="cart2-confirm__box">
            <h3>¿Seguro que quieres vaciar tu carro?</h3>
            <p>Se eliminarán todos los productos de tu {mode === 'b2b' ? 'orden' : 'carro'}.</p>
            <div className="cart2-confirm__actions">
              <button className="btn btn--ghost" onClick={() => setConfirmClear(false)}>Cancelar</button>
              <button className="btn btn--primary" onClick={() => { clear(); setConfirmClear(false) }}>Vaciar carro</button>
            </div>
          </div>
        </div>
      )}
    </CartShell>
  )
}

function CartShell({ title, menu, children }: { title: string; menu?: ReactNode; children: ReactNode }) {
  const navigate = useNavigate()
  return (
    <div className="cart2">
      <header className="cart2-hd">
        <button className="cart2-hd__back" onClick={() => navigate(-1)} aria-label="Volver"><Icon name="chevron" className="ic--flip" /></button>
        <span className="cart2-hd__title">{title}</span>
        {menu ?? <span className="cart2-hd__spacer" />}
      </header>
      <main className="cart2-main">{children}</main>
    </div>
  )
}
