'use client'

import Link from '@/features/cms/compat/next-link'
import { useCmsResource } from '@/features/cms/hooks/useCmsResource'
import { cmsDashboardApi } from '@/features/cms/services/cms-dashboard.api'
import { CMS_BASE } from '@/features/cms/constants'
import {
  Avatar,
  Button,
  CmsIcon,
  KpiCard,
  PageHeader,
  Pill,
  ResourceState,
  SectionHeader,
  StatusPill,
} from '@/features/cms/components/ui'
import type { CmsIconName } from '@/features/cms/components/ui'

const alertIcon: Record<string, CmsIconName> = { critical: 'warning', warning: 'clock', info: 'bell' }

export function AdvancedCmsDashboard() {
  const { state, data, error } = useCmsResource(() => cmsDashboardApi.getOverview(), [])

  return (
    <div>
      <PageHeader
        eyebrow="Comercial Web · CMS"
        title="Dashboard ejecutivo"
        subtitle="Estado del contenido publicado, programado, pendiente de aprobación y alertas de la vitrina web B2C/B2B."
        actions={
          <>
            <Button variant="ghost" icon="refresh">Actualizar</Button>
            <Link href={`${CMS_BASE}/banners/nuevo`}><Button variant="green" icon="plus">Nuevo contenido</Button></Link>
          </>
        }
      />

      <ResourceState state={state} error={error} empty={<div className="jc-empty">Sin datos</div>}
        skeleton={<div className="jc-kpis" style={{ marginTop: 18 }}>{Array.from({ length: 4 }).map((_, i) => <div className="jc-skel" key={i} style={{ height: 92 }} />)}</div>}
      >
        {data && (
          <>
            <SectionHeader icon="dashboard" label="Indicadores" />
            <div className="jc-kpis">
              {data.kpis.map((k) => (
                <KpiCard key={k.key} icon={k.icon as CmsIconName} tone={k.tone} value={k.value} label={k.label} hint={k.hint} />
              ))}
            </div>

            <SectionHeader icon="warning" label="Alertas críticas" />
            <div className="jc-rows">
              {data.alerts.map((a) => (
                <Link key={a.id} href={a.href} className={`jc-alert jc-alert--${a.severity}`}>
                  <span className="jc-alert__ic"><CmsIcon name={alertIcon[a.severity]} /></span>
                  <div style={{ flex: 1 }}>
                    <strong>{a.title}</strong>
                    <span>{a.detail}</span>
                  </div>
                  <span className="jc-alert__mod">{a.module}</span>
                </Link>
              ))}
            </div>

            <div className="jc-grid-2" style={{ marginTop: 26 }}>
              <div className="jc-card jc-card--pad">
                <div className="jc-cardhead">
                  <h2>Pendiente de aprobación</h2>
                  <Link href={`${CMS_BASE}/approvals`} className="jc-link">Ver aprobaciones</Link>
                </div>
                <div className="jc-rows">
                  {data.pending.map((p) => (
                    <div className="jc-row" key={p.id} style={{ gridTemplateColumns: '1fr auto', borderLeftColor: 'var(--jc-orange)' }}>
                      <div>
                        <div className="jc-row__title">{p.entityType} · {p.entityName}</div>
                        <div className="jc-row__meta">{p.requestedBy}{p.dueDate ? ` · vence ${p.dueDate}` : ''} · {p.comments} comentarios</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Pill tone="brand" soft>{p.channel.toUpperCase()}</Pill>
                        <StatusPill status={p.status} soft />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="jc-card jc-card--pad">
                <div className="jc-cardhead">
                  <h2>Actividad reciente</h2>
                  <Link href={`${CMS_BASE}/audit`} className="jc-link">Ver auditoría</Link>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {data.activity.map((a) => (
                    <div key={a.id} className="jc-userin">
                      <Avatar name={a.user} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.88rem' }}><strong>{a.user}</strong> {a.action}</div>
                        <small className="jc-muted">{a.entity} · {a.at}</small>
                      </div>
                      <StatusPill status={a.status} soft />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </ResourceState>
    </div>
  )
}
