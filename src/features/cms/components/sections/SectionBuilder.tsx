'use client'

import { useMemo, useState } from 'react'
import { useCmsResource } from '@/features/cms/hooks/useCmsResource'
import { simulateRequest } from '@/features/cms/services/simulate'
import { sections } from '@/features/cms/mocks'
import { CHANNEL_LABEL, STATUS_META, type Tone } from '@/features/cms/constants'
import type { SectionGroup } from '@/features/cms/types'
import { Button, CmsIcon, EmptyState, IconButton, PageHeader, Pill, ResourceState, StatusPill } from '@/features/cms/components/ui'

const COLS = '56px minmax(200px,1.6fr) 1fr 0.8fr 0.9fr 44px'
const GROUPS: { key: SectionGroup | 'all'; label: string }[] = [
  { key: 'all', label: 'Todas' }, { key: 'banners', label: 'Banners' }, { key: 'products', label: 'Productos' }, { key: 'content', label: 'Contenido' }, { key: 'navigation', label: 'Navegación' },
]
const groupColor: Record<SectionGroup, string> = {
  banners: 'linear-gradient(120deg,#1f4aa8,#2979ff)', products: 'linear-gradient(120deg,#0f6347,#2ecc71)',
  content: 'linear-gradient(120deg,#7a4a1d,#fb8c00)', navigation: 'linear-gradient(120deg,#5b2a86,#a06cec)',
}
const rowMod = (t: Tone) => (t === 'success' ? '' : t === 'info' ? 'jc-row--brand' : `jc-row--${t}`)

export function SectionBuilder() {
  const { state, data, error } = useCmsResource(() => simulateRequest(sections), [])
  const [q, setQ] = useState('')
  const [group, setGroup] = useState<SectionGroup | 'all'>('all')
  const rows = useMemo(
    () => (data ?? []).filter((s) => (group === 'all' || s.group === group) && (!q || s.internalName.toLowerCase().includes(q.toLowerCase()))),
    [data, q, group],
  )

  return (
    <div>
      <PageHeader eyebrow="Contenido" title="Section Builder" subtitle="Biblioteca de secciones reutilizables (banners, productos, contenido, navegación) con config desktop/mobile y reglas." actions={<Button variant="green" icon="plus">Nueva sección</Button>} />
      <div className="jc-toolbar">
        <div className="jc-search"><CmsIcon name="search" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar sección…" /></div>
        <div className="jc-seg jc-seg--sm">{GROUPS.map((g) => <button key={g.key} className={group === g.key ? 'is-active' : ''} onClick={() => setGroup(g.key)}>{g.label}</button>)}</div>
      </div>
      <ResourceState state={state} error={error} empty={<EmptyState icon="sections" title="Sin secciones" />}>
        <>
          <div className="jc-listhead" style={{ gridTemplateColumns: COLS }}><span></span><span>Sección</span><span>Tipo</span><span>Canal</span><span>Estado</span><span></span></div>
          <div className="jc-rows">
            {rows.map((s) => (
              <div key={s.id} className={`jc-row ${rowMod(STATUS_META[s.status].tone)}`} style={{ gridTemplateColumns: COLS }}>
                <span className="jc-thumb" style={{ width: 46, height: 34, background: groupColor[s.group] }} />
                <div><div className="jc-row__title">{s.internalName}</div><div className="jc-row__meta">Orden {s.order} · {s.updatedBy}</div></div>
                <Pill tone="default" soft>{s.type.replace(/_/g, ' ')}</Pill>
                <span>{CHANNEL_LABEL[s.channel]}</span>
                <StatusPill status={s.status} soft />
                <IconButton icon="edit" />
              </div>
            ))}
          </div>
        </>
      </ResourceState>
    </div>
  )
}
