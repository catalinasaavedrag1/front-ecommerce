import type { Product } from '@/types'

export type VariantOption = { label: string; color?: string }
export type VariantGroup = { type: string; options: VariantOption[] }

const COLORS = {
  Blanco: '#f3f3f0', Negro: '#23262b', Gris: '#8a9099', Beige: '#d8c7a6',
  Café: '#7a5236', Natural: '#caa472', Acero: '#b9c0c7', Cromado: '#c9d2da',
  Roble: '#b5803f', Cerezo: '#7d3b2e', Grafito: '#3b4047', Arena: '#cdbb97',
}
const sw = (...names: (keyof typeof COLORS)[]): VariantOption[] => names.map((n) => ({ label: n, color: COLORS[n] }))

/** Variantes (demo) según la categoría del producto. Vacío = sin variantes. */
export function getVariants(product: Product): VariantGroup[] {
  switch (product.categoryId) {
    case 'pinturas':
      return [
        { type: 'Color', options: sw('Blanco', 'Gris', 'Negro', 'Beige', 'Café') },
        { type: 'Formato', options: [{ label: '1 Galón' }, { label: '1 Litro' }, { label: '1/4 Galón' }] },
      ]
    case 'pisos':
      return [
        { type: 'Tono', options: sw('Roble', 'Natural', 'Grafito', 'Cerezo') },
        { type: 'Formato', options: [{ label: '1.20 × 0.19 m' }, { label: '1.20 × 0.14 m' }] },
      ]
    case 'muebles':
    case 'dormitorio':
    case 'decoracion':
      return [{ type: 'Color', options: sw('Natural', 'Blanco', 'Negro', 'Café', 'Grafito') }]
    case 'bano':
    case 'cocina':
      return [{ type: 'Terminación', options: sw('Cromado', 'Negro', 'Acero') }]
    case 'electrohogar':
      return [{ type: 'Color', options: sw('Blanco', 'Acero', 'Negro') }]
    default:
      return []
  }
}
