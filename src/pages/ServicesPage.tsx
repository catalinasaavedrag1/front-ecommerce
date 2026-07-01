import { Link } from 'react-router-dom'
import PageHero from '@/components/PageHero'
import Icon, { type IconName } from '@/components/Icon'

type Service = {
  id: string
  icon: IconName
  title: string
  desc: string
  cta: { label: string; to: string }
}

const SERVICES: Service[] = [
  {
    id: 'retiro',
    icon: 'store',
    title: 'Retiro en tienda',
    desc: 'Compra online y retira el mismo día en la sucursal que elijas. Te avisamos por correo cuando tu pedido esté listo.',
    cta: { label: 'Cómo retirar', to: '/en-tienda' },
  },
  {
    id: 'despacho',
    icon: 'truck',
    title: 'Despacho a domicilio',
    desc: 'Logística propia con cobertura nacional. En el checkout ves la fecha estimada y el costo antes de pagar.',
    cta: { label: 'Ver políticas de despacho', to: '/legal/despacho' },
  },
  {
    id: 'arriendo',
    icon: 'herramientas',
    title: 'Arriendo de herramientas',
    desc: 'Taladros, andamios, mezcladoras y más por día o semana. Ideal para trabajos puntuales sin invertir en equipo.',
    cta: { label: 'Consultar disponibilidad', to: '/contacto?asunto=Consulta general' },
  },
  {
    id: 'corte',
    icon: 'maderas',
    title: 'Corte y dimensionado',
    desc: 'Cortamos tableros y maderas a la medida exacta de tu proyecto en nuestro Patio Constructor.',
    cta: { label: 'Pedir corte a medida', to: '/contacto?asunto=Consulta general' },
  },
  {
    id: 'patio',
    icon: 'construccion',
    title: 'Patio Constructor',
    desc: 'Área especializada en materiales de obra gruesa: cemento, fierro, áridos y despacho a faena.',
    cta: { label: 'Ver tiendas con Patio', to: '/tiendas' },
  },
  {
    id: 'asesoria',
    icon: 'headset',
    title: 'Asesoría de proyecto',
    desc: 'Nuestros especialistas te ayudan a calcular materiales y elegir la mejor solución para tu obra.',
    cta: { label: 'Hablar con un asesor', to: '/contacto?asunto=Consulta general' },
  },
]

export default function ServicesPage() {
  return (
    <div>
      <PageHero
        eyebrow="Servicios"
        title="Servicios Mimbral"
        subtitle="Mucho más que una tienda: te acompañamos en cada etapa de tu proyecto, desde la compra hasta la entrega en obra."
      />
      <div className="container">
        <div className="svc-grid">
          {SERVICES.map((s) => (
            <article className="svc-card" id={s.id} key={s.id}>
              <span className="svc-card__ic"><Icon name={s.icon} /></span>
              <h2 className="svc-card__title">{s.title}</h2>
              <p className="svc-card__desc">{s.desc}</p>
              <Link to={s.cta.to} className="svc-card__cta">
                {s.cta.label} <Icon name="chevron" />
              </Link>
            </article>
          ))}
        </div>

        <section className="ctaband">
          <div>
            <h2>¿Tienes un proyecto grande?</h2>
            <p>Cotiza con precios de empresa y coordina despacho a faena.</p>
          </div>
          <Link to="/cotizacion" className="btn btn--primary btn--lg">Solicitar cotización</Link>
        </section>
      </div>
    </div>
  )
}
