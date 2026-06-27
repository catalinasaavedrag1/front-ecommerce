import { Link } from 'react-router-dom'
import { categories } from '@/data/products'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__news">
        <div className="footer__news-text">
          <strong>Recibe ofertas y novedades</strong>
          <span>Suscríbete y entérate antes de nuestras promociones.</span>
        </div>
        <form className="footer__news-form" onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="Tu correo electrónico" aria-label="Correo" required />
          <button type="submit" className="btn btn--primary">Suscribirme</button>
        </form>
      </div>
      <div className="footer__grid">
        <div>
          <h4>Categorías</h4>
          <ul>
            {categories.slice(0, 5).map((c) => (
              <li key={c.id}>
                <Link to={`/categoria/${c.slug}`}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Empresas (B2B)</h4>
          <ul>
            <li><Link to="/empresas">Portal Empresas</Link></li>
            <li><Link to="/cotizacion">Solicitar cotización</Link></li>
            <li><Link to="/empresas/credito">Línea de crédito Mimbral</Link></li>
            <li><a href="#licitaciones">Licitaciones y grandes obras</a></li>
          </ul>
        </div>
        <div>
          <h4>Servicio al cliente</h4>
          <ul>
            <li><Link to="/seguimiento">Seguimiento de pedido</Link></li>
            <li><Link to="/ayuda">Ayuda y preguntas frecuentes</Link></li>
            <li><Link to="/tiendas">Nuestras tiendas</Link></li>
            <li><Link to="/nosotros">Quiénes somos</Link></li>
          </ul>
        </div>
        <div>
          <h4>Mimbral</h4>
          <p className="footer__about">
            Todo para la construcción y el mejoramiento del hogar. Atendemos a
            personas y empresas en todo Chile.
          </p>
          <div className="footer__quick">
            <Link to="/ofertas">Ofertas</Link>
            <Link to="/inspiracion">Inspiración</Link>
          </div>
          <div className="footer__pay">
            <span>Tarjetas</span>
            <span>Transferencia</span>
            <span>Crédito B2B</span>
            <span>Webpay</span>
          </div>
        </div>
      </div>
      <div className="footer__legal">
        <span>© {new Date().getFullYear()} Mimbral SpA · Demo de e-commerce</span>
        <span>RUT 76.000.000-0 · Santiago de Chile</span>
      </div>
    </footer>
  )
}
