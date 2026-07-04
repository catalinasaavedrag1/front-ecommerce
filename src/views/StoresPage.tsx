import PageHero from '@/components/PageHero'
import Icon from '@/components/Icon'

interface Store {
  name: string
  address: string
  city: string
  hours: string
  phone: string
  services: string[]
}

const stores: Store[] = [
  {
    name: 'Mimbral La Florida',
    address: 'Av. Vicuña Mackenna 7500',
    city: 'La Florida, Santiago',
    hours: 'Lun a Dom · 08:30 – 21:00',
    phone: '+56 2 2890 1000',
    services: ['Retiro en tienda', 'Corte de madera', 'Despacho', 'Patio constructor'],
  },
  {
    name: 'Mimbral Concepción',
    address: 'Autopista Concepción-Talcahuano 8900',
    city: 'Concepción, Biobío',
    hours: 'Lun a Dom · 09:00 – 21:00',
    phone: '+56 41 245 1000',
    services: ['Retiro en tienda', 'Despacho', 'Patio constructor'],
  },
  {
    name: 'Mimbral CD Santiago (Mayoristas)',
    address: 'Camino a Melipilla 12000',
    city: 'Maipú, Santiago',
    hours: 'Lun a Vie · 08:00 – 18:00',
    phone: '+56 2 2890 2000',
    services: ['Venta empresas', 'Despacho a faena', 'Grandes volúmenes'],
  },
  {
    name: 'Mimbral Antofagasta',
    address: 'Av. Pedro Aguirre Cerda 11000',
    city: 'Antofagasta',
    hours: 'Lun a Dom · 09:00 – 21:00',
    phone: '+56 55 245 3000',
    services: ['Retiro en tienda', 'Despacho', 'Patio constructor'],
  },
]

export default function StoresPage() {
  return (
    <div>
      <PageHero
        eyebrow="Cobertura nacional"
        title="Nuestras tiendas"
        icon="🏬"
        subtitle="Encuentra tu Mimbral más cercano, horarios y servicios disponibles."
      />
      <div className="container">
        <div className="stores">
          {stores.map((s) => (
            <article className="storecard" key={s.name}>
              <div className="storecard__map" aria-hidden>
                <Icon name="map" />
              </div>
              <div className="storecard__body">
                <h3>{s.name}</h3>
                <p className="storecard__addr">
                  <Icon name="pin" /> {s.address}, {s.city}
                </p>
                <p className="storecard__row"><Icon name="clock" /> {s.hours}</p>
                <p className="storecard__row"><Icon name="phone" /> {s.phone}</p>
                <div className="storecard__services">
                  {s.services.map((sv) => (
                    <span key={sv}>{sv}</span>
                  ))}
                </div>
                <a className="link-btn" href="#mapa">Cómo llegar →</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
