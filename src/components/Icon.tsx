interface Props {
  name: IconName
  className?: string
  size?: number
  filled?: boolean
}

export type IconName =
  | 'search' | 'user' | 'cart' | 'heart' | 'truck' | 'store' | 'shield' | 'return'
  | 'phone' | 'pin' | 'building' | 'filter' | 'chevron' | 'plus' | 'minus' | 'close'
  | 'menu' | 'doc' | 'percent' | 'bolt' | 'check' | 'clock' | 'mail' | 'map' | 'box'
  | 'calendar' | 'lock' | 'card' | 'bank' | 'tag' | 'star' | 'sparkle' | 'users'
  | 'wallet' | 'list' | 'headset' | 'leaf' | 'trash' | 'trend' | 'handshake' | 'medal' | 'chat' | 'home' | 'grid' | 'scan'
  // categorías
  | 'construccion' | 'ferreteria' | 'herramientas' | 'pinturas' | 'electricidad'
  | 'gasfiteria' | 'jardin' | 'banos-cocina' | 'pisos' | 'seguridad' | 'maderas' | 'temporada'
  | 'bano' | 'cocina' | 'electrohogar' | 'decoracion' | 'dormitorio' | 'muebles' | 'aire-libre' | 'automovil'

const paths: Record<IconName, JSX.Element> = {
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3-3" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  cart: <><path d="M3 4h2l2.4 12.2a1 1 0 0 0 1 .8h9.2a1 1 0 0 0 1-.8L21 8H6" /><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /></>,
  heart: <path d="M12 20s-7-4.5-9.3-9A4.7 4.7 0 0 1 12 6a4.7 4.7 0 0 1 9.3 5C19 15.5 12 20 12 20Z" />,
  truck: <><path d="M2 6h11v9H2z" /><path d="M13 9h4l3 3v3h-7z" /><circle cx="6" cy="18" r="1.6" /><circle cx="17" cy="18" r="1.6" /></>,
  store: <><path d="M4 9h16v10H4z" /><path d="M3 9l1.5-5h15L21 9" /><path d="M9 19v-5h6v5" /></>,
  shield: <path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z" />,
  return: <><path d="M3 7v6h6" /><path d="M3 13a9 9 0 1 0 3-7.7L3 8" /></>,
  phone: <path d="M5 3h3l2 5-2.5 1.5a11 11 0 0 0 5 5L19 14l3 3v3a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z" />,
  pin: <><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.5" /></>,
  building: <><path d="M5 21V5a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v16" /><path d="M16 21h3V11h-3" /><path d="M9 7h2M9 11h2M9 15h2" /></>,
  filter: <path d="M3 5h18l-7 8v6l-4-2v-4z" />,
  chevron: <path d="m9 6 6 6-6 6" />,
  plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
  minus: <path d="M5 12h14" />,
  close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
  menu: <><path d="M3 6h18" /><path d="M3 12h18" /><path d="M3 18h18" /></>,
  doc: <><path d="M6 2h8l4 4v16H6z" /><path d="M14 2v4h4" /><path d="M9 13h6M9 17h6" /></>,
  percent: <><path d="m6 18 12-12" /><circle cx="7.5" cy="7.5" r="1.6" /><circle cx="16.5" cy="16.5" r="1.6" /></>,
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6z" />,
  check: <path d="m4 12 5 5L20 6" />,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  mail: <><path d="M3 5h18v14H3z" /><path d="m3 6 9 7 9-7" /></>,
  map: <><path d="m9 4 6 2 6-2v14l-6 2-6-2-6 2V6z" /><path d="M9 4v14M15 6v14" /></>,
  box: <><path d="M21 8 12 3 3 8l9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></>,
  calendar: <><path d="M4 5h16v16H4z" /><path d="M4 9h16M8 3v4M16 3v4" /></>,
  lock: <><path d="M6 11h12v9H6z" /><path d="M9 11V8a3 3 0 0 1 6 0v3" /></>,
  card: <><path d="M3 6h18v12H3z" /><path d="M3 10h18" /></>,
  bank: <><path d="M3 9 12 4l9 5" /><path d="M5 9v8M9 9v8M15 9v8M19 9v8" /><path d="M3 20h18" /></>,
  tag: <><path d="M3 3h8l10 10-8 8L3 11z" /><circle cx="7.5" cy="7.5" r="1.4" /></>,
  star: <path d="m12 3 2.6 5.6L21 9.3l-4.5 4.3 1.1 6.4L12 17l-5.6 3 1.1-6.4L3 9.3l6.4-.7z" />,
  sparkle: <path d="M12 3v6m0 6v6m-6-9h6m6 0h-6M7 7l3 3m4 4 3 3m0-10-3 3m-4 4-3 3" />,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M3 20a6 6 0 0 1 12 0" /><path d="M16 5a3.2 3.2 0 0 1 0 6M21 20a6 6 0 0 0-4-5.7" /></>,
  wallet: <><path d="M3 7h16v12H3z" /><path d="M3 7V5h13" /><circle cx="16" cy="13" r="1.4" /></>,
  list: <><path d="M8 6h13M8 12h13M8 18h13" /><circle cx="4" cy="6" r="1" /><circle cx="4" cy="12" r="1" /><circle cx="4" cy="18" r="1" /></>,
  headset: <><path d="M5 13a7 7 0 0 1 14 0" /><path d="M3 14a2 2 0 0 1 2-2h1v6H5a2 2 0 0 1-2-2zM21 14a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2z" /><path d="M19 18a4 4 0 0 1-4 3h-2" /></>,
  leaf: <path d="M4 20c0-9 7-15 16-15 0 9-6 15-13 15a8 8 0 0 1-3 0zM4 20c2-5 6-8 10-9" />,
  trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /><path d="M10 11v6M14 11v6" /></>,
  trend: <><path d="M3 17l6-6 4 4 7-7" /><path d="M15 8h5v5" /></>,
  handshake: <path d="m8 12 3-3 3 3 3-3 3 3-5 5-1-1-2 2-4-4z" />,
  medal: <><circle cx="12" cy="14" r="5" /><path d="M9 9 6 3M15 9l3-6M10 4h4" /></>,
  chat: <><path d="M4 5h16v11H9l-4 4v-4H4z" /><path d="M8 9h8M8 12h5" /></>,
  home: <><path d="M3 11 12 4l9 7" /><path d="M5 10v9h14v-9" /><path d="M10 19v-5h4v5" /></>,
  grid: <><path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" /></>,
  scan: <><path d="M4 7V5a1 1 0 0 1 1-1h2M20 7V5a1 1 0 0 0-1-1h-2M4 17v2a1 1 0 0 0 1 1h2M20 17v2a1 1 0 0 0-1 1h-2" /><path d="M7 8v8M10 8v8M13 8v8M16 8v8" /></>,
  // categorías
  construccion: <><path d="M3 21h18" /><path d="M5 21V10l4-2 4 2v11" /><path d="M13 21V13l4-2 2 1v9" /><path d="M7 13h2M7 16h2" /></>,
  ferreteria: <><path d="m14 7 3-3 3 3-3 3" /><path d="m4 20 8-8" /><circle cx="6" cy="18" r="2" /><path d="m13 11 3 3" /></>,
  herramientas: <><path d="M14 7a3 3 0 0 0 4 4l3 3-3 3-3-3a3 3 0 0 0-4-4z" /><path d="m11 11-7 7 2 2 7-7" /></>,
  pinturas: <><path d="M4 5h13v5H4z" /><path d="M17 7h3v4h-6v4" /><path d="M12 15h4v6h-4z" /></>,
  electricidad: <path d="M13 2 4 14h6l-1 8 9-12h-6z" />,
  gasfiteria: <><path d="M7 4v6a4 4 0 0 0 4 4h3" /><path d="M14 11h6v6" /><path d="M4 4h6M4 7h4" /></>,
  jardin: <path d="M4 20c0-9 7-15 16-15 0 9-6 15-13 15a8 8 0 0 1-3 0zM4 20c2-5 6-8 10-9" />,
  'banos-cocina': <><path d="M12 4v5h7a3 3 0 0 1 3 3v1" /><path d="M9 4h6" /><path d="M4 14h16v2a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" /></>,
  pisos: <><path d="M3 7h18M3 12h18M3 17h18" /><path d="M8 7v5M14 12v5M11 17v3" /></>,
  seguridad: <><path d="M4 13a8 8 0 0 1 16 0z" /><path d="M3 13h18v2H3z" /><path d="M11 5h2v3h-2z" /></>,
  maderas: <><path d="M3 7h18v4H3zM3 13h18v4H3z" /><path d="M8 7v4M15 13v4" /></>,
  temporada: <><circle cx="12" cy="12" r="4" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></>,
  bano: <><path d="M5 4v8M5 8h6a3 3 0 0 1 3 3" /><path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5z" /><path d="M8 19l-1 2M16 19l1 2" /></>,
  cocina: <><path d="M8 3a2 2 0 0 1 4 0c2 0 3 1 3 4H8z" /><path d="M7 8h9l-1 12H8z" /></>,
  electrohogar: <><path d="M6 3h12v18H6z" /><path d="M6 10h12" /><path d="M9 6v1M9 14v2" /></>,
  decoracion: <><path d="M9 3h6l3 7H6z" /><path d="M12 10v8" /><path d="M9 21h6" /></>,
  dormitorio: <><path d="M3 18V9h13a4 4 0 0 1 4 4v5" /><path d="M3 14h17" /><path d="M3 18v2M20 18v2" /><path d="M6 9V7a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v2" /></>,
  muebles: <><path d="M4 11a2 2 0 0 1 4 0v3h8v-3a2 2 0 0 1 4 0v6H4z" /><path d="M6 17v2M18 17v2" /><path d="M8 14v-3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v3" /></>,
  'aire-libre': <><path d="M12 3 4 19h16z" /><path d="M12 9 8 19M12 9l4 10" /><path d="M3 21h18" /></>,
  automovil: <><path d="M3 13l2-5h14l2 5v5h-3v-2H6v2H3z" /><circle cx="7" cy="16" r="1.4" /><circle cx="17" cy="16" r="1.4" /></>,
}

const filledNames = new Set<IconName>(['heart', 'shield', 'bolt', 'star', 'pin', 'filter', 'tag', 'leaf', 'jardin', 'electricidad'])

export default function Icon({ name, className, size, filled }: Props) {
  const isFilled = filled ?? filledNames.has(name)
  return (
    <svg
      className={`ic${className ? ` ${className}` : ''}`}
      width={size ?? '1em'}
      height={size ?? '1em'}
      viewBox="0 0 24 24"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={isFilled ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  )
}

/** Icono de categoría por id, con fallback. */
export function CategoryIcon({ id, className }: { id: string; className?: string }) {
  const name = (id in paths ? id : 'tag') as IconName
  return <Icon name={name} className={className} />
}
