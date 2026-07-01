'use client'

import { useState } from 'react'
import { visibilityRules } from '@/features/cms/mocks'
import type { CmsVisibilityRule, VisibilityField } from '@/features/cms/types'
import { Button, CmsIcon, PageHeader, Pill, SectionHeader } from '@/features/cms/components/ui'

const FIELD_LABEL: Record<VisibilityField, string> = {
  channel: 'Canal', customer_type: 'Tipo de cliente', segment: 'Segmento', branch: 'Sucursal',
  date: 'Fecha', device: 'Dispositivo', price_list: 'Lista de precio', visited_category: 'Categoría visitada',
  active_campaign: 'Campaña activa', stock: 'Stock disponible',
}
const OP_LABEL: Record<string, string> = { is: 'es', is_not: 'no es', in: 'está en', between: 'entre', gt: 'mayor que', lt: 'menor que' }

export function VisibilityRuleBuilder() {
  const [rules, setRules] = useState<CmsVisibilityRule[]>(visibilityRules.map((r) => ({ ...r, conditions: r.conditions.map((c) => ({ ...c })) })))
  const [sel, setSel] = useState<string>(visibilityRules[0]?.id ?? '')
  const rule = rules.find((r) => r.id === sel)

  const addCond = () => rule && setRules((prev) => prev.map((r) => r.id === sel ? { ...r, conditions: [...r.conditions, { id: `c${Date.now()}`, field: 'channel', operator: 'is', value: '' }] } : r))
  const setCond = (cid: string, key: 'field' | 'operator' | 'value', v: string) =>
    setRules((prev) => prev.map((r) => r.id === sel ? { ...r, conditions: r.conditions.map((c) => c.id === cid ? { ...c, [key]: v } : c) } : r))
  const delCond = (cid: string) => setRules((prev) => prev.map((r) => r.id === sel ? { ...r, conditions: r.conditions.filter((c) => c.id !== cid) } : r))
  const setMatch = (m: 'all' | 'any') => setRules((prev) => prev.map((r) => r.id === sel ? { ...r, match: m } : r))
  const setFallback = (fb: 'hide' | 'show_fallback') => setRules((prev) => prev.map((r) => r.id === sel ? { ...r, fallback: fb } : r))

  return (
    <div>
      <PageHeader eyebrow="Segmentación" title="Reglas de visibilidad" subtitle="Editor visual: muestra u oculta contenido según canal, cliente, segmento, sucursal, fecha, dispositivo o stock." actions={<Button variant="green" icon="plus">Nueva regla</Button>} />

      <div className="jc-grid-2">
        <div>
          <SectionHeader icon="rules" label="Reglas" />
          <div className="jc-rows">
            {rules.map((r) => (
              <div key={r.id} className={`jc-row ${sel === r.id ? 'jc-row--brand' : 'jc-row--default'}`} style={{ gridTemplateColumns: '1fr auto', cursor: 'pointer' }} onClick={() => setSel(r.id)}>
                <div>
                  <div className="jc-row__title">{r.name}</div>
                  <div className="jc-row__meta">{r.conditions.length} condiciones · usada en {r.usedIn} · fallback: {r.fallback === 'hide' ? 'ocultar' : 'mostrar fallback'}</div>
                </div>
                <Pill tone={r.match === 'all' ? 'brand' : 'warning'} soft>{r.match === 'all' ? 'TODAS' : 'CUALQUIERA'}</Pill>
              </div>
            ))}
          </div>
        </div>

        <div className="jc-panel">
          <SectionHeader icon="edit" label="Editor de regla" />
          {rule ? (
            <>
              <div className="jc-rulebar">
                <span>Mostrar la sección si se cumplen</span>
                <div className="jc-seg jc-seg--sm">
                  <button className={rule.match === 'all' ? 'is-active' : ''} onClick={() => setMatch('all')}>TODAS</button>
                  <button className={rule.match === 'any' ? 'is-active' : ''} onClick={() => setMatch('any')}>CUALQUIERA</button>
                </div>
                <span>de las condiciones:</span>
              </div>

              <div className="jc-conds">
                {rule.conditions.map((c) => (
                  <div className="jc-cond" key={c.id}>
                    <select className="jc-select" value={c.field} onChange={(e) => setCond(c.id, 'field', e.target.value)}>
                      {(Object.keys(FIELD_LABEL) as VisibilityField[]).map((k) => <option key={k} value={k}>{FIELD_LABEL[k]}</option>)}
                    </select>
                    <select className="jc-select" value={c.operator} onChange={(e) => setCond(c.id, 'operator', e.target.value)}>
                      {Object.keys(OP_LABEL).map((k) => <option key={k} value={k}>{OP_LABEL[k]}</option>)}
                    </select>
                    <input className="jc-input" value={c.value} onChange={(e) => setCond(c.id, 'value', e.target.value)} placeholder="valor" />
                    <button className="jc-iconbtn" style={{ width: 32, height: 32 }} onClick={() => delCond(c.id)}><CmsIcon name="trash" /></button>
                  </div>
                ))}
              </div>
              <Button variant="ghost" icon="plus" size="sm" onClick={addCond}>Agregar condición</Button>

              <SectionHeader icon="rules" label="Si no se cumple" />
              <div className="jc-seg jc-seg--sm">
                <button className={rule.fallback === 'hide' ? 'is-active' : ''} onClick={() => setFallback('hide')}>Ocultar sección</button>
                <button className={rule.fallback === 'show_fallback' ? 'is-active' : ''} onClick={() => setFallback('show_fallback')}>Mostrar fallback</button>
              </div>

              <div style={{ marginTop: 18, display: 'flex', gap: 10 }}>
                <Button variant="green" icon="save">Guardar regla</Button>
                <Button variant="ghost" icon="eye">Probar</Button>
              </div>
            </>
          ) : <p className="jc-help">Selecciona una regla.</p>}
        </div>
      </div>
    </div>
  )
}
