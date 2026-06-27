export function ProductCardSkeleton() {
  return (
    <div className="skcard" aria-hidden>
      <div className="skcard__media sk" />
      <div className="skcard__body">
        <div className="sk sk-line" style={{ width: '40%' }} />
        <div className="sk sk-line" style={{ width: '90%' }} />
        <div className="sk sk-line" style={{ width: '70%' }} />
        <div className="sk sk-line sk-line--lg" style={{ width: '50%' }} />
        <div className="sk sk-btn" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid" aria-busy="true" aria-label="Cargando productos">
      {Array.from({ length: count }, (_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
