'use client'

import { useMemo, useState } from 'react'
import { useCmsResource } from '@/features/cms/hooks/useCmsResource'
import { simulateRequest } from '@/features/cms/services/simulate'
import { auditLogs } from '@/features/cms/mocks'
import { Avatar, Button, CmsIcon, EmptyState, IconButton, PageHeader, Pagination, ResourceState } from '@/features/cms/components/ui'

const COLS = '160px 1fr 1.4fr 44px'

export function AuditLogTable() {
  const { state, data, error } = useCmsResource(() => simulateRequest(auditLogs), [])
  const [q, setQ] = useState('')
  const rows = useMemo(() => (data ?? []).filter((a) => !q || `${a.user} ${a.action} ${a.entityName}`.toLowerCase().includes(q.toLowerCase())), [data, q])

  return (
    <div>
      <PageHeader eyebrow="Gobierno" title="Auditoría" subtitle="Registro completo: usuario, acción, contenido, valor anterior/nuevo, fecha y estado." actions={<Button variant="blue" icon="export">Exportar</Button>} />
      <div className="jc-toolbar">
        <div className="jc-search"><CmsIcon name="search" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar usuario, acción o contenido…" /></div>
        <div className="jc-toolbar__spacer" /><div className="jc-toolbar__icons"><IconButton icon="filter" /></div>
      </div>
      <ResourceState state={state} error={error} empty={<EmptyState icon="audit" title="Sin registros" />}>
        <>
          <div className="jc-listhead" style={{ gridTemplateColumns: COLS }}><span>Fecha</span><span>Usuario / Acción</span><span>Cambio</span><span></span></div>
          <div className="jc-rows">
            {rows.map((a) => (
              <div key={a.id} className="jc-row jc-row--default" style={{ gridTemplateColumns: COLS }}>
                <span className="jc-mono" style={{ fontSize: '0.78rem' }}>{a.at}</span>
                <div className="jc-userin"><Avatar name={a.user} /><div><div style={{ fontSize: '0.86rem' }}><strong>{a.user}</strong></div><small className="jc-muted">{a.action} · {a.entityType} · {a.entityName}</small></div></div>
                <div style={{ fontSize: '0.84rem' }}><span className="jc-muted">{a.before}</span> <CmsIcon name="chevron" /> <strong>{a.after}</strong></div>
                <IconButton icon="eye" />
              </div>
            ))}
          </div>
          <Pagination total={rows.length} />
        </>
      </ResourceState>
    </div>
  )
}
