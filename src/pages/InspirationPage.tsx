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
  { title: 'Renueva tu baño en un fin de semana', tag: 'Baños', from: '#0b7da3', to: '#075d79', cat: 'banos-cocina' },
  { title: 'Living luminoso con iluminación LED', tag: 'Iluminación', from: '#e69408', to: '#a86a00', cat: 'electrico' },
  { title: 'Terraza lista para el verano', tag: 'Jardín', from: '#3f9d2f', to: '#2c6f21', cat: 'jardin' },
  { title: 'Pisos flotantes que transforman', tag: 'Pisos', from: '#a9743f', to: '#7c5026', cat: 'pisos' },
  { title: 'Cocina moderna y funcional', tag: 'Cocina', from: '#0a3d62', to: '#06283d', cat: 'banos-cocina' },
  { title: 'Color: tendencias en pintura', tag: 'Pinturas', from: '#1b7a5a', to: '#14624a', cat: 'pinturas' },
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
