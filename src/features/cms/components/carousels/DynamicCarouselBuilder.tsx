'use client'

import { useState } from 'react'
import { carousels } from '@/features/cms/mocks'
import { CAROUSEL_RULE_LABEL, CHANNEL_LABEL, STATUS_META, type Tone } from '@/features/cms/constants'
import type { CmsCarousel } from '@/features/cms/types'
import { Button, Field, PageHeader, Pill, SectionHeader, StatusPill } from '@/features/cms/components/ui'

const rowMod = (t: Tone) => (t === 'success' ? '' : t === 'info' ? 'jc-row--brand' : `jc-row--${t}`)

export function DynamicCarouselBuilder() {
  const [list, setList] = useState<CmsCarousel[]>(carousels.map((c) => ({ ...c })))
  const [sel, setSel] = useState(carousels[0]?.id ?? '')
  const c = list.find((x) => x.id === sel)
  const toggle = (k: keyof CmsCarousel) => c && setList((prev) => prev.map((x) => (x.id === sel ? { ...x, [k]: !x[k] } : x)))
  const patch = (k: keyof CmsCarousel, v: string | number) => setList((prev) => prev.map((x) => (x.id === sel ? { ...x, [k]: v } : x)))

  return (
    <div>
      <PageHeader eyebrow="Contenido" title="Dynamic Carousel Builder" subtitle="Carruseles manuales o dinámicos por regla (categoría, marca, descuento, más vendidos, B2B…), con exclusiones y fallback." actions={<Button variant="green" icon="plus">Nuevo carrusel</Button>} />
      <div className="jc-grid-2">
        <div>
          <SectionHeader icon="carousel" label="Carruseles" />
          <div className="jc-rows">
            {list.map((x) => (
              <div key={x.id} className={`jc-row ${sel === x.id ? 'jc-row--brand' : rowMod(STATUS_META[x.status].tone)}`} style={{ gridTemplateColumns: '1fr auto', cursor: 'pointer' }} onClick={() => setSel(x.id)}>
                <div><div className="jc-row__title">{x.title}</div><div className="jc-row__meta">{CAROUSEL_RULE_LABEL[x.rule]} · {CHANNEL_LABEL[x.channel]} · máx {x.maxItems}</div></div>
                <StatusPill status={x.status} soft />
              </div>
            ))}
          </div>
        </div>
        <aside className="jc-panel">
          <SectionHeader icon="settings" label="Configuración" />
          {c ? (
            <>
              <Field label="Título visible"><input className="jc-input" value={c.title} onChange={(e) => patch('title', e.target.value)} /></Field>
              <Field label="Regla de selección">
                <select className="jc-select" value={c.rule} onChange={(e) => patch('rule', e.target.value)}>
                  {(Object.keys(CAROUSEL_RULE_LABEL) as CmsCarousel['rule'][]).map((r) => <option key={r} value={r}>{CAROUSEL_RULE_LABEL[r]}</option>)}
                </select>
              </Field>
              <Field label="Cantidad máxima"><input className="jc-input" type="number" value={c.maxItems} onChange={(e) => patch('maxItems', Number(e.target.value))} /></Field>
              <Field label="Canal">
                <select className="jc-select" value={c.channel} onChange={(e) => patch('channel', e.target.value)}>
                  {(['both', 'b2c', 'b2b'] as CmsCarousel['channel'][]).map((ch) => <option key={ch} value={ch}>{CHANNEL_LABEL[ch]}</option>)}
                </select>
              </Field>
              <SectionHeader icon="rules" label="Reglas de saneamiento" />
              {([['hideNoStock', 'Ocultar sin stock'], ['hideNoPrice', 'Ocultar sin precio'], ['onlyPublished', 'Solo web-published']] as [keyof CmsCarousel, string][]).map(([k, label]) => (
                <label key={k} className="jc-switchrow"><input type="checkbox" checked={Boolean(c[k])} onChange={() => toggle(k)} /> {label}</label>
              ))}
              <div style={{ marginTop: 8 }}>
                <span className="jc-help">Exclusiones</span>
                <div className="jc-chips" style={{ marginTop: 6 }}>
                  <span className="jc-chip">Marcas <span className="jc-chip__x">{c.excludeBrands.length}</span></span>
                  <span className="jc-chip">Categorías <span className="jc-chip__x">{c.excludeCategories.length}</span></span>
                  <span className="jc-chip">SKUs <span className="jc-chip__x">{c.excludeSkus.length}</span></span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <Button variant="green" icon="save">Guardar</Button>
                <Button variant="ghost" icon="eye">Previsualizar</Button>
              </div>
              <p className="jc-help" style={{ marginTop: 12 }}><Pill tone="info" soft>Fallback</Pill> Si la regla no devuelve productos, se muestra “Más vendidos”.</p>
            </>
          ) : <p className="jc-help">Selecciona un carrusel.</p>}
        </aside>
      </div>
    </div>
  )
}
