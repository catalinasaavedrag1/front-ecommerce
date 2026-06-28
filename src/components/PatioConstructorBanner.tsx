import { Link } from 'react-router-dom'

/** Bloque promocional del Patio Constructor, antes del footer.
 *  Ilustración vectorial propia (sin foto) para reforzar marca Mimbral. */
export default function PatioConstructorBanner() {
  return (
    <div className="pcbanner-wrap">
      <section className="pcbanner pcbanner--illustrated" aria-label="Patio Constructor Mimbral">
        <div className="pcbanner__content">
          <span className="pcbanner__eyebrow">Patio Constructor</span>
          <h2 className="pcbanner__title">Todo para tu obra en un solo lugar</h2>
          <p className="pcbanner__desc">Materiales, maderas, cemento, fierro, gasfitería y pinturas, con despacho y retiro en tienda.</p>
          <Link to="/tiendas" className="btn btn--primary pcbanner__cta">Conoce el Patio Constructor</Link>
        </div>

        <svg className="pcbanner__art" viewBox="0 0 760 320" role="img" aria-label="Ilustración del Patio Constructor Mimbral con tienda, materiales y despacho">
          <defs>
            <linearGradient id="pc-sky" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#e8f1ff" />
              <stop offset="1" stopColor="#ffffff" />
            </linearGradient>
            <linearGradient id="pc-store" x1="0" x2="1">
              <stop offset="0" stopColor="#173a8a" />
              <stop offset="1" stopColor="#1f4aa8" />
            </linearGradient>
          </defs>

          <rect width="760" height="320" rx="28" fill="url(#pc-sky)" />
          <path d="M68 250c78-42 143-44 216-24 100 28 165 29 257-12 65-29 121-28 164 4v62H68z" fill="#dbe7f6" />
          <path d="M112 242h556" stroke="#c7d6e8" strokeWidth="4" strokeLinecap="round" />

          <g className="pcbanner__store">
            <path d="M214 122h290v120H214z" fill="#fff" stroke="#c6d2e3" strokeWidth="4" />
            <path d="M194 96h330l-24 38H218z" fill="url(#pc-store)" />
            <path d="M224 106h54l-12 28h-58zM286 106h54l-10 28h-56zM350 106h54l-8 28h-54zM414 106h54l-6 28h-56z" fill="#e1251b" opacity="0.95" />
            <rect x="247" y="150" width="82" height="92" rx="6" fill="#edf3fb" stroke="#c6d2e3" strokeWidth="4" />
            <rect x="352" y="150" width="118" height="68" rx="6" fill="#f8fbff" stroke="#c6d2e3" strokeWidth="4" />
            <path d="M374 178h75" stroke="#9fb3cd" strokeWidth="5" strokeLinecap="round" />
            <path d="M374 196h58" stroke="#d8e2ef" strokeWidth="5" strokeLinecap="round" />
            <rect x="291" y="72" width="134" height="40" rx="12" fill="#173a8a" />
            <text x="358" y="98" textAnchor="middle" fill="#fff" fontFamily="Inter,Arial,sans-serif" fontSize="22" fontWeight="800">Mimbral</text>
            <rect x="380" y="92" width="38" height="14" rx="3" fill="#e1251b" />
            <text x="399" y="103" textAnchor="middle" fill="#fff" fontFamily="Inter,Arial,sans-serif" fontSize="9" fontWeight="800">MTS</text>
          </g>

          <g className="pcbanner__materials">
            <rect x="90" y="202" width="126" height="24" rx="7" fill="#c17f3f" />
            <rect x="104" y="178" width="126" height="24" rx="7" fill="#d3914b" />
            <rect x="76" y="226" width="126" height="24" rx="7" fill="#b87539" />
            <rect x="112" y="137" width="46" height="58" rx="8" fill="#f3d28b" stroke="#c99b43" strokeWidth="4" />
            <path d="M122 158h26M122 174h18" stroke="#9b7130" strokeWidth="4" strokeLinecap="round" />
            <circle cx="188" cy="167" r="26" fill="#8fa6bd" />
            <circle cx="188" cy="167" r="13" fill="#eef3fb" />
          </g>

          <g className="pcbanner__truck">
            <rect x="530" y="184" width="104" height="48" rx="10" fill="#e1251b" />
            <path d="M634 198h42l28 24v10h-70z" fill="#173a8a" />
            <rect x="646" y="204" width="28" height="18" rx="3" fill="#dbeafe" />
            <path d="M548 204h62" stroke="#fff" strokeWidth="5" strokeLinecap="round" opacity="0.65" />
            <circle cx="558" cy="238" r="16" fill="#22384e" />
            <circle cx="558" cy="238" r="7" fill="#fff" />
            <circle cx="674" cy="238" r="16" fill="#22384e" />
            <circle cx="674" cy="238" r="7" fill="#fff" />
          </g>

          <g className="pcbanner__person">
            <circle cx="492" cy="165" r="14" fill="#f0b58a" />
            <path d="M476 184h34l9 58h-52z" fill="#f6a821" />
            <path d="M468 242h20M500 242h22" stroke="#173a8a" strokeWidth="8" strokeLinecap="round" />
            <path d="M476 193l-34 20M510 194l33-18" stroke="#f0b58a" strokeWidth="8" strokeLinecap="round" />
            <path d="M479 151h28l-5-11h-18z" fill="#173a8a" />
          </g>

          <circle cx="604" cy="78" r="18" fill="#ffd56b" opacity="0.85" />
          <path d="M618 120h54M604 138h82" stroke="#c7d6e8" strokeWidth="6" strokeLinecap="round" opacity="0.7" />
        </svg>
      </section>
    </div>
  )
}
