import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon, { type IconName } from '@/components/Icon'

type Store = { id: string; name: string; addr: string; comuna: string; open: boolean; hours: string }

const STORES: Store[] = [
  { id: 's1', name: 'Mimbral Santiago Centro', addr: "Av. L. B. O'Higgins 1234, Santiago", comuna: 'Santiago', open: true, hours: '08:30 a 20:30 horas' },
  { id: 's2', name: 'Mimbral Providencia', addr: 'Av. Providencia 2120, Providencia', comuna: 'Providencia', open: true, hours: '09:00 a 21:00 horas' },
  { id: 's3', name: 'Mimbral Maipú', addr: 'Av. Pajaritos 2890, Maipú', comuna: 'Maipú', open: true, hours: '09:00 a 21:00 horas' },
  { id: 's4', name: 'Mimbral La Florida', addr: 'Av. Vicuña Mackenna 7500, La Florida', comuna: 'La Florida', open: true, hours: '09:00 a 21:00 horas' },
  { id: 's5', name: 'Mimbral Las Condes', addr: 'Av. Las Condes 12422, Las Condes', comuna: 'Las Condes', open: true, hours: '09:00 a 21:00 horas' },
  { id: 's6', name: 'Mimbral Talca', addr: 'Plaza Maule, Av. 2 Norte 3344, Talca', comuna: 'Talca', open: true, hours: '08:30 a 20:30 horas' },
  { id: 's7', name: 'Mimbral Talca Colín', addr: 'Av. Colín 635, Talca', comuna: 'Talca', open: false, hours: '09:00 a 20:00 horas' },
  { id: 's8', name: 'Mimbral Concepción', addr: 'Autopista Concepción-Talcahuano 8900', comuna: 'Concepción', open: true, hours: '09:00 a 21:00 horas' },
  { id: 's9', name: 'Mimbral Rancagua', addr: 'Av. República de Chile 011, Rancagua', comuna: 'Rancagua', open: true, hours: '09:00 a 20:30 horas' },
  { id: 's10', name: 'Mimbral Viña del Mar', addr: 'Av. Limache 3119, Viña del Mar', comuna: 'Viña del Mar', open: true, hours: '09:00 a 21:00 horas' },
  { id: 's11', name: 'Mimbral Antofagasta', addr: 'Av. Antonio Rendic 6852, Antofagasta', comuna: 'Antofagasta', open: true, hours: '09:00 a 21:00 horas' },
  { id: 's12', name: 'Mimbral Valparaíso', addr: 'Yungay 2516, Valparaíso', comuna: 'Valparaíso', open: false, hours: '09:00 a 20:00 horas' },
]

const QUICK: { label: string; icon: IconName; to?: string; big?: boolean }[] = [
  { label: 'Buscador', icon: 'search', to: '/buscar', big: true },
  { label: 'Escáner', icon: 'scan', big: true },
  { label: 'Mapa', icon: 'map', to: '/tiendas' },
  { label: '¿Necesitas ayuda?', icon: 'headset', to: '/ayuda' },
  { label: 'Códigos de pago', icon: 'doc' },
]

const SERVICES: { label: string; icon: IconName }[] = [
  { label: 'Dimensionado de tableros', icon: 'maderas' },
  { label: 'Centro de proyectos', icon: 'doc' },
  { label: 'Arriendo de herramientas', icon: 'herramientas' },
  { label: 'Post venta', icon: 'chat' },
  { label: 'Venta empresa', icon: 'building' },
  { label: 'Patio constructor', icon: 'construccion' },
  { label: 'Preparado de pintura', icon: 'pinturas' },
  { label: 'Retiro en tienda', icon: 'box' },
  { label: 'Parking', icon: 'automovil' },
  { label: 'Cajas self-checkout', icon: 'card' },
  { label: 'Cafetería', icon: 'cocina' },
  { label: 'Cajero automático', icon: 'bank' },
]

export default function EnTiendaPage() {
  const [storeId, setStoreId] = useState('s6')
  const [picker, setPicker] = useState(false)
  const [query, setQuery] = useState('')
  const store = STORES.find((s) => s.id === storeId) ?? STORES[0]

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return STORES
    return STORES.filter((s) => s.name.toLowerCase().includes(q) || s.comuna.toLowerCase().includes(q) || s.addr.toLowerCase().includes(q))
  }, [query])

  return (
    <div className="entienda">
      <header className="et-hero">
        <span className="et-hero__eyebrow">Estás en modo en tienda:</span>
        <h1>{store.name}</h1>
        <p className="et-hero__addr">{store.addr}</p>
        <button className="et-hero__change" onClick={() => { setPicker(true); setQuery('') }}>Cambiar tienda</button>
        <div className="et-hero__status">
          <span className={`et-badge ${store.open ? 'is-open' : 'is-closed'}`}>{store.open ? 'Abierto' : 'Cerrado'}</span>
          <span className="et-hero__hours">Horario: {store.hours}</span>
        </div>
      </header>

      <div className="et-quick">
        {QUICK.map((q) => {
          const inner = (
            <>
              <span className="et-quick__ic"><Icon name={q.icon} /></span>
              <span className="et-quick__label">{q.label}</span>
            </>
          )
          const cls = `et-quick__card ${q.big ? 'et-quick__card--big' : ''}`
          return q.to
            ? <Link key={q.label} to={q.to} className={cls}>{inner}</Link>
            : <button key={q.label} className={cls}>{inner}</button>
        })}
      </div>

      <section className="et-services">
        <h2 className="section-title">Servicios en esta tienda</h2>
        <div className="et-services__grid">
          {SERVICES.map((s) => (
            <div className="et-service" key={s.label}>
              <span className="et-service__ic"><Icon name={s.icon} /></span>
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {picker && (
        <div className="et-picker">
          <header className="et-picker__head">
            <button className="et-picker__back" onClick={() => setPicker(false)} aria-label="Volver"><Icon name="chevron" className="ic--flip" /></button>
            <span className="et-picker__title">Elegir tienda</span>
            <button className="et-picker__close" onClick={() => setPicker(false)} aria-label="Cerrar"><Icon name="close" /></button>
          </header>
          <div className="et-picker__search">
            <Icon name="search" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar tienda" autoFocus />
          </div>
          <div className="et-picker__list">
            {filtered.map((s) => (
              <button key={s.id} className={`et-picker__item ${s.id === storeId ? 'is-active' : ''}`} onClick={() => { setStoreId(s.id); setPicker(false) }}>
                <strong>{s.name}</strong>
                <span>{s.addr}</span>
              </button>
            ))}
            {!filtered.length && <p className="et-picker__empty">No encontramos tiendas para “{query}”.</p>}
          </div>
        </div>
      )}
    </div>
  )
}
