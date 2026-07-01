import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Customer, PriceView, SalesMode } from '@/types'
import { DEFAULT_COMUNA } from '@/data/comunas'

interface AppState {
  /** Modo de venta DERIVADO del cliente: B2C por defecto, B2B solo si la
   *  sesión es de una cuenta de venta empresa. No se puede cambiar a mano. */
  mode: SalesMode
  customer: Customer | null
  login: (customer: Customer) => void
  logout: () => void
  /** Comuna de despacho seleccionada (afecta precio y plazo de entrega). */
  comuna: string
  setComuna: (comuna: string) => void
  /** Preferencia B2B de visualización de precios: neto / bruto / ambos. */
  priceView: PriceView
  setPriceView: (view: PriceView) => void
}

const AppContext = createContext<AppState | undefined>(undefined)
const CUSTOMER_KEY = 'mimbral.customer'
const COMUNA_KEY = 'mimbral.comuna'
const PRICEVIEW_KEY = 'mimbral.priceview'

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
  const [comuna, setComunaState] = useState<string>(() => readStored<string>(COMUNA_KEY) ?? DEFAULT_COMUNA)
  const [priceView, setPriceViewState] = useState<PriceView>(() => readStored<PriceView>(PRICEVIEW_KEY) ?? 'neto')

  useEffect(() => {
    if (customer) localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer))
    else localStorage.removeItem(CUSTOMER_KEY)
  }, [customer])

  useEffect(() => {
    localStorage.setItem(COMUNA_KEY, JSON.stringify(comuna))
  }, [comuna])

  useEffect(() => {
    localStorage.setItem(PRICEVIEW_KEY, JSON.stringify(priceView))
  }, [priceView])

  // El modo lo determina la cuenta: empresa => b2b; en cualquier otro caso b2c.
  const mode: SalesMode = customer?.type === 'b2b' ? 'b2b' : 'b2c'

  const login = (next: Customer) => setCustomer(next)
  const logout = () => setCustomer(null)
  const setComuna = (next: string) => setComunaState(next)
  const setPriceView = (next: PriceView) => setPriceViewState(next)

  const value = useMemo<AppState>(() => ({ mode, customer, login, logout, comuna, setComuna, priceView, setPriceView }), [mode, customer, comuna, priceView])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp(): AppState {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp debe usarse dentro de <AppProvider>')
  return ctx
}
