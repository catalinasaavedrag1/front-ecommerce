'use client'

import { useMemo, useState } from 'react'
import { sections as seed } from '@/features/cms/mocks'
import { CHANNEL_LABEL, DEVICE_LABEL, STATUS_META } from '@/features/cms/constants'
import type { CmsChannel, CmsDevice, CmsSection, SectionGroup, SectionType } from '@/features/cms/types'
import { Button, CmsIcon, Field, PageHeader, Pill, SectionHeader, StatusPill } from '@/features/cms/components/ui'

const PALETTE: { type: SectionType; group: SectionGroup; label: string }[] = [
  { type: 'hero_banner', group: 'banners', label: 'Hero banner' },
  { type: 'banner_double', group: 'banners', label: 'Banner doble' },
  { type: 'carousel_dynamic', group: 'products', label: 'Carrusel dinámico' },
  { type: 'products_bestsellers', group: 'products', label: 'Más vendidos' },
  { type: 'products_b2b', group: 'products', label: 'Productos B2B' },
  { type: 'benefits', group: 'content', label: 'Beneficios' },
  { type: 'buy_by_project', group: 'content', label: 'Compra por proyecto' },
  { type: 'featured_brands', group: 'navigation', label: 'Marcas destacadas' },
  { type: 'services_block', group: 'content', label: 'Bloque servicios' },
]

const groupColor: Record<SectionGroup, string> = {
  banners: 'linear-gradient(120deg,#1f4aa8,#2979ff)',
  products: 'linear-gradient(120deg,#0f6347,#2ecc71)',
  content: 'linear-gradient(120deg,#7a4a1d,#fb8c00)',
  navigation: 'linear-gradient(120deg,#5b2a86,#a06cec)',
}

let uid = 1000

