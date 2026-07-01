import { simulateRequest } from './simulate'
import { media } from '@/features/cms/mocks'
import type { CmsMediaAsset } from '@/features/cms/types'

export const cmsMediaApi = {
  list: (): Promise<CmsMediaAsset[]> => simulateRequest(media),
}
