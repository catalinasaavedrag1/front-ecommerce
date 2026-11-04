'use client'

import { useState, type FormEvent } from 'react'
import PageHero from '@/components/PageHero'
import Icon from '@/components/Icon'
import { isBffEnabled } from '@/api/web-bff.client'
import { isAuthenticated } from '@/lib/auth'
import { fetchOrderTracking, fetchOrders } from '@/api/orders.api'
import { toUserMessage } from '@/lib/errors'
import type { BffOrderTracking } from '@/api/types'

/**
 * Seguimiento de pedido — oms-service a través del web-bff-service.
 *
 * Antes esta pantalla fingía: el paso actual se calculaba con
 * `(código.length % 3) + 1`, así que dos códigos distintos del mismo pedido
 * mostraban avances distintos. Ahora el estado y el historial vienen de OMS.
 *
 * Cómo se resuelve el código: el cliente escribe el NÚMERO de pedido
 * (`commerceId`), pero `/orders/:orderId/tracking` pide el id interno de OMS.
 * No hay endpoint de "buscar por número", así que se listan los pedidos de la
 * sesión y se busca ahí. Eso implica sesión.
 *
 * LÍMITE CONOCIDO (bloqueo real, no simulable): el seguimiento ANÓNIMO por
 * número de pedido necesita un endpoint público en el BFF. oms-public-service
 * ya lo resuelve para Mimbral 360 (`/api/public/delivery/tracking`), pero el
 * web-bff-service no lo reexpone. Sin sesión se dice eso en pantalla en vez de
 * inventar un avance.
 */

/** Pasos canónicos del avance de cara al cliente. */
const steps = [
  { key: 'recibido', label: 'Pedido recibido', desc: 'Confirmamos tu compra' },
  { key: 'preparando', label: 'En preparación', desc: 'Estamos armando tu pedido' },
  { key: 'despachado', label: 'Despachado', desc: 'Va en camino a tu dirección' },
  { key: 'entregado', label: 'Entregado', desc: 'Pedido recibido' },
]

/**
 * Estado de OMS → paso del avance. Los estados de OMS viven en su tabla
 * `order_status`, no en un enum fijo, así que se reconocen por palabra clave y
 * lo no reconocido se queda en "recibido" (nunca se adelanta el avance).
 */
function stepFor(status: string): number {
  const s = status.toLowerCase()
  if (s.includes('entreg')) return 3
  if (s.includes('despach') || s.includes('transito') || s.includes('tránsito') || s.includes('camino') || s.includes('ruta')) return 2
  if (s.includes('picking') || s.includes('prepar') || s.includes('auditor') || s.includes('packing')) return 1
  return 0
}

interface TrackState {
  code: string
  tracking: BffOrderTracking
}

export default function TrackingPage() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState<TrackState | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const puedeConsultar = isBffEnabled() && isAuthenticated()

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const clean = code.trim()
    if (!clean || loading) return
    setError(null)
    setResult(null)

    if (!puedeConsultar) {
      setError(
        isBffEnabled()
          ? 'Para ver el estado de tu pedido necesitas iniciar sesión. El seguimiento con solo el número de pedido todavía no está disponible en la web.'
          : 'El seguimiento en línea no está disponible en este momento. Escríbenos y lo revisamos contigo.'
      )
      return
    }

    setLoading(true)
    try {
      // 1) Número de pedido (commerceId) → id interno de OMS.
      const orders = await fetchOrders()
      const match = orders.find(
        (o) =>
          o.commerceId?.toLowerCase() === clean.toLowerCase() ||
          o.id?.toLowerCase() === clean.toLowerCase()
      )
      if (!match) {
        setError(`No encontramos el pedido ${clean.toUpperCase()} en tu cuenta. Revisa el número.`)
        return
      }
      // 2) Estado + historial reales de OMS.
      const tracking = await fetchOrderTracking(match.id)
      setResult({ code: match.commerceId || match.id, tracking })
    } catch (err) {
      setError(toUserMessage(err))
    } finally {
      setLoading(false)
    }
  }

  const current = result ? stepFor(result.tracking.status) : 0

  return (
    <div>
      <PageHero
        eyebrow="Estado de tu compra"
        title="Seguimiento de pedido"
        icon="📦"
        subtitle="Ingresa tu número de pedido (ej. MIM-528413) para ver su estado."
      />
      <div className="container track">
        <form className="track-form" onSubmit={submit}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="N° de pedido, ej. MIM-528413"
            aria-label="Número de pedido"
            disabled={loading}
          />
          <button type="submit" className="btn btn--primary" disabled={loading || !code.trim()}>
            {loading ? 'Buscando…' : 'Buscar'}
          </button>
        </form>

        {loading && <p className="muted" role="status">Consultando el estado de tu pedido…</p>}

        {error && !loading && (
          <div className="panel track-result" role="alert">
            <p className="muted">{error}</p>
          </div>
        )}

        {result && !loading && (
          <div className="panel track-result">
            <div className="track-result__head">
              <div>
                <span className="dashcard__label">Pedido</span>
                <strong>{result.code}</strong>
              </div>
              {/* El rótulo es el estado de OMS, sin traducir. */}
              <span className={`status status--${steps[current].key}`}>{result.tracking.status}</span>
            </div>
            <ol className="timeline">
              {steps.map((s, i) => (
                <li
                  key={s.key}
                  className={`timeline__step ${i < current ? 'is-done' : ''} ${i === current ? 'is-current' : ''}`}
                >
                  <span className="timeline__dot" aria-hidden>{i < current ? '✓' : i + 1}</span>
                  <div>
                    <strong>{s.label}</strong>
                    <span>{s.desc}</span>
                  </div>
                </li>
              ))}
            </ol>

            {/* Historial real de OMS: es el dato, no un adorno. */}
            {result.tracking.events.length > 0 && (
              <ul className="track-result__events">
                {result.tracking.events.map((ev, i) => (
                  <li key={`${ev.event}-${ev.at}-${i}`}>
                    <Icon name="clock" /> <strong>{ev.event}</strong>{' '}
                    <span className="muted">{new Date(ev.at).toLocaleString('es-CL')}</span>
                  </li>
                ))}
              </ul>
            )}
            {result.tracking.events.length === 0 && (
              <p className="muted">Aún no hay movimientos registrados para este pedido.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
