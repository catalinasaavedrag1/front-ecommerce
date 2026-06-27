import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { useApp } from '@/context/AppContext'
import { getProduct } from '@/data/products'
import ProductImage from './ProductImage'

/** Notificación flotante que confirma cuando se agrega un producto al carro. */
export default function Toast() {
  const { lastAdded } = useCart()
  const { mode } = useApp()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!lastAdded) return
    setVisible(true)
    const t = setTimeout(() => setVisible(false), 3500)
    return () => clearTimeout(t)
  }, [lastAdded])

  if (!lastAdded) return null
  const product = getProduct(lastAdded.productId)
  if (!product) return null

  return (
    <div className={`toast ${visible ? 'is-visible' : ''}`} role="status" aria-live="polite">
      <span className="toast__check">✓</span>
      <div className="toast__media">
        <ProductImage product={product} className="toast__img" />
      </div>
      <div className="toast__body">
        <strong>Agregado {mode === 'b2b' ? 'a la orden' : 'al carro'}</strong>
        <span>{product.name}</span>
      </div>
      <Link to="/carro" className="toast__cta" onClick={() => setVisible(false)}>
        Ver
      </Link>
    </div>
  )
}
