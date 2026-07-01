'use client'

import { useCmsResource } from '@/features/cms/hooks/useCmsResource'
import { simulateRequest } from '@/features/cms/services/simulate'
import { pendingPublications } from '@/features/cms/mocks'
import { CHANNEL_LABEL, STATUS_META, type Tone } from '@/features/cms/constants'
import { Button, EmptyState, PageHeader, Pill, ResourceState, StatusPill } from '@/features/cms/components/ui'

const FLOW: { key: string; label: string }[] = [
  { key: 'draft', label: 'Borrador' }, { key: 'in_review', label: 'En revisión' }, { key: 'changes_requested', label: 'Cambios' },
  { key: 'approved', label: 'Aprobado' }, { key: 'scheduled', label: 'Programado' }, { key: 'published', label: 'Publicado' },
]
const rowMod = (t: Tone) => (t === 'success' ? '' : t === 'info' ? 'jc-row--brand' : `jc-row--${t}`)

export function ApprovalWorkflowPanel() {
  const { state, data, error } = useCmsResource(() => simulateRequest(pendingPublications), [])
  return (
    <div>
      <PageHeader eyebrow="Publicación" title="Aprobaciones" subtitle="Flujo Borrador → En revisión → Cambios → Aprobado → Programado → Publicado, con comentarios y responsables." />
      <div className="jc-flow">
        {FLOW.map((s, i) => (
          <div className="jc-flow__step" key={s.key}>
            <span className="jc-flow__dot" />{s.label}{i < FLOW.length - 1 && <span className="jc-flow__arrow">→</span>}
          </div>
        ))}
      </div>
      <ResourceState state={state} error={error} empty={<EmptyState icon="approval" title="Nada pendiente" description="No hay contenido esperando aprobación." />}>
        <div className="jc-rows">
          {(data ?? []).map((p) => (
            <div key={p.id} className={`jc-row ${rowMod(STATUS_META[p.status].tone)}`} style={{ gridTemplateColumns: '1fr auto auto' }}>
              <div>
                <div className="jc-row__title">{p.entityType} · {p.entityName}</div>
                <div className="jc-row__meta">Solicitó {p.requestedBy}{p.dueDate ? ` · vence ${p.dueDate}` : ''} · {p.comments} comentarios</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 12 }}>
                <Pill tone="brand" soft>{CHANNEL_LABEL[p.channel]}</Pill>
                <StatusPill status={p.status} soft />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Button variant="outline-green" icon="approval" size="sm">Aprobar</Button>
                <Button variant="ghost" icon="edit" size="sm">Cambios</Button>
              </div>
            </div>
          ))}
        </div>
      </ResourceState>
    </div>
  )
}
