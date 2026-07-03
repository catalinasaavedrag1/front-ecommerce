/**
 * Utilidades mínimas de cookies.
 *
 * Este front es un SPA (Vite) y hoy persiste sesión/token en localStorage
 * (ver `session.ts` y `auth.ts`). Estas funciones existen para el día en que
 * el proyecto migre a SSR y necesite leer/escribir cookies (por ejemplo un
 * `x-session-id` emitido httpOnly por el servidor). No se usan en el flujo
 * actual, pero centralizan el manejo para no reinventarlo por ahí.
 */

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function setCookie(
  name: string,
  value: string,
  opts: { maxAgeDays?: number; path?: string; sameSite?: 'Lax' | 'Strict' | 'None'; secure?: boolean } = {},
): void {
  if (typeof document === 'undefined') return
  const { maxAgeDays = 365, path = '/', sameSite = 'Lax', secure = true } = opts
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    `path=${path}`,
    `max-age=${Math.round(maxAgeDays * 24 * 60 * 60)}`,
    `SameSite=${sameSite}`,
  ]
  if (secure) parts.push('Secure')
  document.cookie = parts.join('; ')
}

export function deleteCookie(name: string, path = '/'): void {
  if (typeof document === 'undefined') return
  document.cookie = `${name}=; path=${path}; max-age=0`
}
