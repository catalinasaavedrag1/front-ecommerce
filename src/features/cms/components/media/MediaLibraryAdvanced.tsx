'use client'

import { useMemo, useRef, useState, type DragEvent } from 'react'
import { useCmsResource } from '@/features/cms/hooks/useCmsResource'
import { cmsMediaApi } from '@/features/cms/services/cms-media.api'
import type { Tone } from '@/features/cms/constants'
import { Button, CmsIcon, EmptyState, PageHeader, Pill, ResourceState } from '@/features/cms/components/ui'

interface LocalAsset { id: string; name: string; format: string; weightKb: number; dimensions: string; status: 'active' | 'orphan' | 'expired'; src?: string; gradient?: string; folder: string }

const statusTone: Record<string, Tone> = { active: 'success', orphan: 'warning', expired: 'danger' }
const statusLabel: Record<string, string> = { active: 'En uso', orphan: 'Huérfana', expired: 'Vencida' }

export function MediaLibraryAdvanced() {
  const { state, data, error } = useCmsResource(() => cmsMediaApi.list(), [])
  const [extra, setExtra] = useState<LocalAsset[]>([])
  const [q, setQ] = useState('')
  const [dragging, setDragging] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const all: LocalAsset[] = useMemo(() => [...extra, ...((data ?? []) as LocalAsset[])], [extra, data])
  const shown = all.filter((m) => m.name.toLowerCase().includes(q.toLowerCase()))

  const addFiles = (files?: FileList | null) => {
    if (!files) return
    Array.from(files).filter((f) => f.type.startsWith('image/')).forEach((f) => {
      const reader = new FileReader()
      reader.onload = () =>
        setExtra((prev) => [{ id: `up-${prev.length}-${f.name}`, name: f.name, src: String(reader.result), format: (f.name.split('.').pop() ?? 'IMG').toUpperCase(), weightKb: Math.round(f.size / 1024), dimensions: '—', status: 'active', folder: 'Subidas' }, ...prev])
      reader.readAsDataURL(f)
    })
  }
  const onDrop = (e: DragEvent) => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }

  return (
    <div>
      <PageHeader
        eyebrow="Contenido"
        title="Biblioteca de medios"
        subtitle="Imágenes y archivos de la web: carpetas, tags, peso, dónde se usan, huérfanas y optimización a WebP."
        actions={
          <>
            <Button variant="blue" icon="export">Exportar</Button>
            <Button variant="green" icon="upload" onClick={() => fileRef.current?.click()}>Subir archivos</Button>
            <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => addFiles(e.target.files)} />
          </>
        }
      />

      <div className="jc-toolbar">
        <div className="jc-search">
          <CmsIcon name="search" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar archivo o tag…" />
        </div>
        <span className="jc-muted">{shown.length} archivos</span>
      </div>

      <div
        className="jc-dropzone"
        style={dragging ? { borderColor: 'var(--jc-blue)', background: '#eef5ff', color: 'var(--jc-blue-d)' } : undefined}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
      >
        <CmsIcon name="upload" /> Arrastra imágenes aquí para subirlas a la biblioteca
      </div>

      <ResourceState state={state} error={error} empty={<EmptyState icon="media" title="Sin archivos" description="Sube tu primera imagen." />}>
        {shown.length === 0 ? (
          <EmptyState icon="media" title="Sin resultados" description="Ningún archivo coincide con tu búsqueda." />
        ) : (
          <div className="jc-media">
            {shown.map((m) => (
              <figure className="jc-mediacard" key={m.id}>
                <div className="jc-mediacard__thumb" style={m.src ? { backgroundImage: `url(${m.src})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: m.gradient }}>
                  <span className="jc-mediacard__ext">{m.format}</span>
                  <span className="jc-mediacard__badge"><Pill tone={statusTone[m.status]} soft>{statusLabel[m.status]}</Pill></span>
                </div>
                <figcaption>
                  <strong title={m.name}>{m.name}</strong>
                  <span>{m.dimensions} · {m.weightKb} KB · {m.folder}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        )}
      </ResourceState>
    </div>
  )
}
