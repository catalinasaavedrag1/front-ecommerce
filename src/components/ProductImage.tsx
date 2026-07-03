import { useState } from 'react'
import type { Product } from '@/types'
import { CategoryIcon } from './Icon'

/**
 * Imagen de producto autocontenida y confiable (sin depender de fotos remotas):
 * un tile con degradado de color único por producto (hue derivado del id) y el
 * icono de su categoría en blanco. Alto contraste, variado y profesional.
 */

interface Props {
  product: Product
  className?: string
  variant?: number
}

function hueFor(id: string): number {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360
  return h
}

export default function ProductImage({ product, className, variant = 0 }: Props) {
  // Si el producto trae imagen real (BFF), se muestra; ante error se cae al tile.
  const [broken, setBroken] = useState(false)
  const hue = (hueFor(product.id) + variant * 47) % 360
  if (product.imageUrl && !broken) {
    return (
      <div className={`pimg pimg--photo ${className ?? ''}`} role="img" aria-label={product.name}>
        <img src={product.imageUrl} alt={product.name} loading="lazy" onError={() => setBroken(true)} />
      </div>
    )
  }
  const c1 = `hsl(${hue} 50% 47%)`
  const c2 = `hsl(${(hue + 24) % 360} 55% 33%)`
  return (
    <div
      className={`pimg ${className ?? ''}`}
      style={{ ['--c1' as string]: c1, ['--c2' as string]: c2 }}
      role="img"
      aria-label={product.name}
    >
      <CategoryIcon id={product.categoryId} className="pimg__icon" />
    </div>
  )
}
