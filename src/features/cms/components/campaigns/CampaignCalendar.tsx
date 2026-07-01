'use client'

import { useState } from 'react'
import { campaigns } from '@/features/cms/mocks'
import { CHANNEL_LABEL, STATUS_META, type Tone } from '@/features/cms/constants'
import { Button, CmsIcon, PageHeader, Pill } from '@/features/cms/components/ui'

// Vista mock: julio–octubre 2026 en timeline de barras por campaña.
const MONTHS = ['Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
const MONTH_START = 6 // julio = mes 6 (0-index)

function monthIndex(iso: string) { return iso ? Number(iso.slice(5, 7)) - 1 : MONTH_START }

const toneOf = (t: Tone) => (t === 'success' ? 'var(--jc-green)' : t === 'warning' ? 'var(--jc-orange)' : t === 'brand' ? 'var(--jc-blue)' : t === 'danger' ? 'var(--jc-red)' : '#9aa4b2')

export function CampaignCalendar() {
  const [view, setView] = useState<'timeline' | 'list'>('timeline')

  return (
    <div>
      <PageHeader
        eyebrow="Marketing & SEO"
        title="Calendario editorial"
        subtitle="Campañas activas y programadas, conflictos entre campañas y contenido que vence, en timeline mensual."
        actions={
          <div className="jc-seg">
            {(['timeline', 'list'] as const).map((v) => <button key={v} className={view === v ? 'is-active' : ''} onClick={() => setView(v)}>{v === 'timeline' ? 'Timeline' : 'Lista'}</button>)}
          </div>
        }
      />

      {view === 'timeline' ? (
        <div className="jc-card jc-card--pad" style={{ overflowX: 'auto' }}>
          <div className="jc-cal">
            <div className="jc-cal__head">
              <span />
              {MONTHS.map((m) => <span key={m} className="jc-cal__month">{m} 2026</span>)}
            </div>
            {campaigns.map((c) => {
              const start = monthIndex(c.startAt) - MONTH_START
              const end = monthIndex(c.endAt) - MONTH_START
              const from = Math.max(0, start)
              const span = Math.max(1, Math.min(MONTHS.length, end + 1) - from)
              return (
                <div className="jc-cal__row" key={c.id}>
                  <span className="jc-cal__name">{c.name}<small>{CHANNEL_LABEL[c.channel]}</small></span>
                  <div className="jc-cal__track">
                    <div className="jc-cal__bar" style={{ gridColumn: `${from + 1} / span ${span}`, background: toneOf(STATUS_META[c.status].tone) }}>
                      {STATUS_META[c.status].label}{c.conflicts > 0 ? ' ⚠' : ''}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <p className="jc-help" style={{ marginTop: 14 }}><Pill tone="warning" soft>⚠ Conflicto</Pill> dos campañas compiten por el mismo espacio de home en el mismo período.</p>
        </div>
      ) : (
        <div className="jc-rows">
          {campaigns.map((c) => (
            <div key={c.id} className="jc-row" style={{ gridTemplateColumns: '1fr auto', borderLeftColor: toneOf(STATUS_META[c.status].tone) }}>
              <div><div className="jc-row__title">{c.name}</div><div className="jc-row__meta">{c.startAt} → {c.endAt} · {CHANNEL_LABEL[c.channel]}</div></div>
              <Button variant="ghost" icon="calendar" size="sm">Ver</Button>
            </div>
          ))}
        </div>
      )}
      <p className="jc-help" style={{ marginTop: 12 }}><CmsIcon name="calendar" /> Vistas mensual / semanal / timeline / lista, por canal y responsable.</p>
    </div>
  )
}
