import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'

type NextLinkProps = { href: string; children?: ReactNode } & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  'href'
>

/** Shim de `next/link` sobre react-router: mapea `href` → `to`. */
export default function Link({ href, children, ...rest }: NextLinkProps) {
  return (
    <RouterLink to={href} {...rest}>
      {children}
    </RouterLink>
  )
}
