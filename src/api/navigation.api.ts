/** Navegación: `GET /navigation` (menú editorial del CMS + categorías raíz). */
import { webBffRequest } from './web-bff.client'
import type { BffNavigation } from './types'

export function fetchNavigation(): Promise<BffNavigation> {
  return webBffRequest<BffNavigation>('/navigation')
}
