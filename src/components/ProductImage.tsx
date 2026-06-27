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
  const hue = (hueFor(product.id) + variant * 47) % 360
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
