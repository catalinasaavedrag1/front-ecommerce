import { Link } from 'react-router-dom'
import Icon from '@/components/Icon'

export default function NotFoundPage() {
  return (
    <div className="container empty">
      <div className="confirm__check confirm__check--muted"><Icon name="search" /></div>
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe o fue movida.</p>
      <Link to="/" className="btn btn--primary">
        Volver al inicio
      </Link>
    </div>
  )
}
