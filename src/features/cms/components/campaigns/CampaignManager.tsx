'use client'

import { useMemo, useState } from 'react'
import Link from '@/features/cms/compat/next-link'
import { useCmsResource } from '@/features/cms/hooks/useCmsResource'
import { simulateRequest } from '@/features/cms/services/simulate'
import { campaigns } from '@/features/cms/mocks'
import { CHANNEL_LABEL, CMS_BASE, STATUS_META, type Tone } from '@/features/cms/constants'
import type { CmsCampaign } from '@/features/cms/types'
import { FilterBar, type FilterDef } from '@/features/cms/components/common/FilterBar'
import { Button, EmptyState, IconButton, PageHeader, Pill, ResourceState, StatusPill } from '@/features/cms/components/ui'

const COLS = 'minmax(200px, 1.6fr) 0.8fr 1.2fr 1.1fr 0.9fr 44px'
const STATUS_LIST: (keyof typeof STATUS_META)[] = ['published', 'scheduled', 'in_review', 'draft']
const rowMod = (t: Tone) => (t === 'success' ? '' : t === 'info' ? 'jc-row--brand' : `jc-row--${t}`)
const totalPieces = (c: CmsCampaign) => Object.values(c.pieces).reduce((s, n) => s + n, 0)

export function CampaignManager() {
  const { state, data, error } = useCmsResource(() => simulateRequest(campaigns), [])
  const [values, setValues] = useState<Record<string, string>>({ q: '', status: 'all', channel: 'all' })
  const setV = (key: string, value: string) => setValues((s) => ({ ...s, [key]: value }))

  const rows = useMemo(
    () =>
      (data ?? []).filter((c) => {
        if (values.status !== 'all' && c.status !== values.status) return false
        if (values.channel !== 'all' && c.channel !== values.channel) return false
        return !values.q || c.name.toLowerCase().includes(values.q.toLowerCase())
      }),
    [data, values],
  )

  const fields: FilterDef[] = [
    { key: 'q', label: 'Campaña', type: 'text', placeholder: 'Buscar campaña…' },
    { key: 'status', label: 'Estado', type: 'select', options: [{ value: 'all', label: 'Todas' }, ...STATUS_LIST.map((s) => ({ value: s, label: STATUS_META[s].label }))] },
    { key: 'channel', label: 'Canal', type: 'select', options: [{ value: 'all', label: 'Todos' }, { value: 'b2c', label: 'B2C' }, { value: 'b2b', label: 'B2B' }, { value: 'both', label: 'B2C + B2B' }] },
  ]

  return (
    <div>
      <PageHeader
        eyebrow="Marketing & SEO"
        title="Campañas"
        subtitle="Gestiona campañas completas (banners, landings, carruseles, bloques, SEO, FAQ) con fechas, responsables y aprobación del paquete."
        actions={
          <>
            <Link href={`${CMS_BASE}/campaigns/calendar`}><Button variant="ghost" icon="calendar">Calendario</Button></Link>
            <Button variant="green" icon="plus">Nueva campaña</Button>
          </>
        }
      />
      <FilterBar fields={fields} values={values} onChange={setV} dateRange />
      <ResourceState state={state} error={error} empty={<EmptyState icon="campaign" title="Sin campañas" />}>
        <>
          <div className="jc-listhead" style={{ gridTemplateColumns: COLS }}><span>Campaña</span><span>Canal</span><span>Vigencia</span><span>Piezas</span><span>Estado</span><span></span></div>
          <div className="jc-rows">
            {rows.map((c) => (
              <div key={c.id} className={`jc-row ${rowMod(STATUS_META[c.status].tone)}`} style={{ gridTemplateColumns: COLS }}>
                <div>
                  <div className="jc-row__title"><Link href={`${CMS_BASE}/campaigns/${c.id}`}>{c.name}</Link></div>
                  <div className="jc-row__meta">{c.owner} · aprueba {c.approver}{c.conflicts > 0 ? ` · ${c.conflicts} conflicto(s)` : ''}</div>
                </div>
                <span>{CHANNEL_LABEL[c.channel]}</span>
                <span className="jc-mono" style={{ fontSize: '0.8rem' }}>{c.startAt} → {c.endAt}</span>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  <Pill tone="default" soft>{totalPieces(c)} piezas</Pill>
                  {c.promotionId && <Pill tone="info" soft>Promo</Pill>}
                  {c.conflicts > 0 && <Pill tone="warning" soft>Conflicto</Pill>}
                </div>
                <StatusPill status={c.status} soft />
                <Link href={`${CMS_BASE}/campaigns/${c.id}`}><IconButton icon="edit" /></Link>
              </div>
            ))}
          </div>
        </>
      </ResourceState>
    </div>
  )
}
