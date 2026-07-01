import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { STATUS_META, type Tone } from '@/features/cms/constants'
import type { CmsStatus, LoadState } from '@/features/cms/types'
import { CmsIcon, type CmsIconName } from './CmsIcon'

export { CmsIcon } from './CmsIcon'
export type { CmsIconName } from './CmsIcon'

/* ------------------------------- Button ------------------------------- */
type BtnVariant = 'green' | 'blue' | 'ghost' | 'outline-green' | 'danger'
interface BtnProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant
  icon?: CmsIconName
  size?: 'sm' | 'md'
}
export function Button({ variant = 'ghost', icon, size = 'md', children, className, ...rest }: BtnProps) {
  return (
    <button className={`jc-btn jc-btn--${variant} ${size === 'sm' ? 'jc-btn--sm' : ''} ${className ?? ''}`} {...rest}>
      {icon && <CmsIcon name={icon} />}
      {children}
    </button>
  )
}

export function IconButton({ icon, className, ...rest }: { icon: CmsIconName } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={`jc-iconbtn ${className ?? ''}`} {...rest}>
      <CmsIcon name={icon} />
    </button>
  )
}

/* ------------------------------- Pills -------------------------------- */
export function Pill({ tone, children, soft }: { tone: Tone; children: ReactNode; soft?: boolean }) {
  return <span className={`jc-pill ${soft ? 'jc-pill--soft' : ''} jc-pill--${tone}`}>{children}</span>
}

export function StatusPill({ status, soft }: { status: CmsStatus; soft?: boolean }) {
  const meta = STATUS_META[status]
  return <Pill tone={meta.tone} soft={soft}>{meta.label}</Pill>
}

/* ---------------------------- Page header ----------------------------- */
export function PageHeader({
  eyebrow,
  title,
  status,
  subtitle,
  actions,
}: {
  eyebrow?: string
  title: string
  status?: CmsStatus
  subtitle?: string
  actions?: ReactNode
}) {
  return (
    <header className="jc-ph">
      <div>
        {eyebrow && <span className="jc-ph__eyebrow">{eyebrow}</span>}
        <div className="jc-ph__titlerow">
          <h1 className="jc-ph__title">{title}</h1>
          {status && <StatusPill status={status} />}
        </div>
        {subtitle && <p className="jc-ph__sub">{subtitle}</p>}
      </div>
      {actions && <div className="jc-ph__actions">{actions}</div>}
    </header>
  )
}

/* -------------------------------- Tabs -------------------------------- */
export function Tabs({ items, active }: { items: { key: string; label: string; icon?: CmsIconName }[]; active: string }) {
  return (
    <nav className="jc-tabs">
      {items.map((t) => (
        <span key={t.key} className={`jc-tab ${t.key === active ? 'is-active' : ''}`}>
          {t.icon && <CmsIcon name={t.icon} />}
          {t.label}
        </span>
      ))}
    </nav>
  )
}

/* --------------------------- Section header --------------------------- */
export function SectionHeader({ icon, label }: { icon: CmsIconName; label: string }) {
  return (
    <div className="jc-section">
      <CmsIcon name={icon} className="jc-section__ic" />
      <span className="jc-section__label">{label}</span>
      <span className="jc-section__rule" />
    </div>
  )
}

/* -------------------------------- Field ------------------------------- */
export function Field({ label, children, help }: { label: string; children: ReactNode; help?: string }) {
  return (
    <div className="jc-field">
      <span className="jc-field__label">{label}</span>
      <div className="jc-field__control">
        {children}
        {help && <span className="jc-help">{help}</span>}
      </div>
    </div>
  )
}

/* ------------------------------- Avatar ------------------------------- */
export function Avatar({ name, color }: { name: string; color?: string }) {
  const initials = name.split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase()
  return <span className="jc-avatar" style={color ? { background: color } : undefined}>{initials}</span>
}

/* ------------------------------- KPIs --------------------------------- */
export function KpiCard({ icon, tone, value, label, hint }: { icon: CmsIconName; tone: string; value: ReactNode; label: string; hint?: string }) {
  return (
    <div className="jc-kpi">
      <span className={`jc-kpi__ic jc-kpi__ic--${tone}`}><CmsIcon name={icon} /></span>
      <div>
        <div className="jc-kpi__value">{value}</div>
        <div className="jc-kpi__label">{label}</div>
        {hint && <div className="jc-kpi__hint">{hint}</div>}
      </div>
    </div>
  )
}

/* --------------------------- Empty / states --------------------------- */
export function EmptyState({ icon = 'sections', title, description, action }: { icon?: CmsIconName; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="jc-empty">
      <div className="jc-empty__ic"><CmsIcon name={icon} /></div>
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  )
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="jc-rows">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="jc-row" key={i} style={{ gridTemplateColumns: '1fr' }}>
          <div className="jc-skel" style={{ height: 22, width: `${40 + (i % 3) * 15}%` }} />
        </div>
      ))}
    </div>
  )
}

/** Renderiza el estado correcto de un recurso (loading/error/empty/success). */
export function ResourceState({
  state,
  error,
  empty,
  children,
  skeleton,
}: {
  state: LoadState
  error?: string | null
  empty: ReactNode
  children: ReactNode
  skeleton?: ReactNode
}) {
  if (state === 'loading') return <>{skeleton ?? <ListSkeleton />}</>
  if (state === 'error') {
    return (
      <div className="jc-errbox">
        <CmsIcon name="warning" /> No pudimos cargar la información. {error ? `(${error})` : ''}
      </div>
    )
  }
  if (state === 'empty') return <>{empty}</>
  return <>{children}</>
}

/* ----------------------------- Pagination ----------------------------- */
export function Pagination({ total, perPage = 60, page = 1 }: { total: number; perPage?: number; page?: number }) {
  const pages = Math.max(1, Math.ceil(total / perPage))
  return (
    <div className="jc-pager">
      <span>{total} resultados · {perPage} por página</span>
      <div className="jc-pager__nav">
        <button className="jc-pager__btn" disabled={page <= 1}><CmsIcon name="chevron" className="jc-flip" /></button>
        {Array.from({ length: Math.min(pages, 3) }).map((_, i) => (
          <span key={i} className={`jc-pager__page ${i + 1 === page ? 'is-active' : ''}`}>{i + 1}</span>
        ))}
        <button className="jc-pager__btn" disabled={page >= pages}><CmsIcon name="chevron" /></button>
      </div>
      <span style={{ width: 120 }} />
    </div>
  )
}
