'use client'

import { useState } from 'react'
import { segments } from '@/features/cms/mocks'
import { CHANNEL_LABEL, DEVICE_LABEL } from '@/features/cms/constants'
import type { CmsChannel, CmsDevice } from '@/features/cms/types'
import { Button, Field, PageHeader, SectionHeader } from '@/features/cms/components/ui'

export function PreviewCenter() {
  const [device, setDevice] = useState<CmsDevice>('desktop')
  const [channel, setChannel] = useState<CmsChannel>('b2c')
  const [segment, setSegment] = useState('sg-1')
  const [date, setDate] = useState('')

  return (
    <div>
      <PageHeader eyebrow="Publicación" title="Preview Center" subtitle="Simula la web como la verá un cliente específico: dispositivo, canal, segmento, sucursal, lista de precio y fecha futura." actions={<Button variant="blue" icon="external">Abrir en pestaña</Button>} />
      <div className="jc-grid-2">
        <aside className="jc-panel">
          <SectionHeader icon="preview" label="Contexto de simulación" />
          <Field label="Dispositivo">
            <div className="jc-seg jc-seg--sm">{(['desktop', 'tablet', 'mobile'] as CmsDevice[]).map((d) => <button key={d} className={device === d ? 'is-active' : ''} onClick={() => setDevice(d)}>{DEVICE_LABEL[d]}</button>)}</div>
          </Field>
          <Field label="Canal">
            <div className="jc-seg jc-seg--sm">{(['b2c', 'b2b'] as CmsChannel[]).map((c) => <button key={c} className={channel === c ? 'is-active' : ''} onClick={() => setChannel(c)}>{CHANNEL_LABEL[c]}</button>)}</div>
          </Field>
          <Field label="Segmento">
            <select className="jc-select" value={segment} onChange={(e) => setSegment(e.target.value)}>{segments.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
          </Field>
          <Field label="Lista de precio"><select className="jc-select"><option>Mayorista A</option><option>Mayorista B</option><option>Público</option></select></Field>
          <Field label="Sucursal"><select className="jc-select"><option>Todas</option><option>Balmaceda San Javier</option><option>Chorrillos</option></select></Field>
          <Field label="Fecha futura"><input className="jc-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} /></Field>
          <Button variant="green" icon="refresh" className="jc-btn--block" style={{ marginTop: 10 }}>Actualizar preview</Button>
        </aside>

        <div>
          <SectionHeader icon="eye" label={`Preview · ${DEVICE_LABEL[device]} · ${CHANNEL_LABEL[channel]}`} />
          <div className={`jc-preview jc-preview--${device}`} style={{ margin: '0 auto' }}>
            <div className="jc-preview__bar"><span /><span /><span /></div>
            <div className="jc-preview__scroll">
              {['Hero ' + CHANNEL_LABEL[channel], 'Beneficios', channel === 'b2b' ? 'Recompra B2B' : 'Más vendidos', 'Marcas', 'Servicios'].map((b, i) => (
                <div key={i} className="jc-pblock" style={{ background: i % 2 ? 'linear-gradient(120deg,#0f6347,#2ecc71)' : 'linear-gradient(120deg,#1f4aa8,#2979ff)' }}><span className="jc-pblock__t">{b}</span></div>
              ))}
            </div>
          </div>
          <p className="jc-help" style={{ marginTop: 10, textAlign: 'center' }}>Simulando {segments.find((s) => s.id === segment)?.name}{date ? ` · al ${date}` : ''}.</p>
        </div>
      </div>
    </div>
  )
}
