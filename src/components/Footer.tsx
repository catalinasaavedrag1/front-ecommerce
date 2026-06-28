import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'

export default function Footer() {
  const [news, setNews] = useState<'idle' | 'sending' | 'done'>('idle')

  const onNews = (e: FormEvent) => {
    e.preventDefault()
    if (news !== 'idle') return
    setNews('sending')
    setTimeout(() => setNews('done'), 700)
  }

  return (
    <footer className="footer">
      <div className="footer__news">
        <div className="footer__news-text">
          <strong>Recibe ofertas y novedades</strong>
          <span>Suscríbete y entérate antes de nuestras promociones.</span>
        </div>
        {news === 'done' ? (
          <p className="footer__news-ok"><Icon name="check" /> ¡Listo! Te suscribiste correctamente.</p>
        ) : (
          <form className="footer__news-form" onSubmit={onNews}>
            <input type="email" placeholder="Tu correo electrónico" aria-label="Correo" required disabled={news === 'sending'} />
            <button type="submit" className="btn btn--primary" disabled={news === 'sending'}>
              {news === 'sending' ? 'Enviando…' : 'Suscribirme'}
            </button>
          </form>
        )}
      </div>
      <div className="footer__grid footer__grid--slim">
        <details className="footer__acc">
          <summary>Empresas (B2B)<Icon name="chevron" className="footer__acc-chev" /></summary>
          <ul className="footer__acc-body">
            <li><Link to="/cotizacion">Solicitar cotización</Link></li>
            <li><Link to="/empresas/credito">Línea de crédito Mimbral</Link></li>
            <li><a href="#licitaciones">Licitaciones y grandes obras</a></li>
          </ul>
        </details>
        <details className="footer__acc">
          <summary>Mimbral<Icon name="chevron" className="footer__acc-chev" /></summary>
          <div className="footer__acc-body">
            <p className="footer__about">
              Todo para la construcción y el mejoramiento del hogar. Atendemos a
              personas y empresas en todo Chile.
            </p>
            <div className="footer__quick">
              <Link to="/nosotros">Quiénes somos</Link>
            </div>
          </div>
        </details>
        <details className="footer__acc">
          <summary>Medios de pago<Icon name="chevron" className="footer__acc-chev" /></summary>
          <div className="footer__acc-body footer__pay">
            <span>Tarjetas</span>
            <span>Transferencia</span>
            <span>Crédito B2B</span>
            <span>Webpay</span>
          </div>
        </details>
      </div>
      <div className="footer__legal">
        <span>© {new Date().getFullYear()} Mimbral SpA · Demo de e-commerce</span>
        <span>RUT 76.000.000-0 · Santiago de Chile</span>
      </div>
    </footer>
  )
}
