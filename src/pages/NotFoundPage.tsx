import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="container empty">
      <div className="confirm__check confirm__check--muted">🔍</div>
      <h1>Página no encontrada</h1>
      <p>La página que buscas no existe o fue movida.</p>
      <Link to="/" className="btn btn--primary">
        Volver al inicio
      </Link>
    </div>
  )
}
