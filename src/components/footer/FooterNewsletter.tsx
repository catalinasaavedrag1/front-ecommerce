import { useState, type FormEvent } from 'react'
import Icon from '@/components/Icon'

/** Newsletter compacto: texto a la izquierda, input + botón a la derecha. */
export default function FooterNewsletter() {
  const [news, setNews] = useState<'idle' | 'sending' | 'done'>('idle')
  const onNews = (e: FormEvent) => {
    e.preventDefault()
    if (news !== 'idle') return
    setNews('sending')
    setTimeout(() => setNews('done'), 700)
  }

  return (
    <div className="ft-news">
      <div className="ft-news__text">
        <strong>Recibe ofertas y novedades</strong>
        <span>Promociones, herramientas y materiales para tus proyectos.</span>
      </div>
      {news === 'done' ? (
        <p className="ft-news__ok" role="status"><Icon name="check" /> ¡Listo! Te suscribiste correctamente.</p>
      ) : (
        <form className="ft-news__form" onSubmit={onNews}>
          <input type="email" inputMode="email" autoComplete="email" placeholder="Tu correo electrónico" aria-label="Correo electrónico" required disabled={news === 'sending'} />
          <button type="submit" className="btn btn--primary" disabled={news === 'sending'}>{news === 'sending' ? 'Enviando…' : 'Suscribirme'}</button>
        </form>
      )}
    </div>
  )
}
