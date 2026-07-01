'use client'

import { useState } from 'react'
import { CHANNEL_LABEL } from '@/features/cms/constants'
import type { CmsChannel } from '@/features/cms/types'
import { Button, CmsIcon, PageHeader, Pill, SectionHeader } from '@/features/cms/components/ui'

interface Col { id: string; title: string; links: { label: string; valid: boolean }[] }
const COLS_B2C: Col[] = [
  { id: 'c1', title: 'Servicio al cliente', links: [{ label: 'Centro de ayuda', valid: true }, { label: 'Cambios y devoluciones', valid: true }, { label: 'Seguimiento', valid: false }] },
  { id: 'c2', title: 'Comprar', links: [{ label: 'Categorías', valid: true }, { label: 'Ofertas', valid: true }, { label: 'Gift cards', valid: true }] },
  { id: 'c3', title: 'Mimbral', links: [{ label: 'Nosotros', valid: true }, { label: 'Trabaja con nosotros', valid: true }, { label: 'Contacto', valid: true }] },
]

export function FooterBuilder() {
  const [channel, setChannel] = useState<CmsChannel>('b2c')
  const [cols, setCols] = useState<Col[]>(COLS_B2C)
  const broken = cols.flatMap((c) => c.links).filter((l) => !l.valid).length
  const empties = cols.filter((c) => c.links.length === 0).length

  return (
    <div>
      <PageHeader
        eyebrow="Navegación"
        title="Footer Builder"
        subtitle="Footer B2C/B2B/mobile con columnas, legales, sucursales, redes, WhatsApp, medios de pago, newsletter y validaciones."
        actions={
          <>
            <div className="jc-seg jc-seg--sm">{(['b2c', 'b2b'] as CmsChannel[]).map((c) => <button key={c} className={channel === c ? 'is-active' : ''} onClick={() => setChannel(c)}>{CHANNEL_LABEL[c]}</button>)}</div>
            <Button variant="green" icon="save">Guardar</Button>
          </>
        }
      />

      {(broken > 0 || empties > 0) && (
        <div className="jc-errbox" style={{ marginBottom: 16 }}>
          <CmsIcon name="warning" /> Validaciones: {broken > 0 && <><strong>{broken} link(s) roto(s)</strong></>}{broken > 0 && empties > 0 && ' · '}{empties > 0 && <><strong>{empties} columna(s) vacía(s)</strong></>}.
        </div>
      )}

      <SectionHeader icon="footer" label={`Columnas · Footer ${CHANNEL_LABEL[channel]}`} />
      <div className="jc-footcols">
        {cols.map((c) => (
          <div className="jc-card jc-card--pad" key={c.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}><CmsIcon name="drag" /><input className="jc-input" defaultValue={c.title} style={{ fontWeight: 700 }} /></div>
            {c.links.map((l, i) => (
              <div key={i} className="jc-menuitem">
                <span style={{ flex: 1 }}>{l.label}</span>
                {l.valid ? <Pill tone="success" soft>OK</Pill> : <Pill tone="danger" soft>Roto</Pill>}
                <button className="jc-iconbtn" style={{ width: 28, height: 28 }} onClick={() => setCols((p) => p.map((x) => (x.id === c.id ? { ...x, links: x.links.filter((_, idx) => idx !== i) } : x)))}><CmsIcon name="trash" /></button>
              </div>
            ))}
            <Button variant="ghost" icon="plus" size="sm" onClick={() => setCols((p) => p.map((x) => (x.id === c.id ? { ...x, links: [...x.links, { label: 'Nuevo link', valid: true }] } : x)))}>Agregar link</Button>
          </div>
        ))}
      </div>

      <SectionHeader icon="settings" label="Bloques del footer" />
      <div className="jc-footblocks">
        {['Redes sociales', 'WhatsApp', 'Medios de pago', 'Newsletter', 'Bloques de confianza', 'Legales'].map((b) => (
          <label key={b} className="jc-switchrow"><input type="checkbox" defaultChecked /> {b}</label>
        ))}
      </div>
    </div>
  )
}
