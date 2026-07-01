'use client'

import { useCmsResource } from '@/features/cms/hooks/useCmsResource'
import { simulateRequest } from '@/features/cms/services/simulate'
import { seoContents } from '@/features/cms/mocks'
import { STATUS_META, type Tone } from '@/features/cms/constants'
import type { SeoScope } from '@/features/cms/types'
import { Button, CmsIcon, EmptyState, IconButton, PageHeader, Pill, ResourceState, StatusPill } from '@/features/cms/components/ui'

const SCOPE_LABEL: Record<SeoScope, string> = { home: 'Home', category: 'Categoría', landing: 'Landing', info_page: 'Página' }
const COLS = 'minmax(200px,1.5fr) 1fr 1.4fr 0.9fr 44px'
const rowMod = (t: Tone) => (t === 'success' ? '' : t === 'info' ? 'jc-row--brand' : `jc-row--${t}`)

export function SeoContentHub() {
  const { state, data, error } = useCmsResource(() => simulateRequest(seoContents), [])
  const totalIssues = (data ?? []).reduce((s, x) => s + x.issues.length, 0)

  return (
    <div>
      <PageHeader eyebrow="Marketing & SEO" title="SEO Content Hub" subtitle="Metadatos editables de home, categorías, landings y páginas, con validaciones y vista SERP." actions={<Button variant="blue" icon="export">Exportar</Button>} />
      <div className="jc-kpis" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 18 }}>
        <div className="jc-kpi"><span className="jc-kpi__ic jc-kpi__ic--info"><CmsIcon name="seo" /></span><div><div className="jc-kpi__value">{(data ?? []).length}</div><div className="jc-kpi__label">Contenidos SEO</div></div></div>
        <div className="jc-kpi"><span className="jc-kpi__ic jc-kpi__ic--danger"><CmsIcon name="warning" /></span><div><div className="jc-kpi__value">{totalIssues}</div><div className="jc-kpi__label">Problemas detectados</div></div></div>
        <div className="jc-kpi"><span className="jc-kpi__ic jc-kpi__ic--success"><CmsIcon name="check" /></span><div><div className="jc-kpi__value">{(data ?? []).filter((x) => x.issues.length === 0).length}</div><div className="jc-kpi__label">Sin problemas</div></div></div>
      </div>
      <ResourceState state={state} error={error} empty={<EmptyState icon="seo" title="Sin contenido SEO" />}>
        <>
          <div className="jc-listhead" style={{ gridTemplateColumns: COLS }}><span>Página</span><span>Alcance</span><span>Validaciones</span><span>Estado</span><span></span></div>
          <div className="jc-rows">
            {(data ?? []).map((s) => (
              <div key={s.id} className={`jc-row ${rowMod(STATUS_META[s.status].tone)}`} style={{ gridTemplateColumns: COLS }}>
                <div><div className="jc-row__title">{s.target}</div><div className="jc-row__meta jc-mono">{s.slug}</div></div>
                <Pill tone="default" soft>{SCOPE_LABEL[s.scope]}</Pill>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {s.issues.length === 0 ? <Pill tone="success" soft>OK</Pill> : s.issues.map((i) => <Pill key={i.code} tone={i.severity === 'error' ? 'danger' : 'warning'} soft>{i.label}</Pill>)}
                </div>
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
