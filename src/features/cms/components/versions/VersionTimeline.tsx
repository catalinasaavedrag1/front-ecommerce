'use client'

import { useCmsResource } from '@/features/cms/hooks/useCmsResource'
import { simulateRequest } from '@/features/cms/services/simulate'
import { versions } from '@/features/cms/mocks'
import { Avatar, Button, CmsIcon, EmptyState, PageHeader, Pill, ResourceState } from '@/features/cms/components/ui'

export function VersionTimeline() {
  const { state, data, error } = useCmsResource(() => simulateRequest(versions), [])
  return (
    <div>
      <PageHeader eyebrow="Publicación" title="Versiones & Rollback" subtitle="Historial de versiones con comparación y restauración (banner, landing o home completa)." actions={<Button variant="ghost" icon="version">Comparar seleccionadas</Button>} />
      <ResourceState state={state} error={error} empty={<EmptyState icon="version" title="Sin versiones" />}>
        <div className="jc-timeline">
          {(data ?? []).map((v) => (
            <div className="jc-tl" key={v.id}>
              <span className={`jc-tl__dot ${v.isActive ? 'is-active' : ''}`} />
              <div className="jc-tl__card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <strong>{v.entityType} · {v.entityName}</strong>
                    <Pill tone={v.isActive ? 'success' : 'default'} soft>v{v.version}{v.isActive ? ' · activa' : ''}</Pill>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button variant="ghost" icon="eye" size="sm">Ver</Button>
                    {!v.isActive && <Button variant="outline-green" icon="refresh" size="sm">Restaurar</Button>}
                  </div>
                </div>
                <div className="jc-userin" style={{ marginTop: 8 }}>
                  <Avatar name={v.author} />
                  <div><div style={{ fontSize: '0.86rem' }}>{v.note}</div><small className="jc-muted">{v.author} · {v.createdAt} · {v.changes} cambios</small></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="jc-help" style={{ marginTop: 12 }}><CmsIcon name="version" /> Rollback disponible para banner, landing y home completa.</p>
      </ResourceState>
    </div>
  )
}
