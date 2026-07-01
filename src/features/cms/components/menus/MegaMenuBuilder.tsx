'use client'

import { useState } from 'react'
import { Button, CmsIcon, PageHeader, Pill, SectionHeader } from '@/features/cms/components/ui'
import type { CmsDevice } from '@/features/cms/types'
import { DEVICE_LABEL } from '@/features/cms/constants'

interface Col { id: string; title: string; items: { label: string; badge?: string }[] }
const INITIAL: Col[] = [
  { id: 'c1', title: 'Materiales', items: [{ label: 'Cemento' }, { label: 'Fierro' }, { label: 'Áridos' }, { label: 'Tableros', badge: 'Nuevo' }] },
  { id: 'c2', title: 'Herramientas', items: [{ label: 'Taladros' }, { label: 'Esmeriles' }, { label: 'Sierras' }, { label: 'Manuales' }] },
  { id: 'c3', title: 'Pinturas', items: [{ label: 'Látex' }, { label: 'Esmaltes' }, { label: 'Barnices' }, { label: 'Accesorios' }] },
  { id: 'c4', title: 'Empresas', items: [{ label: 'Cotización' }, { label: 'Crédito' }, { label: 'Convenios', badge: 'B2B' }] },
]

export function MegaMenuBuilder() {
  const [cols, setCols] = useState<Col[]>(INITIAL)
  const [device, setDevice] = useState<CmsDevice>('desktop')
  const addItem = (cid: string) => setCols((p) => p.map((c) => (c.id === cid ? { ...c, items: [...c.items, { label: 'Nuevo ítem' }] } : c)))
  const delItem = (cid: string, i: number) => setCols((p) => p.map((c) => (c.id === cid ? { ...c, items: c.items.filter((_, idx) => idx !== i) } : c)))

  return (
    <div>
      <PageHeader
        eyebrow="Navegación"
        title="Mega Menu Builder"
        subtitle="Mega menú con columnas, subniveles, íconos, imágenes y badges. Orden drag & drop y validación de links rotos."
        actions={
          <>
            <div className="jc-seg jc-seg--sm">{(['desktop', 'mobile'] as CmsDevice[]).map((d) => <button key={d} className={device === d ? 'is-active' : ''} onClick={() => setDevice(d)}>{DEVICE_LABEL[d]}</button>)}</div>
            <Button variant="green" icon="save">Guardar</Button>
          </>
        }
      />
      <div className="jc-grid-2">
        <div>
          <SectionHeader icon="mega" label="Columnas y links" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cols.map((c) => (
              <div className="jc-card jc-card--pad" key={c.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <CmsIcon name="drag" />
                  <input className="jc-input" defaultValue={c.title} style={{ fontWeight: 700 }} />
                </div>
                {c.items.map((it, i) => (
                  <div key={i} className="jc-menuitem">
                    <CmsIcon name="drag" />
                    <span style={{ flex: 1 }}>{it.label}</span>
                    {it.badge && <Pill tone="brand" soft>{it.badge}</Pill>}
                    <button className="jc-iconbtn" style={{ width: 28, height: 28 }} onClick={() => delItem(c.id, i)}><CmsIcon name="trash" /></button>
                  </div>
                ))}
                <Button variant="ghost" icon="plus" size="sm" onClick={() => addItem(c.id)}>Agregar link</Button>
              </div>
            ))}
          </div>
        </div>
        <aside>
          <SectionHeader icon="eye" label={`Preview · ${DEVICE_LABEL[device]}`} />
          <div className={`jc-megaprev ${device === 'mobile' ? 'is-mobile' : ''}`}>
            <div className="jc-megaprev__bar">Categorías <CmsIcon name="chevron" /></div>
            <div className="jc-megaprev__panel">
              {cols.map((c) => (
                <div key={c.id} className="jc-megaprev__col">
                  <strong>{c.title}</strong>
                  {c.items.map((it, i) => <span key={i}>{it.label}{it.badge ? ' •' : ''}</span>)}
                </div>
              ))}
            </div>
          </div>
          <p className="jc-help" style={{ marginTop: 10 }}><Pill tone="success" soft>0 links rotos</Pill> validado contra catálogo y landings.</p>
        </aside>
      </div>
    </div>
  )
}
