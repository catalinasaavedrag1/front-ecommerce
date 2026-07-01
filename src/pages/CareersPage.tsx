import { Link } from 'react-router-dom'
import PageHero from '@/components/PageHero'
import Icon, { type IconName } from '@/components/Icon'

const PERKS: { icon: IconName; title: string; text: string }[] = [
  { icon: 'trend', title: 'Crecimiento real', text: 'Planes de carrera y capacitación continua en todas las áreas.' },
  { icon: 'handshake', title: 'Buen ambiente', text: 'Equipos cercanos que se apoyan y celebran los logros juntos.' },
  { icon: 'shield', title: 'Estabilidad', text: 'Somos una empresa sólida con presencia nacional y en crecimiento.' },
  { icon: 'heart', title: 'Beneficios', text: 'Convenios, descuentos de colaborador y bienestar para tu familia.' },
]

const JOBS: { title: string; area: string; place: string }[] = [
  { title: 'Vendedor(a) integral de tienda', area: 'Retail', place: 'La Florida, RM' },
  { title: 'Asesor(a) Patio Constructor', area: 'Retail', place: 'Concepción' },
  { title: 'Ejecutivo(a) de cuentas Empresas', area: 'Comercial B2B', place: 'Santiago Centro' },
  { title: 'Analista de logística', area: 'Cadena de suministro', place: 'CD Santiago' },
  { title: 'Desarrollador(a) Frontend', area: 'Tecnología', place: 'Híbrido · Santiago' },
]

export default function CareersPage() {
  return (
    <div>
      <PageHero
        eyebrow="Trabaja con nosotros"
        title="Construye tu carrera en Mimbral"
        subtitle="Buscamos personas con ganas de aprender y entregar la mejor atención a quienes construyen y mejoran su hogar."
      />
      <div className="container">
        <section className="row">
          <h2 className="section-title">Por qué trabajar con nosotros</h2>
          <div className="about-values">
            {PERKS.map((p) => (
              <article className="value-card" key={p.title}>
                <span className="value-card__icon"><Icon name={p.icon} /></span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="row">
          <h2 className="section-title">Vacantes abiertas</h2>
          <ul className="joblist">
            {JOBS.map((j) => (
              <li className="jobrow" key={j.title}>
                <div className="jobrow__info">
                  <strong>{j.title}</strong>
                  <span><Icon name="building" /> {j.area} · <Icon name="pin" /> {j.place}</span>
                </div>
                <Link to={`/contacto?asunto=Consulta general`} className="btn btn--ghost">Postular</Link>
              </li>
            ))}
          </ul>
          <p className="joblist__note">
            ¿No ves tu cargo? Envíanos tu CV a <a href="mailto:personas@mimbral.cl">personas@mimbral.cl</a> y te tendremos presente.
          </p>
        </section>
      </div>
    </div>
  )
}
