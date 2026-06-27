import { useState } from 'react'
import type { Product } from '@/types'
import { productPhotoUrl } from '@/data/products'

/**
 * Ilustración de producto generada con SVG (sin depender de imágenes remotas).
 * Cada categoría tiene una composición y paleta propias para dar un aspecto de
 * catálogo profesional y consistente.
 */

interface Palette {
  bgFrom: string
  bgTo: string
  main: string
  dark: string
  accent: string
}

const palettes: Record<string, Palette> = {
  herramientas: { bgFrom: '#eef3f8', bgTo: '#dde7f0', main: '#0a3d62', dark: '#06283d', accent: '#f6a821' },
  electricidad: { bgFrom: '#fff7e6', bgTo: '#ffeec2', main: '#e69408', dark: '#a86a00', accent: '#0a3d62' },
  pinturas: { bgFrom: '#eafaf4', bgTo: '#d4f1e6', main: '#1b7a5a', dark: '#14624a', accent: '#ee5a24' },
  construccion: { bgFrom: '#f2efe9', bgTo: '#e6ddcf', main: '#8a6d3b', dark: '#5f4a26', accent: '#ee5a24' },
  gasfiteria: { bgFrom: '#e8f3fb', bgTo: '#d0e6f5', main: '#1565a0', dark: '#0d4670', accent: '#f6a821' },
  'banos-cocina': { bgFrom: '#e9f6fb', bgTo: '#d2ecf6', main: '#0b7da3', dark: '#075d79', accent: '#0a3d62' },
  jardin: { bgFrom: '#edf8e6', bgTo: '#d7efc7', main: '#3f9d2f', dark: '#2c6f21', accent: '#8a6d3b' },
  pisos: { bgFrom: '#f4ece2', bgTo: '#e7d6c0', main: '#a9743f', dark: '#7c5026', accent: '#0a3d62' },
  ferreteria: { bgFrom: '#eef1f4', bgTo: '#dde3e9', main: '#566573', dark: '#37424d', accent: '#f6a821' },
  seguridad: { bgFrom: '#fff4e8', bgTo: '#ffe3c2', main: '#e8651e', dark: '#b14710', accent: '#0a3d62' },
  maderas: { bgFrom: '#f4ece2', bgTo: '#e7d6c0', main: '#a9743f', dark: '#7c5026', accent: '#2c6f21' },
  temporada: { bgFrom: '#fff6df', bgTo: '#ffe9ad', main: '#f0a500', dark: '#b97c00', accent: '#0b7da3' },
  bano: { bgFrom: '#e9f6fb', bgTo: '#d2ecf6', main: '#0b7da3', dark: '#075d79', accent: '#173a8a' },
  cocina: { bgFrom: '#eef3f8', bgTo: '#dde7f0', main: '#173a8a', dark: '#102a63', accent: '#e1251b' },
  electrohogar: { bgFrom: '#fff6df', bgTo: '#ffe9ad', main: '#f0a500', dark: '#b97c00', accent: '#173a8a' },
  decoracion: { bgFrom: '#f3eefb', bgTo: '#e4d9f5', main: '#6b4fa0', dark: '#4a3578', accent: '#e1251b' },
  dormitorio: { bgFrom: '#fdf0ef', bgTo: '#f8d9d6', main: '#c2554c', dark: '#933c35', accent: '#173a8a' },
  muebles: { bgFrom: '#f4ece2', bgTo: '#e7d6c0', main: '#a9743f', dark: '#7c5026', accent: '#173a8a' },
  'aire-libre': { bgFrom: '#edf8e6', bgTo: '#d7efc7', main: '#3f9d2f', dark: '#2c6f21', accent: '#0b7da3' },
  automovil: { bgFrom: '#eef1f4', bgTo: '#dde3e9', main: '#37424d', dark: '#1f262d', accent: '#e1251b' },
}

