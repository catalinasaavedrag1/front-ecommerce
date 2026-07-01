import { Navigate, NavLink, useParams } from 'react-router-dom'
import PageHero from '@/components/PageHero'

type Doc = { slug: string; title: string; nav: string; updated: string; sections: { h: string; p: string }[] }

const DOCS: Doc[] = [
  {
    slug: 'terminos',
    title: 'Términos y condiciones',
    nav: 'Términos y condiciones',
    updated: 'Enero 2026',
    sections: [
      { h: '1. Aceptación', p: 'Al usar el sitio y comprar en Mimbral aceptas estas condiciones. Te recomendamos leerlas antes de realizar cualquier pedido.' },
      { h: '2. Precios y disponibilidad', p: 'Los precios se muestran en pesos chilenos e incluyen IVA para clientes personas. Están sujetos a stock disponible y pueden cambiar sin previo aviso.' },
      { h: '3. Compras', p: 'Al confirmar una compra recibirás un correo con el detalle. Nos reservamos el derecho de anular pedidos con errores evidentes de precio o stock, devolviendo lo pagado.' },
      { h: '4. Cuentas empresa', p: 'Las condiciones comerciales, descuentos por volumen y línea de crédito aplican solo a cuentas empresa aprobadas, según evaluación.' },
    ],
  },
  {
    slug: 'privacidad',
    title: 'Política de privacidad',
    nav: 'Privacidad',
    updated: 'Enero 2026',
    sections: [
      { h: '1. Datos que recopilamos', p: 'Recopilamos los datos que nos entregas al crear tu cuenta, comprar o contactarnos: nombre, correo, teléfono, direcciones de despacho y datos de facturación.' },
      { h: '2. Uso de la información', p: 'Usamos tus datos para procesar pedidos, brindar soporte, mejorar tu experiencia y, si lo autorizas, enviarte novedades y ofertas.' },
      { h: '3. Tus derechos', p: 'Puedes acceder, rectificar o eliminar tus datos escribiendo a privacidad@mimbral.cl. También puedes darte de baja de nuestras comunicaciones cuando quieras.' },
      { h: '4. Seguridad', p: 'Aplicamos medidas técnicas y organizativas para proteger tu información. Los pagos se procesan mediante pasarelas seguras certificadas.' },
    ],
  },
  {
    slug: 'despacho',
    title: 'Políticas de despacho',
    nav: 'Políticas de despacho',
    updated: 'Enero 2026',
    sections: [
      { h: '1. Cobertura', p: 'Despachamos a todo Chile mediante logística propia y couriers asociados. La disponibilidad y el costo se calculan según tu comuna en el checkout.' },
      { h: '2. Plazos', p: 'Los despachos a domicilio demoran entre 24 y 72 horas hábiles. Los productos voluminosos (obra gruesa) pueden requerir coordinación especial de entrega en faena.' },
      { h: '3. Retiro en tienda', p: 'Puedes retirar sin costo en la sucursal que elijas. Te avisamos por correo cuando el pedido esté listo, generalmente el mismo día.' },
      { h: '4. Recepción', p: 'Revisa tu pedido al recibirlo. Si algo llega dañado o incompleto, repórtalo dentro de 48 horas para gestionar la solución.' },
    ],
  },
  {
    slug: 'devoluciones',
    title: 'Cambios y devoluciones',
    nav: 'Cambios y devoluciones',
    updated: 'Enero 2026',
    sections: [
      { h: '1. Plazo', p: 'Tienes 30 días corridos desde la recepción para solicitar cambios o devoluciones de productos sin uso y con su embalaje original.' },
      { h: '2. Excepciones', p: 'Algunos productos a pedido, cortados a medida o de higiene personal no admiten devolución, salvo falla de fábrica.' },
      { h: '3. Reembolsos', p: 'El reembolso se realiza por el mismo medio de pago dentro de 10 días hábiles una vez recibido y revisado el producto.' },
      { h: '4. Garantía legal', p: 'Se respeta la garantía legal de 6 meses ante fallas. Acércate con tu boleta o número de pedido a cualquier tienda o escríbenos.' },
    ],
  },
]

export default function LegalPage() {
  const { doc = 'terminos' } = useParams()
  const current = DOCS.find((d) => d.slug === doc)
  if (!current) return <Navigate to="/legal/terminos" replace />

  return (
    <div>
      <PageHero eyebrow="Información legal" title={current.title} crumb={current.nav} />
      <div className="container legal">
        <aside className="legal__nav">
          <h3>Documentos</h3>
          <ul>
            {DOCS.map((d) => (
              <li key={d.slug}>
                <NavLink to={`/legal/${d.slug}`} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                  {d.nav}
                </NavLink>
              </li>
            ))}
          </ul>
        </aside>
        <article className="legal__body panel">
          <p className="legal__updated">Última actualización: {current.updated}</p>
          {current.sections.map((s) => (
            <section key={s.h}>
              <h2>{s.h}</h2>
              <p>{s.p}</p>
            </section>
          ))}
        </article>
      </div>
    </div>
  )
}
