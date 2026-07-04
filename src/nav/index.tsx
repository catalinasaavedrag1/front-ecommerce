'use client'

/**
 * Implementación Next del shim '@/nav' (ver index.tsx). Replica la API de
 * react-router-dom que usa el código compartido, sobre next/link +
 * next/navigation. Paridades cuidadas:
 *  - NavLink agrega la clase 'active' automáticamente (como react-router) y
 *    soporta `end` y className como función ({ isActive }).
 *  - useNavigate acepta rutas y -1 (volver atrás) y { replace }.
 *  - useLocation entrega { pathname, search, hash }.
 */
import NextLink from 'next/link'
import {
  useParams as nextUseParams,
  usePathname,
  useRouter,
  useSearchParams as nextUseSearchParams,
} from 'next/navigation'
import { useEffect, type AnchorHTMLAttributes, type ReactNode } from 'react'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to: string
  children?: ReactNode
  replace?: boolean
  state?: unknown
  end?: boolean
}

export function Link({ to, children, replace, state: _state, end: _end, ...rest }: LinkProps) {
  return (
    <NextLink href={to} replace={replace} {...rest}>
      {children}
    </NextLink>
  )
}

type NavLinkProps = Omit<LinkProps, 'className'> & {
  className?: string | ((args: { isActive: boolean }) => string)
}

export function NavLink({ to, children, className, end, ...rest }: NavLinkProps) {
  const pathname = usePathname() ?? '/'
  const isActive = end ? pathname === to : pathname === to || pathname.startsWith(`${to === '/' ? '' : to}/`)
  const computed = typeof className === 'function' ? className({ isActive }) : className
  // Paridad react-router: la clase 'active' se agrega sola al estar activo.
  const finalClass = [computed, isActive ? 'active' : ''].filter(Boolean).join(' ') || undefined
  return (
    <NextLink href={to} className={finalClass} aria-current={isActive ? 'page' : undefined} {...rest}>
      {children}
    </NextLink>
  )
}

export function Navigate({ to, replace }: { to: string; replace?: boolean }) {
  const router = useRouter()
  useEffect(() => {
    if (replace) router.replace(to)
    else router.push(to)
  }, [router, to, replace])
  return null
}

/** En Next el layout recibe children; Outlet solo existe por compatibilidad. */
export function Outlet() {
  return null
}

export function useNavigate() {
  const router = useRouter()
  return (to: string | number, opts?: { replace?: boolean }) => {
    if (typeof to === 'number') {
      router.back()
      return
    }
    if (opts?.replace) router.replace(to)
    else router.push(to)
  }
}

export function useLocation(): { pathname: string; search: string; hash: string } {
  // OJO: no usa useSearchParams de Next a propósito — ese hook fuerza bailout
  // a client-side rendering en páginas estáticas/ISR, y useLocation lo usan
  // Header/Layout (o sea, TODO el árbol). pathname es reactivo; search/hash se
  // leen del navegador (suficiente para los usos actuales: pathname y hash).
  const pathname = usePathname() ?? '/'
  const search = typeof window !== 'undefined' ? window.location.search : ''
  const hash = typeof window !== 'undefined' ? window.location.hash : ''
  return { pathname, search, hash }
}

export function useParams<T extends Record<string, string | undefined> = Record<string, string | undefined>>(): T {
  const params = nextUseParams() ?? {}
  const flat: Record<string, string | undefined> = {}
  for (const [k, v] of Object.entries(params)) flat[k] = Array.isArray(v) ? v[0] : (v as string | undefined)
  return flat as T
}

export function useSearchParams(): [
  URLSearchParams,
  (next: URLSearchParams, opts?: { replace?: boolean }) => void,
] {
  const sp = nextUseSearchParams()
  const router = useRouter()
  const pathname = usePathname() ?? '/'
  const params = new URLSearchParams(sp ? sp.toString() : '')
  const setParams = (next: URLSearchParams, opts?: { replace?: boolean }) => {
    const qs = next.toString()
    const url = qs ? `${pathname}?${qs}` : pathname
    if (opts?.replace === false) router.push(url)
    else router.replace(url)
  }
  return [params, setParams]
}
