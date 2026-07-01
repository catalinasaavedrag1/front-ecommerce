'use client'

import { useMemo, useState } from 'react'
import Link from '@/features/cms/compat/next-link'
import { useCmsResource } from '@/features/cms/hooks/useCmsResource'
import { simulateRequest } from '@/features/cms/services/simulate'
import { landings } from '@/features/cms/mocks'
import { CHANNEL_LABEL, CMS_BASE, STATUS_META, type Tone } from '@/features/cms/constants'
import type { CmsLandingPage, CmsStatus, LandingType } from '@/features/cms/types'
import { FilterBar, type FilterDef } from '@/features/cms/components/common/FilterBar'
import { Button, EmptyState, IconButton, PageHeader, Pill, Pagination, ResourceState, StatusPill } from '@/features/cms/components/ui'

const COLS = 'minmax(220px, 1.8fr) 1.1fr 0.9fr 0.8fr 1fr 0.95fr 44px'
const TYPE_LABEL: Record<LandingType, string> = { campaign: 'Campaña', evergreen_seo: 'SEO', b2b: 'B2B', category: 'Categoría', project: 'Proyecto' }
const STATUS_LIST: CmsStatus[] = ['published', 'in_review', 'scheduled', 'draft', 'error']
const rowMod = (t: Tone) => (t === 'success' ? '' : t === 'info' ? 'jc-row--brand' : `jc-row--${t}`)

export function LandingPagesList() {
  const { state, data, error } = useCmsResource(() => simulateRequest(landings), [])
  const [values, setValues] = useState<Record<string, string>>({ q: '', status: 'all', type: 'all', channel: 'all' })
  const setV = (key: string, value: string) => setValues((s) => ({ ...s, [key]: value }))

  const rows = useMemo(
    () =>
      (data ?? []).filter((l) => {
        if (values.status !== 'all' && l.status !== values.status) return false
        if (values.type !== 'all' && l.type !== values.type) return false
        if (values.channel !== 'all' && l.channel !== values.channel) return false
        const q = (values.q ?? '').toLowerCase()
        if (q && !l.internalName.toLowerCase().includes(q) && !l.slug.includes(q)) return false
        return true
      }),
    [data, values],
  )

  const fields: FilterDef[] = [
    { key: 'q', label: 'Landing', type: 'text', placeholder: 'Buscar por nombre o slug…' },
    { key: 'status', label: 'Estado', type: 'select', options: [{ value: 'all', label: 'Todas' }, ...STATUS_LIST.map((s) => ({ value: s, label: STATUS_META[s].label }))] },
    { key: 'type', label: 'Tipo', type: 'select', options: [{ value: 'all', label: 'Todos' }, ...(Object.keys(TYPE_LABEL) as LandingType[]).map((t) => ({ value: t, label: TYPE_LABEL[t] }))] },
    { key: 'channel', label: 'Canal', type: 'select', options: [{ value: 'all', label: 'Todos' }, { value: 'b2c', label: 'B2C' }, { value: 'b2b', label: 'B2B' }, { value: 'both', label: 'B2C + B2B' }] },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Contenido"
        title="Landing Pages"
        subtitle="Landings por campaña, evergreen SEO, B2B, categoría o proyecto, con SEO completo, segmentación y versionado."
        actions={<Link href={`${CMS_BASE}/landing-pages/new/builder`}><Button variant="green" icon="plus">Nueva landing</Button></Link>}
      />

      <FilterBar fields={fields} values={values} onChange={setV} dateRange />

      <ResourceState state={state} error={error} empty={<EmptyState icon="landing" title="Sin landings" description="Crea tu primera landing." />}>
        {rows.length === 0 ? (
          <EmptyState icon="landing" title="Sin resultados" description="Ninguna landing coincide con los filtros." />
        ) : (
          <>
            <div className="jc-listhead" style={{ gridTemplateColumns: COLS }}>
              <span>Landing</span><span>URL</span><span>Tipo</span><span>Canal</span><span>Métricas</span><span>Estado</span><span></span>
            </div>
            <div className="jc-rows">
              {rows.map((l) => <LandingRow key={l.id} l={l} />)}
            </div>
            <Pagination total={rows.length} />
          </>
        )}
      </ResourceState>
    </div>
  )
}

function LandingRow({ l }: { l: CmsLandingPage }) {
  const tone = STATUS_META[l.status].tone
  return (
    <div className={`jc-row ${rowMod(tone)}`} style={{ gridTemplateColumns: COLS }}>
      <div>
        <div className="jc-row__title"><Link href={`${CMS_BASE}/landing-pages/${l.id}/builder`}>{l.internalName}</Link></div>
        <div className="jc-row__meta">{l.indexable ? 'Indexable' : 'No indexable'} · v{l.activeVersion} · {l.sections} secciones</div>
      </div>
      <span className="jc-mono">{l.slug}</span>
      <Pill tone="default" soft>{TYPE_LABEL[l.type]}</Pill>
      <span>{CHANNEL_LABEL[l.channel]}</span>
      <div>
        <div style={{ fontWeight: 700 }}>{l.views.toLocaleString('es-CL')} <span className="jc-muted" style={{ fontWeight: 400, fontSize: '0.78rem' }}>views</span></div>
        <div className="jc-row__meta">Conv. {l.conversion}%</div>
      </div>
      <StatusPill status={l.status} soft />
      <Link href={`${CMS_BASE}/landing-pages/${l.id}/builder`}><IconButton icon="edit" /></Link>
    </div>
  )
}
