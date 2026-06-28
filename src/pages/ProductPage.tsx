import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct, warehouses, getCategory } from '@/data/products'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import PriceTag from '@/components/PriceTag'
import Rating from '@/components/Rating'
import ProductImage from '@/components/ProductImage'
import BottomSheet from '@/components/BottomSheet'
import Icon from '@/components/Icon'
import Calculator from '@/components/Calculator'
import ProductCarousel from '@/components/ProductCarousel'
import CompareTable from '@/components/CompareTable'
import ProductReviews from '@/components/ProductReviews'
import ProductQA from '@/components/ProductQA'
import ShareButton from '@/components/ShareButton'
import Accordion from '@/components/Accordion'
import { useWishlist } from '@/context/WishlistContext'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { getRecommendations } from '@/utils/recommendations'
import { getVariants } from '@/utils/variants'
import { priceFor, nextVolumeTier } from '@/utils/pricing'
import { formatCLP } from '@/utils/format'

type DeliveryTab = 'despacho' | 'retiro' | 'tienda'

export default function ProductPage() {
  const { id = '' } = useParams()
  const product = getProduct(id)
  const { mode, customer } = useApp()
  const { add } = useCart()
  const wishlist = useWishlist()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [view, setView] = useState(0)
  const [sheet, setSheet] = useState<DeliveryTab | null>(null)
  const [variantSel, setVariantSel] = useState<Record<string, string>>({})
  const recentlyViewed = useRecentlyViewed(id)

  if (!product) {
    return (
      <div className="container empty">
        <h1>Producto no encontrado</h1>
        <Link to="/" className="btn btn--primary">Volver al inicio</Link>
      </div>
    )
  }

  const category = getCategory(product.categoryId)
  const recs = getRecommendations(product)
  const variants = getVariants(product)
  const price = priceFor(product, qty, mode, customer)
  const nextTier = mode === 'b2b' ? nextVolumeTier(product, qty) : undefined

  const maxQty = Math.min(product.stock, 30)
  const lowStock = product.stock <= 12
  const shipCost = product.bulky ? 24990 : 4990
  const despachoOpts = [
    { label: 'Llega mañana', cost: shipCost },
    { label: 'Llega en 48 hrs', cost: Math.max(990, shipCost - 1000) },
    { label: 'Llega en 72 hrs', cost: Math.max(990, shipCost - 2000) },
  ]
  const retiroOpts = [
    { label: 'Retiro hoy', store: 'Tienda Balmaceda', when: 'Listo en 2 hrs' },
    { label: 'Retiro mañana', store: 'Tienda Chorrillos', when: 'Mañana desde 11:00' },
  ]

  // Chips comerciales (máx. 4)
  const chips: { label: string; kind: 'ok' | 'plain' | 'red' | 'warn' }[] = []
  if (product.retailOffer) chips.push({ label: 'Oferta', kind: 'red' })
  chips.push({ label: 'Retiro hoy', kind: 'ok' })
  chips.push({ label: 'Despacho 24-72 hrs', kind: 'plain' })
  chips.push(lowStock ? { label: `Solo ${product.stock} u.`, kind: 'warn' } : { label: 'Stock disponible', kind: 'ok' })
  chips.push({ label: '12 cuotas sin interés', kind: 'plain' })
  const visibleChips = chips.slice(0, 4)

  const onAdd = () => {
    add(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }
  const clampQty = (n: number) => Math.max(1, Math.min(maxQty, n))

  return (
    <div className="container pdp-page">
      <nav className="breadcrumb">
        <Link to="/">Inicio</Link> <span>/</span>{' '}
        <Link to={`/categoria/${category?.slug ?? product.categoryId}`}>{category?.name ?? 'Categoría'}</Link> <span>/</span>{' '}
        <span className="breadcrumb__current">{product.name}</span>
      </nav>

      <div className="pdp">
        {/* Galería */}
        <div className="pdp__gallery">
          <div className="pdp__stage">
            <ProductImage product={product} variant={view} className="pdp__img" />
          </div>
          <div className="pdp__thumbs">
            {[0, 1, 2].map((v) => (
              <button
                key={v}
                className={`pdp__thumb ${view === v ? 'is-active' : ''}`}
                onClick={() => setView(v)}
                aria-label={`Vista ${v + 1}`}
              >
                <ProductImage product={product} variant={v} className="pdp__thumb-img" />
              </button>
            ))}
          </div>
        </div>

        {/* Información principal + compra */}
        <div className="pdp__info">
          <span className="pdp__brand">{product.brand}</span>
          <h1 className="pdp__title">{product.name}</h1>
          <div className="pdp__meta">
            <Rating value={product.rating} reviews={product.reviews} />
            <span className="pdp__sku">SKU {product.sku}</span>
          </div>

          <div className="pdp__priceblock">
            <div className="pdp__price-col">
              <PriceTag product={product} qty={qty} />
              <span className="pdp__unit">Por {product.unit}</span>
            </div>
            <div className="pdp__iconrow">
              <ShareButton title={product.name} text={`Mira este producto en Mimbral: ${product.name}`} whatsappText={`Mira este producto en Mimbral: ${product.name} (${formatCLP(product.retailOffer ?? product.retailPrice)})`} />
              <button
                className={`pdp__iconbtn ${wishlist.has(product.id) ? 'is-on' : ''}`}
                onClick={() => wishlist.toggle(product.id)}
                aria-label={wishlist.has(product.id) ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                aria-pressed={wishlist.has(product.id)}
              >
                <Icon name="heart" filled={wishlist.has(product.id)} />
              </button>
            </div>
          </div>

          {visibleChips.length > 0 && (
            <div className="pdp__chips">
              {visibleChips.map((c) => (
                <span key={c.label} className={`pchip pchip--${c.kind}`}>{c.label}</span>
              ))}
            </div>
          )}

          {/* Variantes (si el producto tiene) */}
          {variants.length > 0 && (
            <div className="pvars">
              {variants.map((g) => (
                <div className="pvar" key={g.type}>
                  <span className="pvar__label">{g.type}: <strong>{variantSel[g.type] ?? g.options[0].label}</strong></span>
                  <div className="pvar__opts">
                    {g.options.map((o) => {
                      const active = (variantSel[g.type] ?? g.options[0].label) === o.label
                      return o.color ? (
                        <button key={o.label} className={`pvar__sw ${active ? 'is-on' : ''}`} style={{ background: o.color }} title={o.label} aria-label={`${g.type} ${o.label}`} aria-pressed={active} onClick={() => setVariantSel((s) => ({ ...s, [g.type]: o.label }))} />
                      ) : (
                        <button key={o.label} className={`pvar__chip ${active ? 'is-on' : ''}`} aria-pressed={active} onClick={() => setVariantSel((s) => ({ ...s, [g.type]: o.label }))}>{o.label}</button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Bloque de entrega */}
          <div className="pdp__delivery">
            <div className="pdp__delivery-head"><Icon name="pin" /> Entrega en <strong>Santiago Centro</strong></div>
            <button className="delrow" onClick={() => setSheet('despacho')}>
              <span className="delrow__ic"><Icon name="truck" /></span>
              <span className="delrow__txt"><strong>Despacho a domicilio</strong><span>Llega entre 24-72 hrs · Desde {formatCLP(despachoOpts[2].cost)}</span></span>
              <Icon name="chevron" className="delrow__chev" />
            </button>
            <button className="delrow" onClick={() => setSheet('retiro')}>
              <span className="delrow__ic"><Icon name="store" /></span>
              <span className="delrow__txt"><strong>Retiro en tienda</strong><span>Retiro gratis hoy · {retiroOpts[0].store}</span></span>
              <Icon name="chevron" className="delrow__chev" />
            </button>
            <button className="delrow" onClick={() => setSheet('tienda')}>
              <span className="delrow__ic"><Icon name="box" /></span>
              <span className="delrow__txt"><strong>Disponible en tienda</strong><span>{product.stock} unidades disponibles</span></span>
              <Icon name="chevron" className="delrow__chev" />
            </button>
          </div>

          {/* Tramos por volumen (B2B) */}
          {mode === 'b2b' && product.volumeTiers?.length ? (
            <table className="tiers">
              <thead><tr><th>Cantidad</th><th>Precio neto unit.</th></tr></thead>
              <tbody>
                <tr className={qty < (product.volumeTiers[0]?.minQty ?? 1) ? 'is-active' : ''}>
                  <td>1+</td><td>{formatCLP(product.b2bNet)}</td>
                </tr>
                {product.volumeTiers.map((t, i) => {
                  const upper = product.volumeTiers![i + 1]?.minQty
                  const active = qty >= t.minQty && (!upper || qty < upper)
                  return <tr key={t.minQty} className={active ? 'is-active' : ''}><td>{t.minQty}+</td><td>{formatCLP(t.unitNet)}</td></tr>
                })}
              </tbody>
            </table>
          ) : null}
          {nextTier && (
            <p className="pdp__tierhint">Agrega {nextTier.minQty - qty} más y baja a {formatCLP(nextTier.unitNet)} neto por unidad.</p>
          )}

          {/* Zona de compra (visible en desktop; en móvil va en la barra fija) */}
          <div className="pdp__buy">
            <div className="qtyrow">
              <div className="qty">
                <button onClick={() => setQty((q) => clampQty(q - 1))} aria-label="Restar">−</button>
                <input type="number" min={1} max={maxQty} value={qty} onChange={(e) => setQty(clampQty(Number(e.target.value) || 1))} />
                <button onClick={() => setQty((q) => clampQty(q + 1))} aria-label="Sumar">+</button>
              </div>
              <button className="btn btn--primary btn--lg pdp__add" onClick={onAdd}>
                {added ? <><Icon name="check" /> Agregado</> : mode === 'b2b' ? 'Agregar a la orden' : 'Agregar al carro'}
              </button>
            </div>
            <div className="pdp__buy-foot">
              <span className="pdp__subtotal">Subtotal ({qty} {product.unit}): <strong>{formatCLP(price.unitGross * qty)}</strong>{mode === 'b2b' && <span className="muted"> · Neto {formatCLP(price.unitNet * qty)}</span>}</span>
              <span className="pdp__max">Máximo {maxQty} unidades</span>
            </div>
          </div>

          <ul className="pdp__perks">
            {product.freeShipping && <li><Icon name="truck" /> Despacho gratis en compras sobre $49.990</li>}
            <li><Icon name="lock" /> Pago seguro Webpay y transferencia</li>
            <li><Icon name="return" /> 30 días para cambios y devoluciones</li>
          </ul>

          {mode === 'b2b' && (
            <Link to="/cotizacion" className="btn btn--ghost btn--block pdp__quote"><Icon name="doc" /> Solicitar cotización</Link>
          )}

          <Calculator product={product} />
        </div>
      </div>

      {/* Sobre este producto: secciones colapsables (estilo Target) */}
      <section className="aboutitem">
        <h2 className="section-title">Sobre este producto</h2>
        <div className="aboutitem__card">
          <Accordion title="Detalles" defaultOpen>
            <p className="aboutitem__desc">{product.description}</p>
            <ul className="aboutitem__bullets">
              <li>Marca {product.brand}</li>
              <li>Unidad de venta: {product.unit}</li>
              {Object.entries(product.specs).slice(0, 3).map(([k, v]) => (<li key={k}>{k}: {v}</li>))}
            </ul>
          </Accordion>

          <Accordion title="Especificaciones">
            <table className="aboutitem__specs">
              <tbody>
                {Object.entries(product.specs).map(([k, v]) => (<tr key={k}><th>{k}</th><td>{v}</td></tr>))}
                <tr><th>Marca</th><td>{product.brand}</td></tr>
                <tr><th>Unidad de venta</th><td>{product.unit}</td></tr>
                <tr><th>SKU</th><td>{product.sku}</td></tr>
              </tbody>
            </table>
            {mode === 'b2b' && (
              <div className="stockbox stockbox--inline">
                <h3>Stock por bodega</h3>
                <ul>
                  {warehouses.map((w) => (<li key={w}><span>{w}</span><strong>{product.stockByWarehouse[w] ?? 0} u.</strong></li>))}
                </ul>
              </div>
            )}
          </Accordion>

          <Accordion title="Despacho y devoluciones">
            <ul className="returns__list">
              <li><Icon name="truck" /> Despacho a domicilio en 24-72 hrs hábiles y retiro gratis en tienda.</li>
              <li><Icon name="return" /> Tienes <strong>30 días</strong> para cambios y devoluciones desde la recepción.</li>
              <li><Icon name="store" /> Gestiona el cambio en cualquier tienda Mimbral o en línea.</li>
              <li><Icon name="shield" /> Productos con garantía del fabricante ante fallas.</li>
            </ul>
          </Accordion>

        </div>
      </section>

      {/* Preguntas y respuestas */}
      <ProductQA product={product} />

      {/* Opiniones */}
      <ProductReviews product={product} />

      {/* Módulos recomendados (lazy: solo se montan al renderizar) */}
      <ProductCarousel title="Más opciones para elegir" products={recs.similar} viewAllTo={`/categoria/${category?.slug ?? product.categoryId}`} />
      <CompareTable current={product} products={recs.comparison.filter((p) => p.id !== product.id)} />
      <ProductCarousel title="Complementa tu compra" products={recs.complements} />
      <ProductCarousel title="También compraron" products={recs.frequentlyBoughtTogether} />
      <ProductCarousel title="Vistos recientemente" products={recentlyViewed} />

      {/* Barra de compra fija (móvil): reemplaza la navegación inferior en la ficha */}
      <div className="buybar">
        <span className="buybar__max">Máximo {maxQty} unidades</span>
        <div className="buybar__row">
          <div className="buybar__info">
            <span className="buybar__price">{formatCLP(price.unitGross)}</span>
            <span className="buybar__unit">por {product.unit}</span>
          </div>
          <div className="buybar__qty">
            <button onClick={() => setQty((q) => clampQty(q - 1))} aria-label="Restar">−</button>
            <span>{qty}</span>
            <button onClick={() => setQty((q) => clampQty(q + 1))} aria-label="Sumar">+</button>
          </div>
          <button className="btn btn--primary buybar__btn" onClick={onAdd}>{added ? <><Icon name="check" /> Listo</> : mode === 'b2b' ? 'Agregar' : 'Agregar al carro'}</button>
        </div>
      </div>

      {/* Bottom sheet de entrega con tabs */}
      {sheet && (
        <BottomSheet title="Opciones de entrega" icon="truck" onClose={() => setSheet(null)}>
          <div className="dsheet__comuna"><Icon name="pin" /> Comuna: <strong>Santiago Centro</strong><button className="link-btn">Cambiar</button></div>
          <div className="dtabs" role="tablist">
            <button role="tab" aria-selected={sheet === 'despacho'} className={`dtab ${sheet === 'despacho' ? 'is-active' : ''}`} onClick={() => setSheet('despacho')}>Despacho</button>
            <button role="tab" aria-selected={sheet === 'retiro'} className={`dtab ${sheet === 'retiro' ? 'is-active' : ''}`} onClick={() => setSheet('retiro')}>Retiro</button>
            <button role="tab" aria-selected={sheet === 'tienda'} className={`dtab ${sheet === 'tienda' ? 'is-active' : ''}`} onClick={() => setSheet('tienda')}>En tienda</button>
          </div>

          {sheet === 'despacho' && (
            <div className="dopts">
              {despachoOpts.map((o) => (
                <div className="dopt" key={o.label}>
                  <span className="dopt__ic"><Icon name="truck" /></span>
                  <span className="dopt__txt"><strong>{o.label}</strong><span>Despacho a domicilio</span></span>
                  <span className="dopt__price">{formatCLP(o.cost)}</span>
                </div>
              ))}
            </div>
          )}
          {sheet === 'retiro' && (
            <div className="dopts">
              {retiroOpts.map((o) => (
                <div className="dopt" key={o.label}>
                  <span className="dopt__ic"><Icon name="store" /></span>
                  <span className="dopt__txt"><strong>{o.label} · {o.store}</strong><span>{o.when}</span></span>
                  <span className="dopt__price dopt__price--free">Gratis</span>
                </div>
              ))}
            </div>
          )}
          {sheet === 'tienda' && (
            <div className="dstore">
              <p className="dstore__ok"><Icon name="check" /> Disponible en <strong>Tienda Balmaceda</strong></p>
              <div className="dstore__grid">
                <div><span>Stock</span><strong>{product.stock} unidades</strong></div>
                <div><span>Pasillo</span><strong>A</strong></div>
                <div><span>Rack</span><strong>03</strong></div>
                <div><span>Nivel</span><strong>2</strong></div>
              </div>
              <p className="muted">Acércate a un asesor con el SKU {product.sku} para retirarlo en sala.</p>
            </div>
          )}
          <button className="btn btn--primary sheet__cta" onClick={() => setSheet(null)}>Listo</button>
        </BottomSheet>
      )}
    </div>
  )
}
