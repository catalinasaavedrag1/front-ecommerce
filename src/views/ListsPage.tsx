import { Link } from 'react-router-dom'
import { frequentLists } from '@/data/account'
import { getProduct } from '@/data/products'
import { useCart } from '@/context/CartContext'
import { buildTotals } from '@/utils/cart'
import { useApp } from '@/context/AppContext'
import { formatCLP } from '@/utils/format'
import PageHero from '@/components/PageHero'
import ProductCard from '@/components/ProductCard'
import Icon from '@/components/Icon'

export default function ListsPage() {
  const { add } = useCart()
  const { mode, customer } = useApp()

  return (
    <div>
      <PageHero
        eyebrow="Reposición rápida"
        title="Listas frecuentes"
        subtitle="Agrupa los productos que compras seguido y reabastécete en un clic."
      />
      <div className="container">
        {frequentLists.map((list) => {
          const items = list.productIds.map(getProduct).filter(Boolean)
          const totals = buildTotals(list.productIds.map((id) => ({ productId: id, qty: 1 })), mode, customer)
          return (
            <section className="row listsec" key={list.id}>
              <div className="listsec__head">
                <div>
                  <h2 className="section-title">{list.name}</h2>
                  <span className="listsec__meta">{items.length} productos · total {formatCLP(totals.gross)}</span>
                </div>
                <button className="btn btn--primary" onClick={() => list.productIds.forEach((id) => add(id))}>
                  <Icon name="cart" /> Agregar todo al carro
                </button>
              </div>
              <div className="grid">
                {items.map((p) => p && <ProductCard key={p.id} product={p} />)}
              </div>
            </section>
          )
        })}
        <p className="lead" style={{ marginTop: 32 }}>
          ¿Necesitas una lista a medida para tu obra? <Link to="/cotizacion" className="row__more">Solicita una cotización</Link>.
        </p>
      </div>
    </div>
  )
}
