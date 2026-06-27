import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Customer, SalesMode } from '@/types'

interface AppState {
  mode: SalesMode
  setMode: (mode: SalesMode) => void
  customer: Customer | null
  login: (customer: Customer) => void
  logout: () => void
}

const AppContext = createContext<AppState | undefined>(undefined)

const MODE_KEY = 'mimbral.mode'
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
  const [mode, setModeState] = useState<SalesMode>(() => readStored<SalesMode>(MODE_KEY) ?? 'b2c')
  const [customer, setCustomer] = useState<Customer | null>(() => readStored<Customer>(CUSTOMER_KEY))

  useEffect(() => {
    localStorage.setItem(MODE_KEY, JSON.stringify(mode))
  }, [mode])

  useEffect(() => {
    if (customer) localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer))
    else localStorage.removeItem(CUSTOMER_KEY)
  }, [customer])

  const setMode = (next: SalesMode) => setModeState(next)

  const login = (next: Customer) => {
    setCustomer(next)
    setModeState(next.type)
  }

  const logout = () => setCustomer(null)

  const value = useMemo<AppState>(
    () => ({ mode, setMode, customer, login, logout }),
    [mode, customer],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>')
  return ctx
}
