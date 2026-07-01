import { simulateRequest } from './simulate'
import { dashboardActivity, dashboardAlerts, dashboardKpis, pendingPublications } from '@/features/cms/mocks'

export interface DashboardOverview {
  kpis: typeof dashboardKpis
  alerts: typeof dashboardAlerts
  activity: typeof dashboardActivity
  pending: typeof pendingPublications
}

export const cmsDashboardApi = {
  getOverview: (): Promise<DashboardOverview> =>
    simulateRequest({ kpis: dashboardKpis, alerts: dashboardAlerts, activity: dashboardActivity, pending: pendingPublications }),
}