export function HomeVisualBuilder() {
  const [channel, setChannel] = useState<CmsChannel>('b2c')
  const [device, setDevice] = useState<CmsDevice>('desktop')
  const [list, setList] = useState<CmsSection[]>(seed.map((s) => ({ ...s })))
  const [selected, setSelected] = useState<string>(seed[0]?.id ?? '')
  const [dragId, setDragId] = useState<string | null>(null)

  const visible = useMemo(
    () => list.filter((s) => s.channel === channel || s.channel === 'both').sort((a, b) => a.order - b.order),
    [list, channel],
  )
  const current = list.find((s) => s.id === selected)

  const move = (id: string, dir: -1 | 1) => {
    setList((prev) => {
      const arr = [...prev].sort((a, b) => a.order - b.order)
      const i = arr.findIndex((s) => s.id === id)
      const j = i + dir
      if (i < 0 || j < 0 || j >= arr.length) return prev
      const tmp = arr[i].order; arr[i].order = arr[j].order; arr[j].order = tmp
      return [...arr]
    })
  }
  const onDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return
    setList((prev) => {
      const arr = [...prev].sort((a, b) => a.order - b.order)
      const from = arr.findIndex((s) => s.id === dragId)
      const to = arr.findIndex((s) => s.id === targetId)
      const [moved] = arr.splice(from, 1)
      arr.splice(to, 0, moved)
      arr.forEach((s, idx) => (s.order = idx + 1))
      return [...arr]
    })
    setDragId(null)
  }
  const addSection = (p: (typeof PALETTE)[number]) => {
    const id = `new-${uid++}`
    const order = Math.max(0, ...list.map((s) => s.order)) + 1
    setList((prev) => [...prev, { id, internalName: p.label, title: p.label, subtitle: '', type: p.type, group: p.group, order, status: 'draft', channel, device: 'all', segmentIds: [], updatedAt: 'ahora', updatedBy: 'Tú' }])
    setSelected(id)
  }
  const remove = (id: string) => { setList((prev) => prev.filter((s) => s.id !== id)); if (selected === id) setSelected('') }
  const patch = (k: keyof CmsSection, v: string) => setList((prev) => prev.map((s) => (s.id === selected ? { ...s, [k]: v } : s)))

  return (
    <div>
      <PageHeader
        eyebrow="Contenido · Home"
        title="Home Builder"
        subtitle="Construye la home por bloques. Arrastra para reordenar, edita por canal y previsualiza por dispositivo."
        actions={
          <>
            <Button variant="ghost" icon="version">Comparar versiones</Button>
            <Button variant="ghost" icon="eye">Previsualizar</Button>
            <Button variant="green" icon="save">Guardar borrador</Button>
            <Button variant="blue" icon="published">Publicar home</Button>
          </>
        }
      />

      <div className="jc-segbar">
        <div className="jc-seg">
          {(['b2c', 'b2b'] as CmsChannel[]).map((c) => (
            <button key={c} className={channel === c ? 'is-active' : ''} onClick={() => setChannel(c)}>{CHANNEL_LABEL[c]}</button>
          ))}
        </div>
        <span className="jc-muted" style={{ fontSize: '0.82rem' }}>{visible.length} secciones en la home {CHANNEL_LABEL[channel]}</span>
        <div className="jc-seg" style={{ marginLeft: 'auto' }}>
          {(['desktop', 'tablet', 'mobile'] as CmsDevice[]).map((d) => (
            <button key={d} className={device === d ? 'is-active' : ''} onClick={() => setDevice(d)}><CmsIcon name="device" /> {DEVICE_LABEL[d]}</button>
          ))}
        </div>
      </div>

      <div className="jc-builder">
        {/* Izquierda: secciones + paleta */}
        <div className="jc-builder__col">
          <SectionHeader icon="sections" label="Secciones de la home" />
          <div className="jc-seclist">
            {visible.map((s) => (
              <div
                key={s.id}
                draggable
                onDragStart={() => setDragId(s.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDrop(s.id)}
                className={`jc-secitem ${selected === s.id ? 'is-active' : ''}`}
                onClick={() => setSelected(s.id)}
              >
                <span className="jc-secitem__drag"><CmsIcon name="drag" /></span>
                <span className="jc-secitem__bar" style={{ background: groupColor[s.group] }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="jc-secitem__name">{s.internalName}</div>
                  <div className="jc-secitem__meta">{s.type.replace(/_/g, ' ')}</div>
                </div>
                <StatusPill status={s.status} soft />
                <div className="jc-secitem__ord">
                  <button onClick={(e) => { e.stopPropagation(); move(s.id, -1) }} aria-label="Subir"><CmsIcon name="chevron" className="jc-flip" /></button>
                  <button onClick={(e) => { e.stopPropagation(); move(s.id, 1) }} aria-label="Bajar"><CmsIcon name="chevron" /></button>
                </div>
              </div>
            ))}
          </div>
          <SectionHeader icon="plus" label="Agregar sección" />
          <div className="jc-palette">
            {PALETTE.map((p) => (
              <button key={p.type} className="jc-palette__item" onClick={() => addSection(p)}>
                <span className="jc-palette__sw" style={{ background: groupColor[p.group] }} />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Centro: editor de sección */}
        <div className="jc-builder__col">
          <SectionHeader icon="edit" label="Editar sección" />
          {current ? (
            <div className="jc-card jc-card--pad">
              <Field label="Nombre interno"><input className="jc-input" value={current.internalName} onChange={(e) => patch('internalName', e.target.value)} /></Field>
              <Field label="Título visible"><input className="jc-input" value={current.title} onChange={(e) => patch('title', e.target.value)} /></Field>
              <Field label="Subtítulo"><input className="jc-input" value={current.subtitle} onChange={(e) => patch('subtitle', e.target.value)} /></Field>
              <Field label="Estado">
                <select className="jc-select" value={current.status} onChange={(e) => patch('status', e.target.value)}>
                  {(Object.keys(STATUS_META) as (keyof typeof STATUS_META)[]).map((k) => <option key={k} value={k}>{STATUS_META[k].label}</option>)}
                </select>
              </Field>
              <Field label="Canal">
                <select className="jc-select" value={current.channel} onChange={(e) => patch('channel', e.target.value)}>
                  {(['both', 'b2c', 'b2b'] as CmsChannel[]).map((c) => <option key={c} value={c}>{CHANNEL_LABEL[c]}</option>)}
                </select>
              </Field>
              <Field label="Segmento" help="Variante por segmento (público, B2B con crédito, sucursal…)"><input className="jc-input" placeholder="Buscar segmento…" /></Field>
              <Field label="Regla de visibilidad"><input className="jc-input" placeholder="Ej: Solo empresas logueadas" /></Field>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <Button variant="ghost" icon="device" size="sm">Config mobile</Button>
                <Button variant="danger" icon="trash" size="sm" onClick={() => remove(current.id)}>Quitar</Button>
              </div>
            </div>
          ) : (
            <div className="jc-empty"><div className="jc-empty__ic"><CmsIcon name="edit" /></div><h3>Selecciona una sección</h3><p>Elige una sección de la izquierda o agrega una nueva desde la paleta.</p></div>
          )}
        </div>

        {/* Derecha: preview */}
        <div className="jc-builder__col">
          <SectionHeader icon="eye" label={`Preview · ${DEVICE_LABEL[device]}`} />
          <div className={`jc-preview jc-preview--${device}`}>
            <div className="jc-preview__bar"><span /><span /><span /></div>
            <div className="jc-preview__scroll">
              {visible.map((s) => (
                <div key={s.id} className={`jc-pblock ${selected === s.id ? 'is-sel' : ''}`} style={{ background: groupColor[s.group] }} onClick={() => setSelected(s.id)}>
                  <span className="jc-pblock__t">{s.title || s.internalName}</span>
                  <span className="jc-pblock__ty">{s.type.replace(/_/g, ' ')}</span>
                </div>
              ))}
              {visible.length === 0 && <div className="jc-muted" style={{ padding: 24, textAlign: 'center' }}>Sin secciones</div>}
            </div>
          </div>
          <p className="jc-help" style={{ marginTop: 10 }}><Pill tone="info" soft>Vista previa</Pill> con fecha futura y segmento simulado disponible en Preview Center.</p>
        </div>
      </div>
    </div>
  )
}
