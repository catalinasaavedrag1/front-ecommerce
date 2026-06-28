import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import Icon from './Icon'

type CalcType = NonNullable<Product['calculator']>

const CONFIG: Record<CalcType, { title: string; help: string; inputLabel: string; unitWord: string; icon: 'pinturas' | 'pisos' | 'construccion' | 'electricidad' }> = {
  pintura: { title: 'Calcula cuánta pintura comprar', help: '¿Cómo medir los m²?', inputLabel: 'Superficie a pintar en m²', unitWord: 'galones', icon: 'pinturas' },
  piso: { title: 'Calcula cuántas cajas comprar', help: '¿Cómo medir los m²?', inputLabel: 'Superficie del ambiente en m²', unitWord: 'cajas', icon: 'pisos' },
  cemento: { title: 'Calcula cuántos sacos comprar', help: '¿Cómo estimar el hormigón?', inputLabel: 'Hormigón a preparar en m³', unitWord: 'sacos', icon: 'construccion' },
  cable: { title: 'Calcula cuántos rollos comprar', help: 'Mide el recorrido del cable', inputLabel: 'Metros de cable necesarios', unitWord: 'rollos', icon: 'electricidad' },
}

const num = (s?: string) => Number((s || '').replace(/[^\d.]/g, '')) || 0

/** Calculadora de cantidad por categoría, compartible (parámetros en la URL). */
export default function Calculator({ product }: { product: Product }) {
  const type = product.calculator
  const { add } = useCart()
  const [params, setParams] = useSearchParams()
  const [added, setAdded] = useState(false)
  const [shared, setShared] = useState(false)

  // Estado inicial desde la URL (cálculo compartido)
  const [area, setArea] = useState(params.get('calc_m2') ?? '')
  const [coats, setCoats] = useState(Number(params.get('calc_capas')) || 1)
  const [extra, setExtra] = useState(params.get('calc_extra') === 'true')

  if (!type) return null
  const cfg = CONFIG[type]
  const value = num(area)
  const maxQty = Math.min(product.stock, 99)

  // Mantén la URL sincronizada para poder compartir el cálculo
  const sync = (next: { area?: string; coats?: number; extra?: boolean }) => {
    const a = next.area ?? area, c = next.coats ?? coats, e = next.extra ?? extra
    const p = new URLSearchParams(params)
    if (num(a) > 0) { p.set('calc_m2', String(a)); p.set('calc_capas', String(c)); p.set('calc_extra', String(e)) }
    else { p.delete('calc_m2'); p.delete('calc_capas'); p.delete('calc_extra') }
    setParams(p, { replace: true })
  }

  // Rendimiento real desde specs; si no existe para pintura, no inventamos
  const rendPintura = num(product.specs['Rendimiento'])
  const rendPiso = product.unit === 'm²' ? 1 : num(product.specs['Rendimiento']) || num(product.specs['Cobertura'])
  const noData = (type === 'pintura' && !rendPintura) || (type === 'piso' && !rendPiso)

  let baseQty = 0, formula = ''
  if (type === 'pintura') {
    const liters = (value * coats) / (rendPintura || 1)
    baseQty = liters / 3.785
    formula = `${value} m² × ${coats} capa(s) ÷ ${rendPintura} m²/L`
  } else if (type === 'piso') {
    baseQty = value / (rendPiso || 1)
    formula = `${value} m² ÷ ${rendPiso || 1} m²/${cfg.unitWord.slice(0, -1)}`
  } else if (type === 'cemento') {
    baseQty = value * 7
    formula = `${value} m³ × 7 sacos/m³`
  } else if (type === 'cable') {
    baseQty = value / 100
    formula = `${value} m ÷ 100 m/rollo`
  }
  const withExtra = extra ? baseQty * 1.1 : baseQty
  const qty = Math.ceil(Math.max(0, withExtra)) // siempre hacia arriba
  const exceeds = qty > maxQty

  const onAdd = () => {
    const q = Math.min(qty, maxQty)
    if (q > 0) { add(product.id, q); setAdded(true); setTimeout(() => setAdded(false), 1800) }
  }
  const onShare = async () => {
    const msg = `Calculé que necesito ${qty} ${cfg.unitWord} de ${product.name}` + (type === 'pintura' ? ` para pintar ${value} m² con ${coats} capa(s).` : ` para ${value} ${type === 'cemento' ? 'm³' : type === 'cable' ? 'm' : 'm²'}.`)
    const url = window.location.href
    if (navigator.share) { try { await navigator.share({ title: product.name, text: msg, url }) } catch { /* cancelado */ } }
    else { try { await navigator.clipboard.writeText(`${msg} ${url}`); setShared(true); setTimeout(() => setShared(false), 1800) } catch { /* ignore */ } }
  }

  return (
    <div className="calc">
      <div className="calc__head">
        <span className="calc__ic"><Icon name={cfg.icon} /></span>
        <div>
          <strong>{cfg.title}</strong>
          <a href="#medir" className="calc__help">{cfg.help}</a>
        </div>
      </div>

      <div className="calc__fields">
        <label className="calc__field">
          <span>{cfg.inputLabel}</span>
          <input type="number" min={0} value={area} onChange={(e) => { setArea(e.target.value); sync({ area: e.target.value }) }} placeholder="0" />
        </label>
        {type === 'pintura' && (
          <div className="calc__field">
            <span>Capas de pintura</span>
            <div className="qty calc__coats">
              <button type="button" onClick={() => { const c = Math.max(1, coats - 1); setCoats(c); sync({ coats: c }) }} aria-label="Restar capa">−</button>
              <span>{coats}</span>
              <button type="button" onClick={() => { const c = Math.min(5, coats + 1); setCoats(c); sync({ coats: c }) }} aria-label="Sumar capa">+</button>
            </div>
          </div>
        )}
      </div>

      {noData ? (
        <p className="calc__nodata"><Icon name="close" /> No tenemos rendimiento suficiente para calcular automáticamente.</p>
      ) : (
        <>
          <div className="calc__result">
            <div className="calc__need">
              <Icon name={cfg.icon} />
              <span>Necesitas <strong>{qty}</strong> {cfg.unitWord}</span>
            </div>
            <label className="calc__extra">
              <input type="checkbox" checked={extra} onChange={(e) => { setExtra(e.target.checked); sync({ extra: e.target.checked }) }} />
              Agregar 10% extra al total para cubrir posibles pérdidas.
            </label>
          </div>
          {value > 0 && (
            <>
              <p className="calc__formula">Cálculo: {formula}{extra ? ' + 10% pérdidas' : ''}</p>
              {exceeds && <p className="calc__warn"><Icon name="box" /> La cantidad calculada supera el stock. Puedes agregar hasta {maxQty} unidades.</p>}
              <div className="calc__actions">
                <button className="btn btn--primary" onClick={onAdd} disabled={qty <= 0}>
                  {added ? <><Icon name="check" /> Agregado</> : `Agregar ${Math.min(qty, maxQty)} al carro`}
                </button>
                <button className="btn btn--ghost calc__share" onClick={onShare}>
                  <Icon name={shared ? 'check' : 'share'} /> {shared ? 'Copiado' : 'Compartir cálculo'}
                </button>
              </div>
            </>
          )}
        </>
      )}
      <span className="calc__note">Estimación referencial. Ajusta según tu proyecto.</span>
    </div>
  )
}