function artFor(categoryId: string, p: Palette) {
  switch (categoryId) {
    case 'herramientas':
      return (
        <g>
          <rect x="70" y="92" width="70" height="34" rx="8" fill={p.main} />
          <rect x="128" y="98" width="40" height="22" rx="5" fill={p.dark} />
          <rect x="166" y="103" width="22" height="12" rx="3" fill={p.accent} />
          <path d="M78 126 h34 v22 a10 10 0 0 1-10 10 H88 a10 10 0 0 1-10-10 z" fill={p.dark} />
          <rect x="84" y="150" width="22" height="20" rx="4" fill={p.main} />
          <circle cx="95" cy="109" r="9" fill="#fff" opacity="0.85" />
        </g>
      )
    case 'electricidad':
      return (
        <g>
          <circle cx="120" cy="96" r="34" fill={p.main} />
          <circle cx="120" cy="96" r="34" fill="#fff" opacity="0.18" />
          <rect x="108" y="126" width="24" height="10" rx="3" fill={p.dark} />
          <rect x="110" y="138" width="20" height="8" rx="3" fill={p.dark} />
          <rect x="113" y="148" width="14" height="9" rx="3" fill={p.dark} />
          <path d="M114 90 l8 0 -4 14 z" fill="#fff" opacity="0.9" />
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <line
              key={a}
              x1={120 + Math.cos((a * Math.PI) / 180) * 44}
              y1={96 + Math.sin((a * Math.PI) / 180) * 44}
              x2={120 + Math.cos((a * Math.PI) / 180) * 54}
              y2={96 + Math.sin((a * Math.PI) / 180) * 54}
              stroke={p.accent}
              strokeWidth="4"
              strokeLinecap="round"
            />
          ))}
        </g>
      )
    case 'pinturas':
      return (
        <g>
          <rect x="74" y="86" width="62" height="26" rx="6" fill={p.main} />
          <rect x="74" y="86" width="62" height="9" rx="4" fill="#fff" opacity="0.3" />
          <rect x="132" y="95" width="26" height="8" rx="4" fill={p.dark} />
          <path d="M158 99 v22 h-8 v-14 a4 4 0 0 1 4-4 z" fill={p.dark} />
          <rect x="146" y="121" width="8" height="40" rx="4" fill={p.dark} />
          <path d="M104 112 c-3 14 -3 30 1 44 c4-14 4-30-1-44z" fill={p.accent} />
        </g>
      )
    case 'construccion':
      return (
        <g>
          {[0, 1, 2].map((row) =>
            [0, 1, 2, 3].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={58 + col * 32 + (row % 2 ? 16 : 0)}
                y={104 + row * 20}
                width="28"
                height="16"
                rx="2"
                fill={row % 2 ? p.main : p.dark}
              />
            )),
          )}
          <rect x="120" y="70" width="46" height="10" rx="3" fill={p.accent} transform="rotate(-18 143 75)" />
          <path d="M150 60 l24 8 -6 14 z" fill={p.dark} transform="rotate(-18 162 70)" />
        </g>
      )
    case 'maderas':
      return (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x="62" y={92 + i * 18} width="116" height="14" rx="3" fill={i % 2 ? p.main : p.dark} />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <line key={`l${i}`} x1={62 + 30 + i * 12} y1={92} x2={62 + 30 + i * 12} y2={170} stroke={p.bgTo} strokeWidth="2" opacity="0.5" />
          ))}
        </g>
      )
    case 'temporada':
      return (
        <g>
          <circle cx="120" cy="108" r="30" fill={p.main} />
          <circle cx="120" cy="108" r="30" fill="#fff" opacity="0.15" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
            <line
              key={a}
              x1={120 + Math.cos((a * Math.PI) / 180) * 40}
              y1={108 + Math.sin((a * Math.PI) / 180) * 40}
              x2={120 + Math.cos((a * Math.PI) / 180) * 54}
              y2={108 + Math.sin((a * Math.PI) / 180) * 54}
              stroke={p.main}
              strokeWidth="6"
              strokeLinecap="round"
            />
          ))}
        </g>
      )
    case 'seguridad':
      return (
        <g>
          <path d="M78 124 a42 42 0 0 1 84 0 z" fill={p.main} />
          <rect x="72" y="124" width="96" height="12" rx="6" fill={p.dark} />
          <rect x="112" y="74" width="16" height="22" rx="4" fill={p.dark} />
          <path d="M104 124 a16 16 0 0 1 32 0" fill="none" stroke={p.bgFrom} strokeWidth="4" />
        </g>
      )
    case 'gasfiteria':
    case 'bano':
    case 'cocina':
    case 'banos-cocina':
      return (
        <g>
          <path d="M120 70 v18 h26 a14 14 0 0 1 14 14 v6" fill="none" stroke={p.main} strokeWidth="9" strokeLinecap="round" />
          <rect x="108" y="64" width="24" height="12" rx="6" fill={p.dark} />
          <path d="M160 108 l-7 16 l-7-16 z" fill={p.accent} />
          <path d="M78 140 q42 26 84 0" fill="none" stroke={p.dark} strokeWidth="8" strokeLinecap="round" />
          <rect x="74" y="138" width="92" height="8" rx="4" fill={p.main} opacity="0.25" />
        </g>
      )
    case 'jardin':
      return (
        <g>
          <path d="M120 128 c-30 0 -42-26-42-26 c30-4 42 14 42 26z" fill={p.main} />
          <path d="M120 128 c30 0 42-26 42-26 c-30-4-42 14-42 26z" fill={p.dark} />
          <path d="M120 128 c-6-26 4-44 4-44 c10 16 6 36-4 44z" fill={p.accent} opacity="0.9" />
          <path d="M104 130 h32 l-5 34 a6 6 0 0 1-6 5 h-10 a6 6 0 0 1-6-5 z" fill={p.dark} />
          <rect x="100" y="126" width="40" height="9" rx="4" fill={p.main} />
        </g>
      )
    case 'pisos':
      return (
        <g>
          {[0, 1, 2, 3].map((i) => (
            <rect
              key={i}
              x="62"
              y={92 + i * 18}
              width="116"
              height="14"
              rx="3"
              fill={i % 2 ? p.main : p.dark}
            />
          ))}
          {[0, 1, 2, 3].map((i) => (
            <line key={`l${i}`} x1={62 + 30 + i * 12} y1={92} x2={62 + 30 + i * 12} y2={170} stroke={p.bgTo} strokeWidth="2" opacity="0.5" />
          ))}
        </g>
      )
    case 'ferreteria':
    default:
      return (
        <g>
          <path d="M120 74 l18 10 v22 l-18 10 -18-10 V84 z" fill={p.main} />
          <circle cx="120" cy="95" r="9" fill={p.bgFrom} />
          <rect x="114" y="116" width="12" height="44" rx="3" fill={p.dark} />
          <path d="M114 160 l6 10 6-10 z" fill={p.dark} />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1="114" y1={124 + i * 8} x2="126" y2={120 + i * 8} stroke={p.bgFrom} strokeWidth="2" />
          ))}
        </g>
      )
  }
}

