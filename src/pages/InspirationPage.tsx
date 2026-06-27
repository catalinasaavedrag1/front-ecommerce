import { Link } from 'react-router-dom'
import PageHero from '@/components/PageHero'

interface Idea {
  title: string
  tag: string
  from: string
  to: string
  cat: string
}

const ideas: Idea[] = [
  { title: 'Renueva tu baño en un fin de semana', tag: 'Baño', from: '#0b7da3', to: '#075d79', cat: 'bano' },
  { title: 'Living luminoso con iluminación LED', tag: 'Iluminación', from: '#6b4fa0', to: '#4a3578', cat: 'decoracion' },
  { title: 'Terraza lista para el verano', tag: 'Jardín', from: '#3f9d2f', to: '#2c6f21', cat: 'jardin' },
  { title: 'Pisos flotantes que transforman', tag: 'Pisos', from: '#a9743f', to: '#7c5026', cat: 'pisos' },
  { title: 'Cocina moderna y funcional', tag: 'Cocina', from: '#173a8a', to: '#102a63', cat: 'cocina' },
  { title: 'Equipa tu taller', tag: 'Herramientas', from: '#b21d15', to: '#7a1d15', cat: 'herramientas' },
]

export default function InspirationPage() {
  return (
    <div>
      <PageHero
        eyebrow="Ideas y proyectos"
        title="Inspiración para tu hogar"
        icon="✨"
        subtitle="Ambientes, guías y proyectos para inspirarte. Encuentra todo lo que necesitas para hacerlos realidad."
      />
      <div className="container">
        <div className="inspo">
          {ideas.map((idea) => (
            <Link
              to={`/categoria/${idea.cat}`}
              className="inspo__tile"
              key={idea.title}
              style={{ background: `linear-gradient(150deg, ${idea.from}, ${idea.to})` }}
            >
              <span className="inspo__tag">{idea.tag}</span>
              <div className="inspo__overlay">
                <h3>{idea.title}</h3>
                <span className="inspo__link">Ver productos →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
