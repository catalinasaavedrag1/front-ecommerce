import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Customer, SalesMode } from '@/types'

interface AppState {
  /** Modo de venta DERIVADO del cliente: B2C por defecto, B2B solo si la
   *  sesión es de una cuenta de venta empresa. No se puede cambiar a mano. */
  mode: SalesMode
  customer: Customer | null
  login: (customer: Customer) => void
  logout: () => void
}

const AppContext = createContext<AppState | undefined>(undefined)
const CUSTOMER_KEY = 'mimbral.customer'

function readStored<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  } catch {
    return null
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(() => readStored<Customer>(CUSTOMER_KEY))

  useEffect(() => {
    if (customer) localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer))
    else localStorage.removeItem(CUSTOMER_KEY)
  }, [customer])

  // El modo lo determina la cuenta: empresa => b2b; en cualquier otro caso b2c.
  const mode: SalesMode = customer?.type === 'b2b' ? 'b2b' : 'b2c'

  const login = (next: Customer) => setCustomer(next)
  const logout = () => setCustomer(null)

  const value = useMemo<AppState>(() => ({ mode, customer, login, logout }), [mode, customer])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>')
  return ctx
}
