'use client'

import { useCmsResource } from '@/features/cms/hooks/useCmsResource'
import { simulateRequest } from '@/features/cms/services/simulate'
import { menus } from '@/features/cms/mocks'
import { CHANNEL_LABEL, STATUS_META, type Tone } from '@/features/cms/constants'
import { Button, CmsIcon, EmptyState, IconButton, PageHeader, Pill, ResourceState, StatusPill } from '@/features/cms/components/ui'

const COLS = 'minmax(200px,1.8fr) 0.9fr 0.8fr 0.9fr 0.9fr 44px'
const LOC: Record<string, string> = { header: 'Header', footer: 'Footer', mega: 'Mega menú', mobile: 'Mobile' }
const rowMod = (t: Tone) => (t === 'success' ? '' : t === 'info' ? 'jc-row--brand' : `jc-row--${t}`)

export function MenuBuilder() {
  const { state, data, error } = useCmsResource(() => simulateRequest(menus), [])
  return (
    <div>
      <PageHeader eyebrow="Navegación" title="Menús" subtitle="Menús header/mobile/B2B/por sucursal con subniveles, íconos, links a categorías/landings y validación de links." actions={<Button variant="green" icon="plus">Nuevo menú</Button>} />
      <ResourceState state={state} error={error} empty={<EmptyState icon="menu" title="Sin menús" />}>
        <>
          <div className="jc-listhead" style={{ gridTemplateColumns: COLS }}><span>Menú</span><span>Ubicación</span><span>Canal</span><span>Ítems</span><span>Estado</span><span></span></div>
          <div className="jc-rows">
            {(data ?? []).map((m) => (
              <div key={m.id} className={`jc-row ${m.brokenLinks > 0 ? 'jc-row--warning' : rowMod(STATUS_META[m.status].tone)}`} style={{ gridTemplateColumns: COLS }}>
                <div><div className="jc-row__title">{m.name}</div>{m.brokenLinks > 0 && <div className="jc-row__meta"><CmsIcon name="warning" /> {m.brokenLinks} link(s) roto(s)</div>}</div>
                <Pill tone="default" soft>{LOC[m.location]}</Pill>
                <span>{CHANNEL_LABEL[m.channel]}</span>
                <span style={{ fontWeight: 700 }}>{m.itemCount}</span>
                <StatusPill status={m.status} soft />
                <IconButton icon="edit" />
              </div>
            ))}
          </div>
        </>
      </ResourceState>
    </div>
  )
}
