import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getProduct } from '@/data/products'
import ProductImage from './ProductImage'
import { formatCLP } from '@/utils/format'

export interface Slide {
  id: string
  bg: string
  eyebrow: string
  title: string
  ctaLabel: string
  ctaTo: string
  productId?: string
  discount?: number
}

export default function HeroCarousel({ slides }: { slides: Slide[] }) {
  const [i, setI] = useState(0)
  const n = slides.length

  useEffect(() => {
    if (n <= 1) return
    const t = setInterval(() => setI((v) => (v + 1) % n), 5500)
    return () => clearInterval(t)
  }, [n])

  const go = (d: number) => setI((v) => (v + d + n) % n)

  return (
    <section className="carousel" aria-roledescription="carrusel">
      <div className="carousel__track" style={{ transform: `translateX(-${i * 100}%)` }}>
        {slides.map((s) => {
          const product = s.productId ? getProduct(s.productId) : undefined
          return (
            <div className="slide" key={s.id} style={{ background: s.bg }}>
              <div className="slide__content">
                <span className="slide__eyebrow">{s.eyebrow}</span>
                <h2 className="slide__title">{s.title}</h2>
                {product && (
                  <div className="slide__price">
                    <span className="slide__now">{formatCLP(product.retailOffer ?? product.retailPrice)}</span>
                    {product.retailOffer && <span className="slide__was">{formatCLP(product.retailPrice)}</span>}
                  </div>
                )}
                <Link to={s.ctaTo} className="btn btn--primary btn--lg slide__cta">{s.ctaLabel}</Link>
                <span className="slide__webpay">Webpay · 12 cuotas sin interés</span>
              </div>
              <div className="slide__art">
                {product ? <ProductImage product={product} className="slide__img" /> : null}
                {s.discount ? (
                  <span className="slide__dcto"><strong>{s.discount}%</strong><span>DE DCTO.</span></span>
                ) : null}
              </div>
            </div>
          )
        })}
      </div>

      {n > 1 && (
        <>
          <button className="carousel__nav carousel__nav--prev" onClick={() => go(-1)} aria-label="Anterior">‹</button>
          <button className="carousel__nav carousel__nav--next" onClick={() => go(1)} aria-label="Siguiente">›</button>
          <div className="carousel__dots">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                className={`carousel__dot ${idx === i ? 'is-active' : ''}`}
                onClick={() => setI(idx)}
                aria-label={`Ir al slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
