import { simulateRequest } from './simulate'
import { banners } from '@/features/cms/mocks'
import type { CmsBanner } from '@/features/cms/types'

export const cmsBannersApi = {
  list: (): Promise<CmsBanner[]> => simulateRequest(banners),
  get: (id: string): Promise<CmsBanner | undefined> => simulateRequest(banners.find((b) => b.id === id)),
}
