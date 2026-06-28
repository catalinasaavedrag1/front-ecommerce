import { Link } from 'react-router-dom'
import tiendaImg from '@/assets/mimbral-tienda.jpeg'

/** Bloque promocional del Patio Constructor, antes del footer.
 *  Imagen con overlay, texto corto y CTA; altura controlada. */
export default function PatioConstructorBanner() {
  return (
    <div className="pcbanner-wrap">
      <section className="pcbanner" aria-label="Patio Constructor Mimbral">
        <img src={tiendaImg} alt="" className="pcbanner__img" loading="lazy" />
        <span className="pcbanner__overlay" aria-hidden />
        <div className="pcbanner__content">
          <span className="pcbanner__eyebrow">Patio Constructor</span>
          <h2 className="pcbanner__title">Todo para tu obra en un solo lugar</h2>
          <p className="pcbanner__desc">Materiales, maderas, cemento, fierro, plomería y pinturas, con despacho y retiro en tienda.</p>
          <Link to="/tiendas" className="btn btn--primary pcbanner__cta">Conoce el Patio Constructor</Link>
        </div>
      </section>
    </div>
  )
}
