import { Navigate, Outlet, Route, useParams } from 'react-router-dom'
import { CmsShell } from '@/features/cms/components/layout/CmsShell'
import { AdvancedCmsDashboard } from '@/features/cms/components/dashboard/AdvancedCmsDashboard'
import { HomeVisualBuilder } from '@/features/cms/components/home-builder/HomeVisualBuilder'
import { LandingPagesList } from '@/features/cms/components/landing-pages/LandingPagesList'
import { LandingVisualBuilder } from '@/features/cms/components/landing-pages/LandingVisualBuilder'
import { SectionBuilder } from '@/features/cms/components/sections/SectionBuilder'
import { BannersList } from '@/features/cms/components/banners/BannersList'
import { BannerEditor } from '@/features/cms/components/banners/BannerEditor'
import { DynamicCarouselBuilder } from '@/features/cms/components/carousels/DynamicCarouselBuilder'
import { MediaLibraryAdvanced } from '@/features/cms/components/media/MediaLibraryAdvanced'
import { ProductExperienceManager } from '@/features/cms/components/product-experience/ProductExperienceManager'
import { FaqBuilder } from '@/features/cms/components/faq/FaqBuilder'
import { MenuBuilder } from '@/features/cms/components/menus/MenuBuilder'
import { MegaMenuBuilder } from '@/features/cms/components/menus/MegaMenuBuilder'
import { FooterBuilder } from '@/features/cms/components/footer/FooterBuilder'
import { CampaignManager } from '@/features/cms/components/campaigns/CampaignManager'
import { CampaignCalendar } from '@/features/cms/components/campaigns/CampaignCalendar'
import { CampaignDetail } from '@/features/cms/components/campaigns/CampaignDetail'
import { SeoContentHub } from '@/features/cms/components/seo/SeoContentHub'
import { ABTestManager } from '@/features/cms/components/experiments/ABTestManager'
import { SegmentBuilder } from '@/features/cms/components/segments/SegmentBuilder'
import { VisibilityRuleBuilder } from '@/features/cms/components/visibility-rules/VisibilityRuleBuilder'
import { PreviewCenter } from '@/features/cms/components/preview/PreviewCenter'
import { ApprovalWorkflowPanel } from '@/features/cms/components/approvals/ApprovalWorkflowPanel'
import { VersionTimeline } from '@/features/cms/components/versions/VersionTimeline'
import { AuditLogTable } from '@/features/cms/components/audit/AuditLogTable'
import { PerformanceContentMonitor } from '@/features/cms/components/performance/PerformanceContentMonitor'
import { PermissionMatrix } from '@/features/cms/components/permissions/PermissionMatrix'
import { CmsSettingsPanel } from '@/features/cms/components/settings/CmsSettingsPanel'

/** Layout del CMS: el shell (rail + topbar) envuelve las rutas hijas. */
function CmsShellLayout() {
  return (
    <CmsShell>
      <Outlet />
    </CmsShell>
  )
}

/* Adaptadores para rutas dinámicas: leen el :id y lo pasan como prop. */
function BannerEditRoute() {
  const { id } = useParams()
  return <BannerEditor bannerId={id} />
}
function LandingBuilderRoute() {
  const { id } = useParams()
  return <LandingVisualBuilder landingId={id} />
}
function CampaignDetailRoute() {
  const { id } = useParams()
  return <CampaignDetail campaignId={id ?? ''} />
}

/** Subárbol de rutas del CMS avanzado, montado bajo `/cms`. */
export function cmsRoutes() {
  return (
    <Route path="cms" element={<CmsShellLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<AdvancedCmsDashboard />} />

      {/* Contenido */}
      <Route path="home" element={<HomeVisualBuilder />} />
      <Route path="home/:id/builder" element={<HomeVisualBuilder />} />
      <Route path="landing-pages" element={<LandingPagesList />} />
      <Route path="landing-pages/:id/builder" element={<LandingBuilderRoute />} />
      <Route path="sections" element={<SectionBuilder />} />
      <Route path="banners" element={<BannersList />} />
      <Route path="banners/nuevo" element={<BannerEditor />} />
      <Route path="banners/:id" element={<BannerEditRoute />} />
      <Route path="carousels" element={<DynamicCarouselBuilder />} />
      <Route path="media" element={<MediaLibraryAdvanced />} />
      <Route path="product-experience" element={<ProductExperienceManager />} />
      <Route path="faq" element={<FaqBuilder />} />

      {/* Navegación */}
      <Route path="menus" element={<MenuBuilder />} />
      <Route path="mega-menu" element={<MegaMenuBuilder />} />
      <Route path="footer" element={<FooterBuilder />} />

      {/* Marketing & SEO */}
      <Route path="campaigns" element={<CampaignManager />} />
      <Route path="campaigns/calendar" element={<CampaignCalendar />} />
      <Route path="campaigns/:id" element={<CampaignDetailRoute />} />
      <Route path="seo" element={<SeoContentHub />} />
      <Route path="experiments" element={<ABTestManager />} />

      {/* Segmentación */}
      <Route path="segments" element={<SegmentBuilder />} />
      <Route path="visibility-rules" element={<VisibilityRuleBuilder />} />

      {/* Publicación */}
      <Route path="preview" element={<PreviewCenter />} />
      <Route path="approvals" element={<ApprovalWorkflowPanel />} />
      <Route path="versions" element={<VersionTimeline />} />

      {/* Gobierno */}
      <Route path="audit" element={<AuditLogTable />} />
      <Route path="performance" element={<PerformanceContentMonitor />} />
      <Route path="permissions" element={<PermissionMatrix />} />
      <Route path="settings" element={<CmsSettingsPanel />} />
    </Route>
  )
}
