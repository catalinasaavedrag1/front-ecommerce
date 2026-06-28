import { useState, type FormEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'

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
      {/* Barra de ayuda superior */}
      <div className="footer__help">
        <div className="footer__help-item"><Icon name="headset" /><div><strong>¿Necesitas ayuda?</strong><span>Lun a Dom · <Link to="/ayuda">Centro de ayuda</Link></span></div></div>
        <div className="footer__help-item"><Icon name="phone" /><div><strong>600 600 0000</strong><span>Atención telefónica</span></div></div>
        <div className="footer__help-item"><Icon name="truck" /><div><strong>Sigue tu pedido</strong><span><Link to="/seguimiento">Ver estado de mi compra</Link></span></div></div>
      </div>

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

      <div className="footer__grid footer__grid--slim">
        <Acc title="Servicio al cliente">
          <ul>
            <li><Link to="/ayuda">Ayuda y preguntas frecuentes</Link></li>
            <li><Link to="/seguimiento">Seguimiento de pedido</Link></li>
            <li><a href="#cambios">Cambios y devoluciones</a></li>
            <li><Link to="/tiendas">Nuestras tiendas</Link></li>
          </ul>
        </Acc>
        <Acc title="Empresas (B2B)">
          <ul>
            <li><Link to="/empresas">Portal Empresas</Link></li>
            <li><Link to="/cotizacion">Solicitar cotización</Link></li>
            <li><Link to="/empresas/credito">Línea de crédito Mimbral</Link></li>
            <li><a href="#licitaciones">Licitaciones y grandes obras</a></li>
          </ul>
        </Acc>
        <Acc title="Mimbral">
          <ul>
            <li><Link to="/nosotros">Quiénes somos</Link></li>
            <li><a href="#trabaja">Trabaja con nosotros</a></li>
            <li><a href="#sustentabilidad">Sustentabilidad</a></li>
            <li><a href="#prensa">Sala de prensa</a></li>
          </ul>
        </Acc>
        <Acc title="Medios de pago">
          <div className="footer__pay">
            <span>Tarjetas</span><span>Transferencia</span><span>Crédito B2B</span><span>Webpay</span>
          </div>
        </Acc>
      </div>

      <div className="footer__social">
        <span>Síguenos</span>
        <a href="#instagram" aria-label="Instagram"><Icon name="sparkle" /></a>
        <a href="#facebook" aria-label="Facebook"><Icon name="users" /></a>
        <a href="#youtube" aria-label="YouTube"><Icon name="bolt" /></a>
        <a href="#whatsapp" aria-label="WhatsApp"><Icon name="whatsapp" /></a>
      </div>

      <div className="footer__legal">
        <span>© {new Date().getFullYear()} Mimbral SpA · Demo de e-commerce</span>
        <span>RUT 76.000.000-0 · Santiago de Chile</span>
      </div>
    </footer>
  )
}
