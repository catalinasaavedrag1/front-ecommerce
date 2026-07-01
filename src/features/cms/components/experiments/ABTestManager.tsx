'use client'

import { useCmsResource } from '@/features/cms/hooks/useCmsResource'
import { simulateRequest } from '@/features/cms/services/simulate'
import { experiments } from '@/features/cms/mocks'
import { AB_METRIC_LABEL, type Tone } from '@/features/cms/constants'
import type { CmsExperiment } from '@/features/cms/types'
import { Button, CmsIcon, EmptyState, PageHeader, Pill, ResourceState } from '@/features/cms/components/ui'

const STATUS: Record<CmsExperiment['status'], { label: string; tone: Tone }> = {
  draft: { label: 'Borrador', tone: 'default' }, running: { label: 'En curso', tone: 'brand' }, paused: { label: 'Pausado', tone: 'warning' }, finished: { label: 'Finalizado', tone: 'success' },
}

export function ABTestManager() {
  const { state, data, error } = useCmsResource(() => simulateRequest(experiments), [])
  return (
    <div>
      <PageHeader eyebrow="Marketing & SEO" title="Experimentos A/B" subtitle="Crea variantes A/B, define split de tráfico y métrica objetivo, pausa y elige ganador." actions={<Button variant="green" icon="plus">Nuevo experimento</Button>} />
      <ResourceState state={state} error={error} empty={<EmptyState icon="experiment" title="Sin experimentos" />}>
        <div className="jc-rows">
          {(data ?? []).map((e) => {
            const st = STATUS[e.status]
            const better = e.liftB >= e.liftA ? 'B' : 'A'
            return (
              <div key={e.id} className={`jc-row jc-row--${st.tone === 'success' ? 'default' : st.tone === 'brand' ? 'brand' : st.tone}`} style={{ gridTemplateColumns: '1.5fr 1.4fr auto', gap: 20 }}>
                <div>
                  <div className="jc-row__title">{e.name}</div>
                  <div className="jc-row__meta">{e.entityType} · {e.entityName} · objetivo: {AB_METRIC_LABEL[e.metric]}{e.startAt ? ` · ${e.startAt} → ${e.endAt}` : ''}</div>
                </div>
                <div>
                  <div className="jc-abbar">
                    <span className="jc-abbar__a" style={{ width: `${e.trafficA}%` }}>A {e.trafficA}%</span>
                    <span className="jc-abbar__b" style={{ width: `${e.trafficB}%` }}>B {e.trafficB}%</span>
                  </div>
                  <div className="jc-row__meta" style={{ marginTop: 6, display: 'flex', gap: 12 }}>
                    <span>A: <strong>{e.liftA}%</strong></span>
                    <span>B: <strong>{e.liftB}%</strong></span>
                    {e.status === 'running' && <span className="jc-muted">gana {better} (parcial)</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  {e.winner ? <Pill tone="success" soft>Ganó {e.winner}</Pill> : <Pill tone={st.tone} soft>{st.label}</Pill>}
                  {e.status === 'running' && <Button variant="ghost" icon="clock" size="sm">Pausar</Button>}
                  {e.status !== 'finished' && e.status !== 'draft' && <Button variant="outline-green" icon="check" size="sm">Elegir ganador</Button>}
                </div>
              </div>
            )
          })}
        </div>
        <p className="jc-help" style={{ marginTop: 12 }}><CmsIcon name="experiment" /> Métricas: click CTA, agregar al carrito, conversión, tiempo, scroll, formulario.</p>
      </ResourceState>
    </div>
  )
}
