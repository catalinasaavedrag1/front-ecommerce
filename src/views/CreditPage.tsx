import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import PageHero from '@/components/PageHero'
import Icon, { type IconName } from '@/components/Icon'

const benefits: { icon: IconName; title: string; text: string }[] = [
  { icon: 'wallet', title: 'Factura a 30/60/90 días', text: 'Ordena tu flujo de caja.' },
  { icon: 'trend', title: 'Cupo según historial', text: 'Aumenta tu línea con el tiempo.' },
  { icon: 'cart', title: 'Compra en línea o en tienda', text: 'Usa tu crédito donde quieras.' },
]

export default function CreditPage() {
  const [sent, setSent] = useState(false)

  if (sent) {
    return (
      <div className="container confirm">
        <div className="confirm__check"><Icon name="check" /></div>
        <h1>Solicitud recibida</h1>
        <p>Evaluaremos tu solicitud y un ejecutivo te contactará en 1-2 días hábiles.</p>
        <Link to="/empresas" className="btn btn--primary">Volver al portal</Link>
      </div>
    )
  }

  return (
    <div>
      <PageHero
        eyebrow="Mimbral Empresas"
        title="Línea de crédito para tu empresa"
        icon="🧾"
        subtitle="Compra ahora y paga después. Solicita tu cupo en pocos pasos."
        crumb="Línea de crédito"
      />
      <div className="container cat-layout">
        <aside className="filters">
          <h3>Beneficios</h3>
          <ul className="creditbenefits">
            {benefits.map((b) => (
              <li key={b.title}>
                <span className="creditbenefits__icon"><Icon name={b.icon} /></span>
                <div>
                  <strong>{b.title}</strong>
                  <span>{b.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </aside>
        <section>
          <form className="panel" onSubmit={(e: FormEvent) => { e.preventDefault(); setSent(true) }}>
            <h2>Solicitud de crédito</h2>
            <div className="formgrid">
              <label>Razón social<input required placeholder="Empresa Ltda." /></label>
              <label>RUT empresa<input required placeholder="76.123.456-7" /></label>
              <label>Giro<input placeholder="Construcción" /></label>
              <label>Años de operación<input type="number" min={0} placeholder="3" /></label>
              <label>Representante legal<input required placeholder="Nombre" /></label>
              <label>Email<input type="email" required placeholder="correo@empresa.cl" /></label>
              <label>Teléfono<input required placeholder="+56 9 ..." /></label>
              <label>Cupo solicitado (CLP)<input type="number" min={0} placeholder="5000000" /></label>
              <label className="formgrid__full">Comentarios<textarea rows={3} placeholder="Cuéntanos sobre tu empresa" /></label>
            </div>
            <label className="credit-check">
              <input type="checkbox" required /> Autorizo la evaluación comercial de mi empresa.
            </label>
            <button type="submit" className="btn btn--primary btn--block">Enviar solicitud</button>
          </form>
        </section>
      </div>
    </div>
  )
}