interface Props {
  product: Product
  className?: string
  /** Variante visual para galería (cambia el encuadre). */
  variant?: number
}

export default function ProductImage({ product, className, variant = 0 }: Props) {
  const [imgError, setImgError] = useState(false)

  // Foto de stock real; si falla la carga, cae a la ilustración SVG.
  if (!imgError) {
    return (
      <img
        className={className}
        src={productPhotoUrl(product, variant)}
        alt={product.name}
        loading="lazy"
        onError={() => setImgError(true)}
        style={{ objectFit: 'cover', width: '100%', height: '100%', display: 'block', background: '#eef2f6' }}
      />
    )
  }

  const p = palettes[product.categoryId] ?? palettes.ferreteria
  const gid = `g-${product.id}-${variant}`
  const scale = 1 + variant * 0.12
  const rotate = variant === 2 ? -8 : variant === 1 ? 6 : 0
  return (
    <svg
      className={className}
      viewBox="0 0 240 200"
      role="img"
      aria-label={product.name}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.bgFrom} />
          <stop offset="100%" stopColor={p.bgTo} />
        </linearGradient>
      </defs>
      <rect width="240" height="200" fill={`url(#${gid})`} />
      <circle cx="200" cy="36" r="54" fill="#fff" opacity="0.25" />
      <circle cx="40" cy="176" r="40" fill="#fff" opacity="0.18" />
      <g transform={`rotate(${rotate} 120 120) scale(${scale}) translate(${(1 - scale) * 120} ${(1 - scale) * 120})`}>
        {artFor(product.categoryId, p)}
      </g>
    </svg>
  )
}
