'use client'

import { CmsIcon } from '@/features/cms/components/ui'

export interface FilterDef {
  key: string
  label: string
  type?: 'text' | 'select'
  placeholder?: string
  options?: { value: string; label: string }[]
}

/** Barra de filtros estilo Janis: campos con label + underline, dropdowns,
 *  rango de fechas opcional y acciones (Filtros N, refrescar, ordenar, columnas). */
export function FilterBar({
  fields,
  values,
  onChange,
  dateRange = false,
  onRefresh,
}: {
  fields: FilterDef[]
  values: Record<string, string>
  onChange: (key: string, value: string) => void
  dateRange?: boolean
  onRefresh?: () => void
}) {
  const active = fields.filter((f) => {
    const v = values[f.key]
    return v && v !== 'all' && v !== ''
  }).length

  return (
    <div className="jc-toolbar jc-filterbar">
      <div className="jc-filterbar__fields">
        {fields.map((f) => (
          <label className="jc-filter" key={f.key}>
            <span className="jc-filter__label">{f.label}</span>
            {f.type === 'select' ? (
              <select className="jc-filter__ctl" value={values[f.key] ?? ''} onChange={(e) => onChange(f.key, e.target.value)}>
                {(f.options ?? []).map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ) : (
              <input className="jc-filter__ctl" value={values[f.key] ?? ''} onChange={(e) => onChange(f.key, e.target.value)} placeholder={f.placeholder ?? 'Buscar…'} />
            )}
          </label>
        ))}
        {dateRange && (
          <label className="jc-filter jc-filter--date">
            <span className="jc-filter__label">Fecha</span>
            <div className="jc-daterange">
              <input type="date" className="jc-filter__ctl" aria-label="Fecha desde" />
              <CmsIcon name="chevron" />
              <input type="date" className="jc-filter__ctl" aria-label="Fecha hasta" />
            </div>
          </label>
        )}
      </div>

      <div className="jc-filterbar__actions">
        <button className="jc-filterpill" type="button">
          <CmsIcon name="filter" /> Filtros{active > 0 && <span className="jc-filterpill__n">{active}</span>}
        </button>
        <button className="jc-iconbtn" type="button" onClick={onRefresh} aria-label="Refrescar"><CmsIcon name="refresh" /></button>
        <button className="jc-iconbtn" type="button" aria-label="Ordenar"><CmsIcon name="sort" /></button>
        <button className="jc-iconbtn" type="button" aria-label="Editar columnas"><CmsIcon name="edit" /></button>
      </div>
    </div>
  )
}
