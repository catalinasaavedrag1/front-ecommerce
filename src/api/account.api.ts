/**
 * Cuenta cliente / B2B. Requiere sesión (token). El BFF resuelve el customerId
 * desde el JWT — el front no lo envía.
 *
 * Endpoints reales del BFF:
 *   GET   /account/profile
 *   PATCH /account/profile
 *   GET   /account/addresses
 *   POST  /account/addresses
 *   PATCH /account/addresses/:addressId
 *   DELETE/account/addresses/:addressId
 *
 * GAP documentado (ver docs/CONTRATOS-BFF.md): faltan /account/companies,
 * /account/price-lists y /account/permissions que pide el brief B2B.
 */
import { webBffRequest } from './web-bff.client'
import type { BffAccountProfile, BffAddress } from './types'

export function fetchProfile(): Promise<BffAccountProfile> {
  return webBffRequest<BffAccountProfile>('/account/profile')
}

export function updateProfile(patch: Partial<BffAccountProfile>): Promise<BffAccountProfile> {
  return webBffRequest<BffAccountProfile>('/account/profile', { method: 'PATCH', body: patch })
}

export function fetchAddresses(): Promise<BffAddress[]> {
  return webBffRequest<BffAddress[]>('/account/addresses')
}

export function createAddress(address: Omit<BffAddress, 'id'>): Promise<BffAddress> {
  return webBffRequest<BffAddress>('/account/addresses', { method: 'POST', body: address })
}

export function updateAddress(addressId: string, patch: Partial<BffAddress>): Promise<BffAddress> {
  return webBffRequest<BffAddress>(`/account/addresses/${encodeURIComponent(addressId)}`, {
    method: 'PATCH',
    body: patch,
  })
}

export function deleteAddress(addressId: string): Promise<void> {
  return webBffRequest<void>(`/account/addresses/${encodeURIComponent(addressId)}`, { method: 'DELETE' })
}
