'use client'

import type { Tone } from '@/features/cms/constants'
import { CmsIcon, PageHeader, Pill } from '@/features/cms/components/ui'

interface Issue { id: string; sev: 'error' | 'warning' | 'info'; title: string; detail: string; where: string }

const ISSUES: Issue[] = [
  { id: 'p1', sev: 'error', title: '3 imágenes superan 400 KB', detail: 'hero-invierno.jpg (412 KB), empresas-obra.png (654 KB), banner-antiguo-cyber.jpg (720 KB).', where: 'Media' },
  { id: 'p2', sev: 'warning', title: '2 secciones sin versión mobile', detail: 'Hero B2B y Beneficios no tienen configuración mobile.', where: 'Home B2B' },
  { id: 'p3', sev: 'warning', title: 'Banners sin WebP', detail: '5 banners usan JPG/PNG; se recomienda convertir a WebP.', where: 'Banners' },
  { id: 'p4', sev: 'warning', title: 'Landing con exceso de productos', detail: 'Cyber Mimbral tiene 3 carruseles + grilla de 48 productos.', where: 'Landing · Cyber' },
  { id: 'p5', sev: 'error', title: '4 links rotos', detail: 'Footer (2), Mega menú (1), Menú principal (1).', where: 'Navegación' },
  { id: 'p6', sev: 'info', title: 'Contenido duplicado', detail: 'Bloque “Beneficios” repetido en Home y Landing baño.', where: 'Contenido' },
]

const sevTone: Record<string, Tone> = { error: 'danger', warning: 'warning', info: 'info' }
const rowMod: Record<string, string> = { error: 'jc-row--danger', warning: 'jc-row--warning', info: 'jc-row--brand' }

export function PerformanceContentMonitor() {
  const score = 78
  return (
    <div>
      <PageHeader eyebrow="Gobierno" title="Performance Content Monitor" subtitle="Alertas de contenido: imágenes pesadas, exceso de secciones/carruseles, sin WebP, sin versión mobile y links rotos." />
      <div className="jc-kpis" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 18 }}>
        <div className="jc-kpi"><span className="jc-kpi__ic jc-kpi__ic--info"><CmsIcon name="performance" /></span><div><div className="jc-kpi__value">{score}<span style={{ fontSize: '0.9rem' }}>/100</span></div><div className="jc-kpi__label">Score de contenido</div></div></div>
        <div className="jc-kpi"><span className="jc-kpi__ic jc-kpi__ic--danger"><CmsIcon name="warning" /></span><div><div className="jc-kpi__value">{ISSUES.filter((i) => i.sev === 'error').length}</div><div className="jc-kpi__label">Críticos</div></div></div>
        <div className="jc-kpi"><span className="jc-kpi__ic jc-kpi__ic--warning"><CmsIcon name="clock" /></span><div><div className="jc-kpi__value">{ISSUES.filter((i) => i.sev === 'warning').length}</div><div className="jc-kpi__label">Advertencias</div></div></div>
        <div className="jc-kpi"><span className="jc-kpi__ic jc-kpi__ic--success"><CmsIcon name="check" /></span><div><div className="jc-kpi__value">92%</div><div className="jc-kpi__label">Cobertura mobile</div></div></div>
      </div>
      <div className="jc-rows">
        {ISSUES.map((i) => (
          <div key={i.id} className={`jc-row ${rowMod[i.sev]}`} style={{ gridTemplateColumns: '1fr auto' }}>
            <div><div className="jc-row__title">{i.title}</div><div className="jc-row__meta">{i.detail}</div></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span className="jc-alert__mod">{i.where}</span><Pill tone={sevTone[i.sev]} soft>{i.sev === 'error' ? 'Crítico' : i.sev === 'warning' ? 'Advertencia' : 'Info'}</Pill></div>
          </div>
        ))}
      </div>
    </div>
  )
}
