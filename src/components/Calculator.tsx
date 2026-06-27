import { useState } from 'react'
import type { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import Icon from './Icon'

/** Calculadoras de cantidad (estimación referencial) para la ficha. */
export default function Calculator({ product }: { product: Product }) {
  const { add } = useCart()
  const [area, setArea] = useState('')
  const [coats, setCoats] = useState(2)
  const [added, setAdded] = useState(false)

  const type = product.calculator
  if (!type) return null

  const value = Number(area) || 0
  const num = (s?: string) => Number((s || '').replace(/[^\d.]/g, '')) || 0

  let qty = 0
  let label = ''
  let inputLabel = ''
  let unitWord = product.unit

  if (type === 'pintura') {
    const rend = num(product.specs['Rendimiento']) || 11 // m²/L
    const galon = 3.785
    const liters = value * coats / rend
    qty = Math.max(0, Math.ceil(liters / galon))
    inputLabel = 'Superficie a pintar (m²)'
    label = `≈ ${liters.toFixed(1)} L · ${qty} ${unitWord}(es)`
  } else if (type === 'piso') {
    const perBox = product.unit === 'm²' ? 1 : num(product.specs['Rendimiento']) || 1
    qty = Math.max(0, Math.ceil((value * 1.08) / perBox))
    inputLabel = 'Superficie a cubrir (m²)'
    label = `Con 8% de merma: ${qty} ${unitWord}(s)`
  } else if (type === 'cemento') {
    qty = Math.max(0, Math.ceil(value * 7)) // ~7 sacos por m³
    inputLabel = 'Hormigón a preparar (m³)'
    unitWord = 'saco'
    label = `≈ ${qty} sacos de cemento`
  } else if (type === 'cable') {
    qty = Math.max(0, Math.ceil(value / 100)) // rollo de 100m
    inputLabel = 'Metros de cable necesarios'
    unitWord = 'rollo'
    label = `≈ ${qty} rollo(s) de 100 m`
  }

  return (
    <div className="calc">
      <div className="calc__head">
        <Icon name="trend" /> <strong>Calculadora de cantidad</strong>
      </div>
      <div className="calc__row">
        <label>
          {inputLabel}
          <input type="number" min={0} value={area} onChange={(e) => setArea(e.target.value)} placeholder="0" />
        </label>
        {type === 'pintura' && (
          <label className="calc__coats">
            Manos
            <input type="number" min={1} max={4} value={coats} onChange={(e) => setCoats(Math.max(1, Number(e.target.value) || 1))} />
          </label>
        )}
      </div>
      {value > 0 && (
        <div className="calc__result">
          <span>{label}</span>
          <button
            className="btn btn--primary"
            onClick={() => { if (qty > 0) { add(product.id, qty); setAdded(true); setTimeout(() => setAdded(false), 1800) } }}
          >
            {added ? 'Agregado' : `Agregar ${qty}`}
          </button>
        </div>
      )}
      <span className="calc__note">Estimación referencial. Ajusta según tu proyecto.</span>
    </div>
  )
}
