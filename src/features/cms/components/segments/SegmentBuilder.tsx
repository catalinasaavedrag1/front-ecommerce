'use client'

import { useMemo, useState } from 'react'
import { useCmsResource } from '@/features/cms/hooks/useCmsResource'
import { simulateRequest } from '@/features/cms/services/simulate'
import { segments } from '@/features/cms/mocks'
import { CHANNEL_LABEL, SEGMENT_TYPE_LABEL } from '@/features/cms/constants'
import { Button, CmsIcon, EmptyState, IconButton, PageHeader, Pill, ResourceState } from '@/features/cms/components/ui'

const COLS = 'minmax(200px,1.6fr) 1.1fr 0.8fr 0.9fr 44px'

export function SegmentBuilder() {
  const { state, data, error } = useCmsResource(() => simulateRequest(segments), [])
  const [q, setQ] = useState('')
  const rows = useMemo(() => (data ?? []).filter((s) => !q || s.name.toLowerCase().includes(q.toLowerCase())), [data, q])
  return (
    <div>
      <PageHeader eyebrow="Segmentación" title="Segmentos" subtitle="Segmentos B2C/B2B (crédito, sucursal, lista de precio, rubro, zona) para personalizar contenido con fallback general." actions={<Button variant="green" icon="plus">Nuevo segmento</Button>} />
      <div className="jc-toolbar">
        <div className="jc-search"><CmsIcon name="search" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar segmento…" /></div>
        <div className="jc-toolbar__spacer" /><div className="jc-toolbar__icons"><IconButton icon="filter" /></div>
      </div>
      <ResourceState state={state} error={error} empty={<EmptyState icon="segment" title="Sin segmentos" />}>
        <>
          <div className="jc-listhead" style={{ gridTemplateColumns: COLS }}><span>Segmento</span><span>Tipo</span><span>Canal</span><span>Miembros</span><span></span></div>
          <div className="jc-rows">
            {rows.map((s) => (
              <div key={s.id} className="jc-row jc-row--brand" style={{ gridTemplateColumns: COLS }}>
                <div><div className="jc-row__title">{s.name}</div><div className="jc-row__meta">{s.description}</div></div>
                <Pill tone="default" soft>{SEGMENT_TYPE_LABEL[s.type]}</Pill>
                <span>{CHANNEL_LABEL[s.channel]}</span>
                <span style={{ fontWeight: 700 }}>{s.members > 0 ? s.members.toLocaleString('es-CL') : '—'}</span>
                <div style={{ display: 'flex', gap: 6 }}><IconButton icon="eye" aria-label="Previsualizar como" /><IconButton icon="edit" /></div>
              </div>
            ))}
          </div>
          <p className="jc-help" style={{ marginTop: 12 }}><CmsIcon name="eye" /> Previsualiza la web “como” cada segmento desde el Preview Center.</p>
        </>
      </ResourceState>
    </div>
  )
}
