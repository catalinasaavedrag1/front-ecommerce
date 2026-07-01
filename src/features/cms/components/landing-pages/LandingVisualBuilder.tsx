'use client'

import { useState } from 'react'
import { useRouter } from '@/features/cms/compat/next-navigation'
import { landings } from '@/features/cms/mocks'
import { CHANNEL_LABEL, CMS_BASE } from '@/features/cms/constants'
import type { CmsChannel } from '@/features/cms/types'
import { Button, CmsIcon, Field, PageHeader, Pill, SectionHeader } from '@/features/cms/components/ui'

const TABS = [
  { key: 'seo', label: 'SEO', icon: 'seo' as const },
  { key: 'builder', label: 'Constructor', icon: 'sections' as const },
  { key: 'segment', label: 'Segmentación', icon: 'segment' as const },
  { key: 'versions', label: 'Versiones', icon: 'version' as const },
]

const BLOCKS = ['Hero', 'Beneficios', 'Carrusel de productos', 'Texto + imagen', 'FAQ', 'Formulario']

export function LandingVisualBuilder({ landingId }: { landingId?: string }) {
  const router = useRouter()
  const existing = landingId && landingId !== 'new' ? landings.find((l) => l.id === landingId) : undefined
  const [tab, setTab] = useState('seo')
  const [f, setF] = useState({
    metaTitle: existing?.metaTitle ?? '',
    metaDescription: existing?.metaDescription ?? '',
    h1: existing?.h1 ?? '',
    slug: existing?.slug ?? '/',
    canonical: existing?.canonicalUrl ?? '',
    indexable: existing?.indexable ?? true,
    ogTitle: existing?.ogTitle ?? '',
    channel: (existing?.channel ?? 'b2c') as CmsChannel,
  })
  const set = (k: keyof typeof f, v: string | boolean) => setF((s) => ({ ...s, [k]: v }))
  const [blocks, setBlocks] = useState<string[]>(['Hero', 'Beneficios', 'Carrusel de productos'])

  const issues: string[] = []
  if (!f.metaTitle) issues.push('Meta title vacío')
  else if (f.metaTitle.length > 60) issues.push('Meta title muy largo (>60)')
  if (!f.metaDescription) issues.push('Meta description vacía')
  if (!f.h1) issues.push('H1 vacío')

  return (
    <div>
      <PageHeader
        eyebrow="Landing"
        title={existing ? existing.internalName : 'Nueva landing'}
        status={existing?.status ?? 'draft'}
        actions={
          <>
            <Button variant="ghost" icon="eye">Previsualizar</Button>
            <Button variant="green" icon="save">Guardar borrador</Button>
            <Button variant="blue" icon="published">Publicar</Button>
            <Button variant="ghost" icon="cancel" onClick={() => router.push(`${CMS_BASE}/landing-pages`)}>Cancelar</Button>
          </>
        }
      />
      <nav className="jc-tabs">
        {TABS.map((t) => (
          <button key={t.key} className={`jc-tab ${tab === t.key ? 'is-active' : ''}`} style={{ background: 'none', borderBottom: tab === t.key ? '2px solid var(--jc-blue)' : '2px solid transparent' }} onClick={() => setTab(t.key)}>
            <CmsIcon name={t.icon} /> {t.label}
          </button>
        ))}
      </nav>

      {tab === 'seo' && (
        <div className="jc-grid-2">
          <div className="jc-panel">
            <SectionHeader icon="seo" label="Metadatos" />
            <Field label="Slug"><input className="jc-input" value={f.slug} onChange={(e) => set('slug', e.target.value)} /></Field>
            <Field label="URL canónica"><input className="jc-input" value={f.canonical} onChange={(e) => set('canonical', e.target.value)} placeholder="https://mimbral.cl/…" /></Field>
            <Field label="Meta title" help={`${f.metaTitle.length}/60`}><input className="jc-input" value={f.metaTitle} onChange={(e) => set('metaTitle', e.target.value)} /></Field>
            <Field label="Meta description"><textarea className="jc-textarea" value={f.metaDescription} onChange={(e) => set('metaDescription', e.target.value)} /></Field>
            <Field label="H1"><input className="jc-input" value={f.h1} onChange={(e) => set('h1', e.target.value)} /></Field>
            <Field label="Open Graph title"><input className="jc-input" value={f.ogTitle} onChange={(e) => set('ogTitle', e.target.value)} /></Field>
            <Field label="Indexable"><label style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}><input type="checkbox" checked={f.indexable} onChange={(e) => set('indexable', e.target.checked)} /> Permitir indexación</label></Field>
          </div>
          <aside className="jc-panel">
            <SectionHeader icon="eye" label="Vista en Google" />
            <div className="jc-serp">
              <span className="jc-serp__url"><CmsIcon name="external" /> mimbral.cl{f.slug}</span>
              <span className="jc-serp__title">{f.metaTitle || 'Meta title de la landing'}</span>
              <p className="jc-serp__desc">{f.metaDescription || 'La meta description aparecerá aquí en los resultados de búsqueda.'}</p>
            </div>
            <SectionHeader icon="warning" label="Validaciones" />
            {issues.length === 0 ? (
              <p className="jc-help"><Pill tone="success" soft>OK</Pill> Sin problemas de SEO.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {issues.map((i) => <span key={i} style={{ fontSize: '0.84rem' }}><Pill tone="danger" soft>{i}</Pill></span>)}
              </div>
            )}
          </aside>
        </div>
      )}

      {tab === 'builder' && (
        <div className="jc-grid-2">
          <div className="jc-panel">
            <SectionHeader icon="sections" label="Secciones" />
            <div className="jc-seclist">
              {blocks.map((b, i) => (
                <div key={b} className="jc-secitem">
                  <span className="jc-secitem__drag"><CmsIcon name="drag" /></span>
                  <div style={{ flex: 1 }}><div className="jc-secitem__name">{b}</div></div>
                  <button className="jc-iconbtn" style={{ width: 30, height: 30 }} onClick={() => setBlocks((p) => p.filter((_, idx) => idx !== i))}><CmsIcon name="trash" /></button>
                </div>
              ))}
            </div>
            <SectionHeader icon="plus" label="Agregar sección" />
            <div className="jc-palette">
              {BLOCKS.map((b) => <button key={b} className="jc-palette__item" onClick={() => setBlocks((p) => [...p, b])}><span className="jc-palette__sw" style={{ background: 'linear-gradient(120deg,#1f4aa8,#2979ff)' }} />{b}</button>)}
            </div>
          </div>
          <aside className="jc-panel">
            <SectionHeader icon="eye" label="Preview" />
            <div className="jc-preview jc-preview--desktop">
              <div className="jc-preview__bar"><span /><span /><span /></div>
              <div className="jc-preview__scroll">
                {blocks.map((b, i) => <div key={i} className="jc-pblock" style={{ background: 'linear-gradient(120deg,#1f4aa8,#2979ff)' }}><span className="jc-pblock__t">{b}</span></div>)}
              </div>
            </div>
          </aside>
        </div>
      )}

      {tab === 'segment' && (
        <div className="jc-panel" style={{ maxWidth: 640 }}>
          <SectionHeader icon="segment" label="Segmentación y visibilidad" />
          <Field label="Canal">
            <select className="jc-select" value={f.channel} onChange={(e) => set('channel', e.target.value)}>
              {(['both', 'b2c', 'b2b'] as CmsChannel[]).map((c) => <option key={c} value={c}>{CHANNEL_LABEL[c]}</option>)}
            </select>
          </Field>
          <Field label="Segmentos visibles"><input className="jc-input" placeholder="Buscar segmento…" /></Field>
          <Field label="Regla de visibilidad"><input className="jc-input" placeholder="Ej: Campaña vigente + B2B" /></Field>
          <Field label="Publicación"><input className="jc-input" type="date" /></Field>
          <Field label="Término"><input className="jc-input" type="date" /></Field>
        </div>
      )}

      {tab === 'versions' && (
        <div className="jc-panel"><SectionHeader icon="version" label="Versiones" /><p className="jc-help">Historial, comparación y rollback en el módulo Versiones.</p></div>
      )}
    </div>
  )
}
