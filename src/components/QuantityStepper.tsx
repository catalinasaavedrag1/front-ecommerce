interface Props {
  value: number
  min?: number
  max?: number
  onChange: (n: number) => void
  size?: 'sm' | 'md'
  ariaLabel?: string
}

/** Selector de cantidad compacto y reutilizable. */
export default function QuantityStepper({ value, min = 1, max = 99, onChange, size = 'md', ariaLabel = 'Cantidad' }: Props) {
  return (
    <div className={`qstep qstep--${size}`} role="group" aria-label={ariaLabel}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min} aria-label="Restar">−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max} aria-label="Sumar">+</button>
    </div>
  )
}
