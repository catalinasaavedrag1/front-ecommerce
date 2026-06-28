import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import tiendaImg from '@/assets/mimbral-tienda.jpeg'

function Acc({ title, children }: { title: string; children: ReactNode }) {
  return (
    <details className="footer__acc">
      <summary>{title}<Icon name="chevron" className="footer__acc-chev" /></summary>
      <div className="footer__acc-body">{children}</div>
    </details>
  )
}

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
      {/* Tienda Mimbral */}
      <Link to="/tiendas" className="footer__store">
        <img src={tiendaImg} alt="Tienda Mimbral MTS · Patio Constructor" loading="lazy" />
        <span className="footer__store-cap">
          <strong>Visita nuestro Patio Constructor</strong>
          <span>Materiales, maderas, cemento, fierro, plomería y pinturas · <span className="footer__store-link">Ver tiendas</span></span>
        </span>
      </Link>

      {/* Barra de ayuda */}
      <div className="footer__help">
        <Link to="/ayuda" className="footer__help-item">
          <span className="footer__help-ic"><Icon name="headset" /></span>
          <div><strong>Centro de ayuda</strong><span>Atención de lunes a domingo</span></div>
        </Link>
        <a href="tel:6006000000" className="footer__help-item">
          <span className="footer__help-ic"><Icon name="phone" /></span>
          <div><strong>600 600 0000</strong><span>Atención telefónica</span></div>
        </a>
        <Link to="/seguimiento" className="footer__help-item">
          <span className="footer__help-ic"><Icon name="truck" /></span>
          <div><strong>Sigue tu pedido</strong><span>Revisa el estado de tu compra</span></div>
        </Link>
      </div>

      {/* Newsletter */}
      <div className="footer__news">
        <div className="footer__news-text">
          <strong>Recibe ofertas y novedades</strong>
          <span>Ofertas de construcción, herramientas y hogar antes que nadie.</span>
        </div>
        {news === 'done' ? (
          <p className="footer__news-ok"><Icon name="check" /> ¡Listo! Te suscribiste correctamente.</p>
        ) : (
          <form className="footer__news-form" onSubmit={onNews}>
            <input type="email" placeholder="Tu correo electrónico" aria-label="Correo" required disabled={news === 'sending'} />
            <button type="submit" className="btn btn--primary" disabled={news === 'sending'}>{news === 'sending' ? 'Enviando…' : 'Suscribirme'}</button>
          </form>
        )}
      </div>

      {/* Columnas de enlaces */}
      <nav className="footer__grid footer__grid--slim" aria-label="Enlaces del pie de página">
        <Acc title="Servicio al cliente">
          <ul>
            <li><Link to="/ayuda">Ayuda y preguntas frecuentes</Link></li>
            <li><Link to="/seguimiento">Seguimiento de pedido</Link></li>
            <li><Link to="/ayuda">Cambios y devoluciones</Link></li>
            <li><Link to="/ayuda">Medios de pago</Link></li>
          </ul>
        </Acc>
        <Acc title="Comprar">
          <ul>
            <li><Link to="/categorias">Todas las categorías</Link></li>
            <li><Link to="/ofertas">Ofertas</Link></li>
            <li><Link to="/en-tienda">Retiro en tienda</Link></li>
            <li><Link to="/tiendas">Nuestras tiendas</Link></li>
          </ul>
        </Acc>
        <Acc title="Empresas (B2B)">
          <ul>
            <li><Link to="/empresas">Portal Empresas</Link></li>
            <li><Link to="/cotizacion">Solicitar cotización</Link></li>
            <li><Link to="/empresas/credito">Línea de crédito Mimbral</Link></li>
            <li><Link to="/cotizacion">Licitaciones y grandes obras</Link></li>
          </ul>
        </Acc>
        <Acc title="Mimbral">
          <ul>
            <li><Link to="/nosotros">Quiénes somos</Link></li>
            <li><Link to="/nosotros">Trabaja con nosotros</Link></li>
            <li><Link to="/nosotros">Sustentabilidad</Link></li>
            <li><Link to="/nosotros">Sala de prensa</Link></li>
          </ul>
        </Acc>
      </nav>

      {/* Marca + redes + medios de pago */}
      <div className="footer__bottom">
        <Link to="/" className="footer__brand" aria-label="Mimbral inicio">
          <span className="footer__brand-mark" aria-hidden>
            <svg viewBox="0 0 44 40" width="100%" height="100%"><path d="M7 31 16 9h6L13 31z" fill="#173a8a" /><path d="M19 31 28 9h6l-9 22z" fill="#173a8a" /><path d="M31 31 37 16v15z" fill="#e1251b" /></svg>
          </span>
          <span className="footer__brand-text"><strong>Mimbral</strong><span>Construye y mejora tu hogar</span></span>
        </Link>

        <div className="footer__social">
          <span>Síguenos</span>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Icon name="sparkle" /></a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Icon name="users" /></a>
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Icon name="bolt" /></a>
          <a href="https://wa.me/56600600000" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><Icon name="whatsapp" /></a>
        </div>

        <div className="footer__pay">
          <span>Webpay</span><span>Tarjetas</span><span>Transferencia</span><span>Crédito B2B</span>
        </div>
      </div>

      {/* Legal */}
      <div className="footer__legal">
        <div className="footer__legal-links">
          <Link to="/ayuda">Términos y condiciones</Link>
          <Link to="/ayuda">Privacidad</Link>
          <Link to="/tiendas">Tiendas</Link>
        </div>
        <span>© {new Date().getFullYear()} Mimbral SpA · RUT 76.000.000-0 · Santiago de Chile · Demo de e-commerce</span>
      </div>
    </footer>
  )
}
