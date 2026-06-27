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

        <section className="ctaband">
          <div>
            <h2>¿Tienes una empresa o proyecto grande?</h2>
            <p>Conoce los beneficios de comprar con Mimbral Empresas.</p>
          </div>
          <Link to="/empresas" className="btn btn--primary btn--lg">Ir al Portal Empresas</Link>
        </section>
      </div>
    </div>
  )
}
