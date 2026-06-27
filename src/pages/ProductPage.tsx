import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getProduct, productsByCategory, warehouses } from '@/data/products'
import { useApp } from '@/context/AppContext'
import { useCart } from '@/context/CartContext'
import PriceTag from '@/components/PriceTag'
import Rating from '@/components/Rating'
import ProductCard from '@/components/ProductCard'
import ProductImage from '@/components/ProductImage'
import Icon from '@/components/Icon'
import { useWishlist } from '@/context/WishlistContext'
import { priceFor, nextVolumeTier } from '@/utils/pricing'
import { formatCLP } from '@/utils/format'

export default function ProductPage() {
  const { id = '' } = useParams()
  const product = getProduct(id)
  const { mode, customer } = useApp()
  const { add } = useCart()
  const wishlist = useWishlist()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [view, setView] = useState(0)

  if (!product) {
    return (
      <div className="container empty">
        <h1>Producto no encontrado</h1>
        <Link to="/" className="btn btn--primary">Volver al inicio</Link>
      </div>
    )
  }

  const related = productsByCategory(product.categoryId).filter((p) => p.id !== product.id).slice(0, 4)
  const price = priceFor(product, qty, mode, customer)
  const nextTier = mode === 'b2b' ? nextVolumeTier(product, qty) : undefined

  const onAdd = () => {
    add(product.id, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div className="container">
      <nav className="breadcrumb">
        <Link to="/">Inicio</Link> <span>/</span>{' '}
        <Link to={`/categoria/${product.categoryId}`}>Categoría</Link> <span>/</span>{' '}
        <span>{product.name}</span>
      </nav>

      <div className="pdp">
        <div className="pdp__gallery">
          <div className="pdp__stage">
            <ProductImage product={product} variant={view} className="pdp__img" />
            <div className="pdp__badges">
              {product.tags?.map((t) => (
                <span key={t} className={`tag tag--${t.toLowerCase().replace(/\s/g, '-')}`}>
                  {t}
                </span>
              ))}
            </div>
            <button
              className={`fav fav--lg ${wishlist.has(product.id) ? 'is-on' : ''}`}
              onClick={() => wishlist.toggle(product.id)}
              aria-label="Favorito"
            >
              <Icon name="heart" filled={wishlist.has(product.id)} />
            </button>
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

        <div className="pdp__info">
          <span className="pdp__brand">{product.brand}</span>
          <h1>{product.name}</h1>
          <div className="pdp__meta">
            <Rating value={product.rating} reviews={product.reviews} />
            <span className="pdp__sku">SKU: {product.sku}</span>
          </div>

          <p className="pdp__desc">{product.description}</p>

          <div className="pdp__buybox">
            <PriceTag product={product} qty={qty} />

            {mode === 'b2b' && product.volumeTiers?.length ? (
              <table className="tiers">
                <thead>
                  <tr>
                    <th>Cantidad</th>
                    <th>Precio neto unit.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className={qty < (product.volumeTiers[0]?.minQty ?? 1) ? 'is-active' : ''}>
                    <td>1+</td>
                    <td>{formatCLP(product.b2bNet)}</td>
                  </tr>
                  {product.volumeTiers.map((t, i) => {
                    const upper = product.volumeTiers![i + 1]?.minQty
                    const active = qty >= t.minQty && (!upper || qty < upper)
                    return (
                      <tr key={t.minQty} className={active ? 'is-active' : ''}>
                        <td>{t.minQty}+</td>
                        <td>{formatCLP(t.unitNet)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : null}

            {nextTier && (
              <p className="pdp__tierhint">
                Agrega {nextTier.minQty - qty} más y baja a{' '}
                {formatCLP(nextTier.unitNet)} neto por unidad.
              </p>
            )}

            <div className="qtyrow">
              <div className="qty">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Restar">
                  −
                </button>
                <input
                  type="number"
                  min={1}
                  value={qty}
                  onChange={(e) => setQty(Math.max(1, Number(e.target.value) || 1))}
                />
                <button onClick={() => setQty((q) => q + 1)} aria-label="Sumar">
                  +
                </button>
              </div>
              <button className="btn btn--primary btn--lg" onClick={onAdd}>
                {added ? '✓ Agregado' : mode === 'b2b' ? 'Agregar a la orden' : 'Agregar al carro'}
              </button>
            </div>

            <div className="pdp__subtotal">
              Subtotal ({qty} {product.unit}): <strong>{formatCLP(price.unitGross * qty)}</strong>
              {mode === 'b2b' && (
                <span> · Neto {formatCLP(price.unitNet * qty)}</span>
              )}
            </div>

            <ul className="pdp__perks">
              {product.freeShipping && <li><Icon name="truck" /> Despacho gratis en compras sobre $49.990</li>}
              <li><Icon name="store" /> Retiro en tienda disponible</li>
              <li><Icon name="return" /> 30 días para cambios</li>
            </ul>
          </div>
        </div>

        <aside className="pdp__side">
          {mode === 'b2b' ? (
            <div className="stockbox">
              <h3>Stock por bodega</h3>
              <ul>
                {warehouses.map((w) => (
                  <li key={w}>
                    <span>{w}</span>
                    <strong>{product.stockByWarehouse[w] ?? 0} u.</strong>
                  </li>
                ))}
              </ul>
              <Link to="/cotizacion" className="btn btn--ghost btn--block">
                Solicitar cotización
              </Link>
            </div>
          ) : (
            <div className="stockbox">
              <h3>Disponibilidad</h3>
              <p className="stockbox__ok"><Icon name="check" /> {product.stock} unidades en stock</p>
              <p className="stockbox__deliv"><Icon name="box" /> Llega en 24-72 hrs hábiles</p>
              <p className="stockbox__deliv"><Icon name="store" /> Retiro hoy en tienda seleccionada</p>
            </div>
          )}
        </aside>
      </div>

      <section className="specs">
        <h2 className="section-title">Especificaciones</h2>
        <table>
          <tbody>
            {Object.entries(product.specs).map(([k, v]) => (
              <tr key={k}>
                <th>{k}</th>
                <td>{v}</td>
              </tr>
            ))}
            <tr>
              <th>Marca</th>
              <td>{product.brand}</td>
            </tr>
            <tr>
              <th>Unidad de venta</th>
              <td>{product.unit}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {related.length > 0 && (
        <section className="row">
          <h2 className="section-title">Productos relacionados</h2>
          <div className="grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
