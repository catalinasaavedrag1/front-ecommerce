import { Link } from 'react-router-dom'
import { categories } from '@/data/products'

export default function Footer() {
  return (
    <footer className="footer">
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
            <li><a href="#credito">Línea de crédito Mimbral</a></li>
            <li><a href="#licitaciones">Licitaciones y grandes obras</a></li>
          </ul>
        </div>
        <div>
          <h4>Servicio al cliente</h4>
          <ul>
            <li><a href="#seguimiento">Seguimiento de pedido</a></li>
            <li><a href="#despacho">Despacho y retiro</a></li>
            <li><a href="#devoluciones">Cambios y devoluciones</a></li>
            <li><a href="#garantia">Garantías</a></li>
          </ul>
        </div>
        <div>
          <h4>Mimbral</h4>
          <p className="footer__about">
            Todo para la construcción y el mejoramiento del hogar. Atendemos a
            personas y empresas en todo Chile.
          </p>
          <div className="footer__pay">
            <span>💳 Tarjetas</span>
            <span>🏦 Transferencia</span>
            <span>🧾 Crédito B2B</span>
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
