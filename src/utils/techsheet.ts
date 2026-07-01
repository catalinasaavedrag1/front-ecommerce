import type { Product } from '@/types'

/** Genera una ficha técnica completa (con datos mock derivados) para cualquier
 *  producto, de modo que la vista B2B siempre se vea poblada y profesional. */

export interface TechField { label: string; value: string }

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) & 0xffff
  return h
}

const WARRANTY_BY_CAT: Record<string, string> = {
  herramientas: '12 meses', electrohogar: '12 meses', muebles: '12 meses',
  automovil: '6 meses', gasfiteria: '6 meses', pisos: '6 meses',
  construccion: '3 meses', ferreteria: '3 meses', pinturas: '3 meses',
}

const CERTS = ['Certificación SEC', 'Norma NCh 148', 'ISO 9001', 'Sello eficiencia energética', 'Certificado CE', 'Norma ASTM']
const ORIGINS = ['Chile', 'Brasil', 'China', 'Alemania', 'México', 'España']

export function mockEan(p: Product): string {
  return String(7800000000000 + hash(p.id) * 977).slice(0, 13)
}

/** Devuelve la ficha técnica completa del producto (specs reales + campos derivados). */
export function technicalSheet(p: Product): TechField[] {
  const fields: TechField[] = []
  const seen = new Set<string>()
  const push = (label: string, value?: string) => {
    if (!value || seen.has(label)) return
    seen.add(label)
    fields.push({ label, value })
  }
  push('SKU', p.sku)
  push('Código EAN', p.ean ?? mockEan(p))
  push('Código proveedor', `PRV-${hash(p.sku).toString().padStart(5, '0')}`)
  push('Marca', p.brand)
  push('Proveedor', p.supplier ?? `${p.brand} S.A.`)
  push('Unidad de venta', p.unit)
  for (const [k, v] of Object.entries(p.specs)) push(k, v)
  push('Peso', `${(1 + (hash(p.id) % 240) / 10).toFixed(1)} kg`)
  push('Origen', ORIGINS[hash(p.brand) % ORIGINS.length])
  push('Garantía', WARRANTY_BY_CAT[p.categoryId] ?? '3 meses')
  push('Certificaciones', CERTS[hash(p.id) % CERTS.length])
  return fields
}

export interface ProductDoc { label: string; type: string }

/** Documentos descargables (mock) asociados al producto. */
export function productDocs(p: Product): ProductDoc[] {
  const docs: ProductDoc[] = [
    { label: 'Ficha técnica', type: 'PDF' },
    { label: 'Hoja de seguridad', type: 'PDF' },
  ]
  if (['herramientas', 'electrohogar', 'automovil', 'gasfiteria'].includes(p.categoryId)) {
    docs.push({ label: 'Manual de uso', type: 'PDF' })
  }
  docs.push({ label: 'Certificado de calidad', type: 'PDF' })
  return docs
}
