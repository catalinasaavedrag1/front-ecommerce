'use client'

import { useMemo, useState } from 'react'
import { useCmsResource } from '@/features/cms/hooks/useCmsResource'
import { simulateRequest } from '@/features/cms/services/simulate'
import { products } from '@/features/cms/mocks'
import type { CmsProductReference } from '@/features/cms/types'
import type { Tone } from '@/features/cms/constants'
import { Button, CmsIcon, EmptyState, IconButton, PageHeader, Pill, ResourceState } from '@/features/cms/components/ui'

const COLS = '54px minmax(200px,1.7fr) 1fr repeat(4, 78px) 0.8fr'
const flagTone = (ok: boolean): Tone => (ok ? 'success' : 'danger')
const statusTone: Record<string, Tone> = { ok: 'success', warning: 'warning', error: 'danger' }

function Flag({ ok }: { ok: boolean }) {
  return <span className={`jc-flag jc-flag--${flagTone(ok)}`}><CmsIcon name={ok ? 'check' : 'cancel'} /></span>
}

export function ProductExperienceManager() {
  const { state, data, error } = useCmsResource(() => simulateRequest(products), [])
  const [q, setQ] = useState('')
  const rows = useMemo(() => (data ?? []).filter((p) => !q || `${p.name} ${p.sku} ${p.brand}`.toLowerCase().includes(q.toLowerCase())), [data, q])
  return (
    <div>
      <PageHeader
        eyebrow="Contenido"
        title="Product Experience Manager"
        subtitle="Decide cómo se presentan los productos en el contenido. Consulta catálogo/precio/stock/promoción (no los administra)."
        actions={<Button variant="green" icon="plus">Nueva vitrina</Button>}
      />
      <p className="jc-help" style={{ marginBottom: 14 }}>
        <CmsIcon name="refresh" /> Integración simulada: <strong>catalog-service · pricing-service · inventory-service-v3 · promotion-service · search-service</strong>
      </p>
      <div className="jc-toolbar">
        <div className="jc-search"><CmsIcon name="search" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar SKU, nombre o marca…" /></div>
        <div className="jc-toolbar__spacer" /><div className="jc-toolbar__icons"><IconButton icon="filter" /><IconButton icon="refresh" /></div>
      </div>
      <ResourceState state={state} error={error} empty={<EmptyState icon="product" title="Sin productos" />}>
        <>
          <div className="jc-listhead" style={{ gridTemplateColumns: COLS }}>
            <span></span><span>Producto</span><span>Categoría</span><span>Web</span><span>Precio</span><span>Stock</span><span>Imagen</span><span>Estado</span>
          </div>
          <div className="jc-rows">
            {rows.map((p: CmsProductReference) => (
              <div key={p.sku} className={`jc-row jc-row--${statusTone[p.status] === 'success' ? 'default' : statusTone[p.status]}`} style={{ gridTemplateColumns: COLS }}>
                <span className="jc-thumb" style={{ width: 46, height: 34, background: p.gradient }} />
                <div><div className="jc-row__title">{p.name}</div><div className="jc-row__meta jc-mono">{p.sku} · {p.brand}</div></div>
                <span>{p.category}</span>
                <Flag ok={p.webPublished} />
                <Flag ok={p.priceAvailable} />
                <Flag ok={p.stockAvailable} />
                <Flag ok={p.imageOk} />
                <Pill tone={statusTone[p.status]} soft>{p.status === 'ok' ? 'OK' : p.status === 'warning' ? 'Revisar' : 'Bloqueado'}</Pill>
              </div>
            ))}
          </div>
        </>
      </ResourceState>
    </div>
  )
}
