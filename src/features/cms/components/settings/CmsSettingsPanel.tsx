'use client'

import { Button, CmsIcon, Field, PageHeader, Pill, SectionHeader } from '@/features/cms/components/ui'

export function CmsSettingsPanel() {
  return (
    <div>
      <PageHeader eyebrow="Gobierno" title="Configuración CMS" subtitle="Formatos, tamaños por banner, estados, canales, segmentos, flujo de aprobación, límites de peso y plantillas." actions={<Button variant="green" icon="save">Guardar</Button>} />
      <div className="jc-grid-2">
        <div className="jc-panel">
          <SectionHeader icon="settings" label="General" />
          <Field label="Cliente"><input className="jc-input" defaultValue="Mimbral SpA" /></Field>
          <Field label="Entorno"><select className="jc-select" defaultValue="prod"><option value="prod">Producción</option><option value="qa">QA</option><option value="dev">Desarrollo</option></select></Field>
          <Field label="Canales habilitados"><div className="jc-chips"><span className="jc-chip">B2C</span><span className="jc-chip">B2B</span></div></Field>

          <SectionHeader icon="media" label="Medios" />
          <Field label="Formatos permitidos"><div className="jc-chips"><span className="jc-chip">JPG</span><span className="jc-chip">PNG</span><span className="jc-chip">WEBP</span><span className="jc-chip">SVG</span></div></Field>
          <Field label="Peso máximo"><select className="jc-select" defaultValue="2"><option value="2">2 MB</option><option value="5">5 MB</option></select></Field>
          <Field label="Conversión a WebP"><label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}><input type="checkbox" defaultChecked /> Sugerir automáticamente</label></Field>

          <SectionHeader icon="approval" label="Publicación" />
          <Field label="Aprobación"><label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}><input type="checkbox" defaultChecked /> Requerir aprobación antes de publicar</label></Field>
          <Field label="Auditoría"><label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}><input type="checkbox" defaultChecked /> Registrar historial de cambios</label></Field>
          <Field label="Programación"><label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}><input type="checkbox" defaultChecked /> Publicar automáticamente al cumplirse la fecha</label></Field>
        </div>
        <aside className="jc-panel">
          <SectionHeader icon="dashboard" label="Servicio" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.86rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="jc-muted">Servicio</span><strong>cms-service</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="jc-muted">Versión</span><strong>v3.12.0</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="jc-muted">Estado</span><Pill tone="success" soft>Operativo</Pill></div>
          </div>
          <SectionHeader icon="rules" label="Plantillas" />
          <p className="jc-help"><CmsIcon name="sections" /> Plantillas de landing y de secciones configurables (Landing SEO, Landing campaña, Home por sucursal…).</p>
        </aside>
      </div>
    </div>
  )
}
