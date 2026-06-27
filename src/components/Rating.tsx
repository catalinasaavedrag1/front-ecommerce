interface Props {
  value: number
  reviews?: number
}

export default function Rating({ value, reviews }: Props) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <span className="rating" title={`${value} de 5`}>
      <span className="rating__stars" aria-hidden>
        {Array.from({ length: 5 }, (_, i) => {
          if (i < full) return '★'
          if (i === full && half) return '⯨'
          return '☆'
        }).join('')}
      </span>
      {reviews !== undefined && <span className="rating__count">({reviews})</span>}
    </span>
  )
}
