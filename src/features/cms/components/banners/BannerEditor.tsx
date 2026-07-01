'use client'

import { useRef, useState, type DragEvent } from 'react'
import { useRouter } from '@/features/cms/compat/next-navigation'
import { banners } from '@/features/cms/mocks'
import { CHANNEL_LABEL, CMS_BASE, DEVICE_LABEL } from '@/features/cms/constants'
import type { CmsChannel, CmsDevice } from '@/features/cms/types'
import { Button, CmsIcon, Field, PageHeader, SectionHeader } from '@/features/cms/components/ui'

const TABS = [
  { key: 'resumen', label: 'Resumen', icon: 'sections' as const },
  { key: 'imagen', label: 'Imagen', icon: 'image' as const },
  { key: 'segmentacion', label: 'Segmentación', icon: 'segment' as const },
  { key: 'programacion', label: 'Programación', icon: 'calendar' as const },
  { key: 'logs', label: 'Logs', icon: 'version' as const },
]

export function BannerEditor({ bannerId }: { bannerId?: string }) {
  const router = useRouter()
  const existing = bannerId ? banners.find((b) => b.id === bannerId) : undefined
  const [tab, setTab] = useState('resumen')
  const [saved, setSaved] = useState(false)

  const [f, setF] = useState({
    internalName: existing?.internalName ?? '',
    title: existing?.title ?? '',
    subtitle: existing?.subtitle ?? '',
    cta: existing?.cta ?? '',
    link: existing?.link ?? '',
    placement: existing?.placement ?? 'Home · Hero',
    channel: (existing?.channel ?? 'both') as CmsChannel,
    device: (existing?.device ?? 'all') as CmsDevice,
    priority: existing?.priority ?? 1,
    alt: existing?.alt ?? '',
    startAt: existing?.startAt ?? '',
    endAt: existing?.endAt ?? '',
  })
  const set = (k: keyof typeof f, v: string | number) => setF((s) => ({ ...s, [k]: v }))

  const [image, setImage] = useState<string | null>(null)
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)
  const readFile = (file?: File) => {
    if (!file || !file.type.startsWith('image/')) return
    const r = new FileReader()
    r.onload = () => setImage(String(r.result))
    r.readAsDataURL(file)
  }

  const save = () => { setSaved(true); setTimeout(() => router.push(`${CMS_BASE}/banners`), 800) }

  return (
    <div>
      <PageHeader
        eyebrow="Banner"
        title={existing ? existing.internalName : 'Nuevo banner'}
        status={existing?.status ?? 'draft'}
        actions={
          <>
            <Button variant="outline-green" icon="apply">Aplicar</Button>
            <Button variant="green" icon="save" onClick={save} disabled={saved}>{saved ? 'Guardado' : 'Guardar'}</Button>
            <Button variant="blue" icon="plus">Guardar & crear</Button>
            <Button variant="ghost" icon="cancel" onClick={() => router.push(`${CMS_BASE}/banners`)}>Cancelar</Button>
          </>
        }
      />

      <nav className="jc-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`jc-tab ${tab === t.key ? 'is-active' : ''}`} style={{ border: 0, borderBottom: tab === t.key ? '2px solid var(--jc-blue)' : '2px solid transparent', background: 'none' }} onClick={() => setTab(t.key)}>
            <CmsIcon name={t.icon} /> {t.label}
          </button>
        ))}
      </nav>

      <div className="jc-grid-2">
        <div className="jc-panel">
          {tab === 'resumen' && (
            <>
              <SectionHeader icon="sections" label="Detalle" />
              <Field label="Nombre interno"><input className="jc-input" value={f.internalName} onChange={(e) => set('internalName', e.target.value)} placeholder="Ej: Invierno calefacción hero" /></Field>
              <Field label="Título"><input className="jc-input" value={f.title} onChange={(e) => set('title', e.target.value)} /></Field>
              <Field label="Subtítulo"><input className="jc-input" value={f.subtitle} onChange={(e) => set('subtitle', e.target.value)} /></Field>
              <Field label="CTA"><input className="jc-input" value={f.cta} onChange={(e) => set('cta', e.target.value)} placeholder="Ver ofertas" /></Field>
              <Field label="Link de destino"><input className="jc-input" value={f.link} onChange={(e) => set('link', e.target.value)} placeholder="/categoria/electrohogar" /></Field>
              <Field label="Ubicación">
                <select className="jc-select" value={f.placement} onChange={(e) => set('placement', e.target.value)}>
                  {['Home · Hero', 'Home · Secundario', 'Categoría · Cabecera', 'Checkout · Lateral', 'Pop-up'].map((p) => <option key={p}>{p}</option>)}
                </select>
              </Field>
              <Field label="Prioridad"><input className="jc-input" type="number" min={1} value={f.priority} onChange={(e) => set('priority', Number(e.target.value))} /></Field>
            </>
          )}

          {tab === 'imagen' && (
            <>
              <SectionHeader icon="image" label="Imagen del banner" />
              <p className="jc-help" style={{ marginBottom: 12 }}>Recomendado 1600×600 px · JPG/PNG/WebP · máx 2 MB. Sube por dispositivo (desktop / mobile / tablet).</p>
              <div
                className="jc-dropzone"
                style={{ minHeight: 200, ...(dragging ? { borderColor: 'var(--jc-blue)', background: '#eef5ff' } : {}) }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e: DragEvent) => { e.preventDefault(); setDragging(false); readFile(e.dataTransfer.files?.[0]) }}
                onClick={() => fileRef.current?.click()}
              >
                {image ? <img src={image} alt="preview" style={{ maxHeight: 260, maxWidth: '100%', borderRadius: 8 }} /> : <><CmsIcon name="upload" /> Arrastra la imagen desktop o haz clic para subir</>}
                <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => readFile(e.target.files?.[0])} />
              </div>
              <Field label="Texto alternativo"><input className="jc-input" value={f.alt} onChange={(e) => set('alt', e.target.value)} placeholder="Describe la imagen (accesibilidad/SEO)" /></Field>
            </>
          )}

          {tab === 'segmentacion' && (
            <>
              <SectionHeader icon="segment" label="Segmentación" />
              <Field label="Canal">
                <select className="jc-select" value={f.channel} onChange={(e) => set('channel', e.target.value)}>
                  {(['both', 'b2c', 'b2b'] as CmsChannel[]).map((c) => <option key={c} value={c}>{CHANNEL_LABEL[c]}</option>)}
                </select>
              </Field>
              <Field label="Dispositivo">
                <select className="jc-select" value={f.device} onChange={(e) => set('device', e.target.value)}>
                  {(['all', 'desktop', 'mobile', 'tablet'] as CmsDevice[]).map((d) => <option key={d} value={d}>{DEVICE_LABEL[d]}</option>)}
                </select>
              </Field>
              <Field label="Segmentos" help="Público, logueado, B2B con crédito, sucursal, rubro…"><input className="jc-input" placeholder="Buscar segmento…" /></Field>
              <Field label="Regla de visibilidad"><input className="jc-input" placeholder="Ej: Solo empresas logueadas" /></Field>
            </>
          )}

          {tab === 'programacion' && (
            <>
              <SectionHeader icon="calendar" label="Programación" />
              <Field label="Desde"><input className="jc-input" type="date" value={f.startAt} onChange={(e) => set('startAt', e.target.value)} /></Field>
              <Field label="Hasta"><input className="jc-input" type="date" value={f.endAt} onChange={(e) => set('endAt', e.target.value)} /></Field>
              <Field label="UTM"><input className="jc-input" placeholder="utm_campaign=invierno" /></Field>
              <Field label="Evento analytics"><input className="jc-input" placeholder="banner_invierno" /></Field>
            </>
          )}

          {tab === 'logs' && (
            <>
              <SectionHeader icon="version" label="Historial" />
              <p className="jc-help">Los cambios, versiones y publicaciones aparecerán aquí (auditoría y rollback).</p>
            </>
          )}
        </div>

        <aside className="jc-panel">
          <SectionHeader icon="published" label="Publicación" />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.86rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="jc-muted">Ubicación</span><strong>{f.placement}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="jc-muted">Canal</span><strong>{CHANNEL_LABEL[f.channel]}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="jc-muted">Dispositivo</span><strong>{DEVICE_LABEL[f.device]}</strong></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span className="jc-muted">Vigencia</span><strong>{f.startAt ? `${f.startAt} → ${f.endAt || '…'}` : 'Sin definir'}</strong></div>
          </div>
          <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Button variant="ghost" icon="eye">Previsualizar</Button>
            <Button variant="outline-green" icon="approval">Enviar a revisión</Button>
            <Button variant="green" icon="save" onClick={save} disabled={saved}>{saved ? 'Guardado ✓' : 'Guardar borrador'}</Button>
          </div>
        </aside>
      </div>
    </div>
  )
}
