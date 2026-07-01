'use client'

import { useRouter } from '@/features/cms/compat/next-navigation'
import { campaigns } from '@/features/cms/mocks'
import { CHANNEL_LABEL, CMS_BASE } from '@/features/cms/constants'
import type { CmsIconName } from '@/features/cms/components/ui'
import { Button, CmsIcon, EmptyState, PageHeader, Pill, SectionHeader } from '@/features/cms/components/ui'

const PIECE_META: { key: keyof typeof PIECE_ICON; label: string }[] = [
  { key: 'banners', label: 'Banners' }, { key: 'landings', label: 'Landings' }, { key: 'carousels', label: 'Carruseles' },
  { key: 'sections', label: 'Secciones' }, { key: 'faqs', label: 'FAQ' }, { key: 'seo', label: 'SEO' },
]
const PIECE_ICON = { banners: 'banner', landings: 'landing', carousels: 'carousel', sections: 'sections', faqs: 'faq', seo: 'seo' } as const

export function CampaignDetail({ campaignId }: { campaignId: string }) {
  const router = useRouter()
  const c = campaigns.find((x) => x.id === campaignId)
  if (!c) return <EmptyState icon="campaign" title="Campaña no encontrada" action={<Button variant="ghost" onClick={() => router.push(`${CMS_BASE}/campaigns`)}>Volver</Button>} />

  return (
    <div>
      <PageHeader
        eyebrow="Campaña"
        title={c.name}
        status={c.status}
        subtitle={`${c.startAt} → ${c.endAt} · ${CHANNEL_LABEL[c.channel]} · responsable ${c.owner} · aprueba ${c.approver}`}
        actions={
          <>
            <Button variant="ghost" icon="copy">Duplicar</Button>
            <Button variant="ghost" icon="calendar">Programar</Button>
            <Button variant="outline-green" icon="approval">Aprobar paquete</Button>
            <Button variant="blue" icon="published">Activar</Button>
          </>
        }
      />

      {c.conflicts > 0 && <div className="jc-errbox" style={{ marginBottom: 16 }}><CmsIcon name="warning" /> Esta campaña tiene <strong>{c.conflicts} conflicto(s)</strong> de espacio en home con otra campaña del mismo período.</div>}

      <SectionHeader icon="dashboard" label="Piezas de la campaña" />
      <div className="jc-kpis" style={{ gridTemplateColumns: 'repeat(6,1fr)' }}>
        {PIECE_META.map((p) => (
          <div className="jc-kpi" key={p.key}>
            <span className="jc-kpi__ic jc-kpi__ic--info"><CmsIcon name={PIECE_ICON[p.key] as CmsIconName} /></span>
            <div><div className="jc-kpi__value">{c.pieces[p.key]}</div><div className="jc-kpi__label">{p.label}</div></div>
          </div>
        ))}
      </div>

      <div className="jc-grid-2" style={{ marginTop: 22 }}>
        <div className="jc-card jc-card--pad">
          <SectionHeader icon="rules" label="Segmentación y fechas" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="jc-muted">Canal</span><strong>{CHANNEL_LABEL[c.channel]}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="jc-muted">Vigencia</span><strong>{c.startAt} → {c.endAt}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="jc-muted">Segmentos</span><strong>Público, B2B con crédito</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="jc-muted">Promoción</span>{c.promotionId ? <Pill tone="info" soft>{c.promotionId}</Pill> : <span className="jc-muted">—</span>}</div>
          </div>
        </div>
        <div className="jc-card jc-card--pad">
          <SectionHeader icon="approval" label="Aprobación del paquete" />
          <p className="jc-help">Aprueba todas las piezas de la campaña en un solo paso. Cada pieza mantiene su propio historial y versionado.</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <Button variant="outline-green" icon="approval">Aprobar todo</Button>
            <Button variant="ghost" icon="eye">Previsualizar campaña</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
