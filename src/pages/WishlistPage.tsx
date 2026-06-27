import { Link } from 'react-router-dom'
import { useWishlist } from '@/context/WishlistContext'
import { getProduct } from '@/data/products'
import ProductCard from '@/components/ProductCard'
import Icon from '@/components/Icon'

export default function WishlistPage() {
  const { ids } = useWishlist()
  const items = ids.map(getProduct).filter(Boolean)

  if (!items.length) {
    return (
      <div className="container empty">
        <div className="confirm__check confirm__check--muted"><Icon name="heart" /></div>
        <h1>Tu lista de favoritos está vacía</h1>
        <p>Guarda productos con el corazón para encontrarlos rápido después.</p>
        <Link to="/" className="btn btn--primary">
          Explorar productos
        </Link>
      </div>
    )
  }

  return (
    <div className="container">
      <h1 className="page-title">Mis favoritos</h1>
      <p className="lead">{items.length} productos guardados</p>
      <div className="grid">
        {items.map((p) => p && <ProductCard key={p.id} product={p} />)}
      </div>
    </div>
  )
}
