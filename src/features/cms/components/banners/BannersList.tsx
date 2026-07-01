'use client'

import { useMemo, useState } from 'react'
import Link from '@/features/cms/compat/next-link'
import { useCmsResource } from '@/features/cms/hooks/useCmsResource'
import { cmsBannersApi } from '@/features/cms/services/cms-banners.api'
import { CHANNEL_LABEL, CMS_BASE, STATUS_META, type Tone } from '@/features/cms/constants'
import type { CmsBanner, CmsStatus } from '@/features/cms/types'
import { FilterBar, type FilterDef } from '@/features/cms/components/common/FilterBar'
import {
  Button,
  EmptyState,
  IconButton,
  PageHeader,
  Pagination,
  Pill,
  ResourceState,
  StatusPill,
} from '@/features/cms/components/ui'

const COLS = '64px minmax(200px, 1.7fr) 1.1fr 0.8fr 1fr 1fr 44px'
const STATUS_LIST: CmsStatus[] = ['published', 'scheduled', 'in_review', 'draft', 'error', 'inactive']
const rowMod = (tone: Tone) => (tone === 'success' ? '' : tone === 'info' ? 'jc-row--brand' : `jc-row--${tone}`)

export function BannersList() {
  const { state, data, error } = useCmsResource(() => cmsBannersApi.list(), [])
  const [values, setValues] = useState<Record<string, string>>({ q: '', status: 'all', channel: 'all' })
  const setV = (key: string, value: string) => setValues((s) => ({ ...s, [key]: value }))

  const banners = data ?? []
  const rows = useMemo(
    () =>
      banners.filter((b) => {
        if (values.status !== 'all' && b.status !== values.status) return false
        if (values.channel !== 'all' && b.channel !== values.channel) return false
        const q = (values.q ?? '').toLowerCase()
        if (q && !b.internalName.toLowerCase().includes(q) && !b.title.toLowerCase().includes(q)) return false
        return true
      }),
    [banners, values],
  )

  const fields: FilterDef[] = [
    { key: 'q', label: 'Banner', type: 'text', placeholder: 'Buscar por nombre…' },
    { key: 'status', label: 'Estado', type: 'select', options: [{ value: 'all', label: 'Todos' }, ...STATUS_LIST.map((s) => ({ value: s, label: STATUS_META[s].label }))] },
    { key: 'channel', label: 'Canal', type: 'select', options: [{ value: 'all', label: 'Todos' }, { value: 'b2c', label: 'B2C' }, { value: 'b2b', label: 'B2B' }, { value: 'both', label: 'B2C + B2B' }] },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Contenido"
        title="Banners"
        subtitle="Banners inteligentes por canal, segmento, dispositivo y fecha, con prioridad, A/B y validaciones."
        actions={
          <>
            <Button variant="blue" icon="export">Exportar</Button>
            <Link href={`${CMS_BASE}/banners/nuevo`}><Button variant="green" icon="plus">Nuevo banner</Button></Link>
          </>
        }
      />

      <FilterBar fields={fields} values={values} onChange={setV} dateRange />

      <ResourceState
        state={state}
        error={error}
        empty={<EmptyState icon="banner" title="No hay banners" description="Crea el primer banner para la vitrina." action={<Link href={`${CMS_BASE}/banners/nuevo`}><Button variant="green" icon="plus">Nuevo banner</Button></Link>} />}
      >
        {rows.length === 0 ? (
          <EmptyState icon="banner" title="Sin resultados" description="Ningún banner coincide con los filtros aplicados." />
        ) : (
          <>
            <div className="jc-listhead" style={{ gridTemplateColumns: COLS }}>
              <span></span><span>Banner</span><span>Ubicación</span><span>Canal</span><span>Rendimiento</span><span>Estado</span><span></span>
            </div>
            <div className="jc-rows">
              {rows.map((b) => <BannerRow key={b.id} banner={b} />)}
            </div>
            <Pagination total={rows.length} perPage={60} page={1} />
          </>
        )}
      </ResourceState>
    </div>
  )
}

function BannerRow({ banner: b }: { banner: CmsBanner }) {
  const tone = STATUS_META[b.status].tone
  const ctr = b.impressions ? ((b.clicks / b.impressions) * 100).toFixed(2) : '—'
  return (
    <div className={`jc-row ${rowMod(tone)}`} style={{ gridTemplateColumns: COLS }}>
      <span className="jc-thumb" style={{ width: 56, height: 34, background: b.imageDesktop }} aria-hidden />
      <div>
        <div className="jc-row__title"><Link href={`${CMS_BASE}/banners/${b.id}`}>{b.internalName}</Link></div>
        <div className="jc-row__meta">{b.startAt ? `${b.startAt} → ${b.endAt}` : 'Sin programar'}{b.abVariant ? ' · A/B' : ''}{b.promotionId ? ` · ${b.promotionId}` : ''}</div>
      </div>
      <span>{b.placement}</span>
      <Pill tone="default" soft>{CHANNEL_LABEL[b.channel]}</Pill>
      <div>
        <div style={{ fontWeight: 700 }}>{b.impressions.toLocaleString('es-CL')}</div>
        <div className="jc-row__meta">CTR {ctr === '—' ? '—' : `${ctr}%`}</div>
      </div>
      <StatusPill status={b.status} soft />
      <Link href={`${CMS_BASE}/banners/${b.id}`}><IconButton icon="edit" aria-label="Editar" /></Link>
    </div>
  )
}
