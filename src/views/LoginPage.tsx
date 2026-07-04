import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import type { Customer, SalesMode } from '@/types'

const demoB2C: Customer = {
  name: 'Camila Rojas',
  email: 'camila@ejemplo.cl',
  type: 'b2c',
  rut: '15678234K',
}

const demoB2B: Customer = {
  name: 'Jorge Pérez',
  email: 'compras@constructoraandes.cl',
  type: 'b2b',
  company: 'Constructora Andes Ltda.',
  rut: '761234567',
  creditLine: 8000000,
  creditUsed: 2350000,
  corporateDiscount: 0.05,
  priceList: 'Mayorista A',
}

export default function LoginPage() {
  const { login } = useApp()
  const navigate = useNavigate()
  const [tab, setTab] = useState<SalesMode>('b2c')
  const [email, setEmail] = useState('')

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const base = tab === 'b2b' ? demoB2B : demoB2C
    login({ ...base, email: email || base.email })
    navigate(tab === 'b2b' ? '/empresas' : '/')
  }

  const quick = (c: Customer) => {
    login(c)
    navigate(c.type === 'b2b' ? '/empresas' : '/')
  }

  return (
    <div className="container auth">
      <div className="auth__card">
        <div className="modeswitch modeswitch--lg">
          <button
            className={`modeswitch__opt ${tab === 'b2c' ? 'is-active' : ''}`}
            onClick={() => setTab('b2c')}
          >
            Soy persona
          </button>
          <button
            className={`modeswitch__opt ${tab === 'b2b' ? 'is-active' : ''}`}
            onClick={() => setTab('b2b')}
          >
            Soy empresa
          </button>
        </div>

        <h1>{tab === 'b2b' ? 'Ingreso Empresas' : 'Ingresar'}</h1>
        <p className="auth__sub">
          {tab === 'b2b'
            ? 'Accede a precios netos, crédito y cotizaciones.'
            : 'Accede a tu cuenta para comprar más rápido.'}
        </p>

        <form onSubmit={submit}>
          {tab === 'b2b' && (
            <label>
              RUT empresa
              <input placeholder="76.123.456-7" />
            </label>
          )}
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.cl"
            />
          </label>
          <label>
            Contraseña
            <input type="password" placeholder="••••••••" />
          </label>
          <button type="submit" className="btn btn--primary btn--block">
            Ingresar
          </button>
        </form>

        <div className="auth__help">
          <span>{tab === 'b2b' ? 'Usa RUT empresa + email corporativo. Activaremos precios netos al ingresar.' : 'Puedes comprar más rápido guardando tus datos y favoritos.'}</span>
          <button type="button" className="link-btn">¿Olvidaste tu contraseña?</button>
        </div>

        <div className="auth__demo">
          <span>Cuentas de demostración:</span>
          <div className="auth__demo-grid">
            <button className="auth__demo-card" onClick={() => quick(demoB2C)}>
              <strong>Persona</strong>
              <span>Pedidos, favoritos y recompra</span>
            </button>
            <button className="auth__demo-card" onClick={() => quick(demoB2B)}>
              <strong>Empresa</strong>
              <span>Crédito, listas y cotizaciones</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
