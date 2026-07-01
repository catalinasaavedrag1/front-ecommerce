'use client'

import { useMemo, useState } from 'react'
import { useCmsResource } from '@/features/cms/hooks/useCmsResource'
import { simulateRequest } from '@/features/cms/services/simulate'
import { faqs } from '@/features/cms/mocks'
import { CHANNEL_LABEL, STATUS_META, type Tone } from '@/features/cms/constants'
import type { FaqScope } from '@/features/cms/types'
import { Button, CmsIcon, EmptyState, IconButton, PageHeader, Pill, ResourceState, StatusPill } from '@/features/cms/components/ui'

const SCOPE_LABEL: Record<FaqScope, string> = { category: 'Categoría', product: 'Producto', landing: 'Landing', shipping: 'Despacho', returns: 'Devoluciones', b2b: 'B2B', checkout: 'Checkout' }
const rowMod = (t: Tone) => (t === 'success' ? '' : t === 'info' ? 'jc-row--brand' : `jc-row--${t}`)

export function FaqBuilder() {
  const { state, data, error } = useCmsResource(() => simulateRequest(faqs), [])
  const [open, setOpen] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const rows = useMemo(() => (data ?? []).filter((f) => !q || f.question.toLowerCase().includes(q.toLowerCase())), [data, q])

  return (
    <div>
      <PageHeader eyebrow="Contenido" title="FAQ / Help Builder" subtitle="FAQ por categoría, producto, landing, despacho, devoluciones, B2B o checkout, con orden drag & drop y schema FAQ." actions={<Button variant="green" icon="plus">Nueva pregunta</Button>} />
      <div className="jc-toolbar">
        <div className="jc-search"><CmsIcon name="search" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar pregunta…" /></div>
      </div>
      <ResourceState state={state} error={error} empty={<EmptyState icon="faq" title="Sin preguntas" />}>
        <div className="jc-rows">
          {rows.map((f) => (
            <div key={f.id} className={`jc-row ${rowMod(STATUS_META[f.status].tone)}`} style={{ gridTemplateColumns: '20px 1fr auto', alignItems: 'start' }}>
              <span style={{ color: '#b5bcc7', cursor: 'grab', paddingTop: 3 }}><CmsIcon name="drag" /></span>
              <div>
                <button onClick={() => setOpen(open === f.id ? null : f.id)} style={{ background: 'none', border: 0, padding: 0, textAlign: 'left', font: 'inherit' }}>
                  <div className="jc-row__title">{f.question}</div>
                </button>
                {open === f.id && <p style={{ margin: '8px 0 0', color: 'var(--jc-ink-2)', fontSize: '0.88rem' }}>{f.answer}</p>}
                <div className="jc-row__meta" style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Pill tone="default" soft>{SCOPE_LABEL[f.scope]}</Pill>
                  <Pill tone="default" soft>{CHANNEL_LABEL[f.channel]}</Pill>
                  {f.schemaEnabled && <Pill tone="info" soft>Schema FAQ</Pill>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <StatusPill status={f.status} soft />
                <IconButton icon="edit" />
              </div>
            </div>
          ))}
        </div>
      </ResourceState>
    </div>
  )
}
