import { Link } from 'react-router-dom'
import PageHero from '@/components/PageHero'
import Icon, { type IconName } from '@/components/Icon'

const values: { icon: IconName; title: string; text: string }[] = [
  { icon: 'handshake', title: 'Cercanía', text: 'Acompañamos cada proyecto, desde un arreglo en casa hasta una gran obra.' },
  { icon: 'medal', title: 'Calidad', text: 'Trabajamos con las mejores marcas y respaldamos cada producto.' },
  { icon: 'bolt', title: 'Eficiencia', text: 'Logística propia para entregar rápido y a tiempo en todo Chile.' },
  { icon: 'leaf', title: 'Sostenibilidad', text: 'Promovemos productos eficientes y un consumo responsable.' },
]

const stats = [
  { n: '+15.000', l: 'Productos' },
  { n: '4', l: 'Tiendas' },
  { n: '+60', l: 'Marcas' },
  { n: '+500k', l: 'Clientes' },
]

export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="Quiénes somos"
        title="Construimos junto a Chile"
        icon="🏗️"
        subtitle="Mimbral es la tienda de construcción y mejoramiento del hogar que atiende tanto a personas como a empresas, con cobertura nacional."
      />
      <div className="container">
        <section className="about-stats">
          {stats.map((s) => (
            <div className="stat" key={s.l}>
              <strong>{s.n}</strong>
              <span>{s.l}</span>
            </div>
          ))}
        </section>

        <section className="row">
          <h2 className="section-title">Nuestros valores</h2>
          <div className="about-values">
            {values.map((v) => (
              <article className="value-card" key={v.title}>
                <span className="value-card__icon"><Icon name={v.icon} /></span>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="aboutitem" id="proveedores">
          <h2 className="section-title">Proveedores</h2>
          <p>
            Trabajamos con más de 60 marcas líderes y buscamos constantemente nuevos
            socios que compartan nuestros estándares de calidad y servicio. Si quieres
            ser proveedor de Mimbral, escríbenos a <a href="mailto:proveedores@mimbral.cl">proveedores@mimbral.cl</a> con
            tu catálogo y condiciones comerciales.
          </p>
        </section>

        <section className="aboutitem" id="sustentabilidad">
          <h2 className="section-title">Sustentabilidad</h2>
          <p>
            Promovemos un consumo responsable: priorizamos productos eficientes,
            reducimos el uso de embalajes y optimizamos nuestra logística para bajar
            la huella de cada entrega. Creemos que construir mejor también significa
            construir de forma más sostenible.
          </p>
        </section>

        <section className="ctaband">
          <div>
            <h2>¿Tienes una empresa o proyecto grande?</h2>
            <p>Conoce los beneficios de comprar con Mimbral Empresas.</p>
          </div>
          <div className="ctaband__actions">
            <Link to="/empresas" className="btn btn--primary btn--lg">Ir al Portal Empresas</Link>
            <Link to="/trabaja-con-nosotros" className="btn btn--ghost btn--lg">Trabaja con nosotros</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
