/**
 * Tipos del dominio CMS Web (B2C/B2B). El CMS administra la vitrina digital
 * editable; NO es dueño de precio, stock ni promociones (solo los consulta).
 */

/* ----------------------------- Enums base ----------------------------- */

export type CmsStatus =
  | 'draft'
  | 'in_review'
  | 'changes_requested'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'unpublished'
  | 'inactive'
  | 'archived'
  | 'expired'
  | 'error'

export type CmsChannel = 'b2c' | 'b2b' | 'both'
export type CmsDevice = 'desktop' | 'mobile' | 'tablet' | 'all'

export type CmsSegmentType =
  | 'public'
  | 'logged_in'
  | 'b2c'
  | 'b2b'
  | 'b2b_credit'
  | 'b2b_no_credit'
  | 'internal_seller'
  | 'branch'
  | 'price_list'
  | 'industry'
  | 'geo'

/* --------------------------- Segmentación ----------------------------- */

export interface CmsSegment {
  id: string
  name: string
  type: CmsSegmentType
  description: string
  channel: CmsChannel
  members: number
  updatedAt: string
}

/* ----------------------- Reglas de visibilidad ------------------------ */

export type VisibilityField =
  | 'channel'
  | 'customer_type'
  | 'segment'
  | 'branch'
  | 'date'
  | 'device'
  | 'price_list'
  | 'visited_category'
  | 'active_campaign'
  | 'stock'

export type VisibilityOperator = 'is' | 'is_not' | 'in' | 'between' | 'gt' | 'lt'

export interface VisibilityCondition {
  id: string
  field: VisibilityField
  operator: VisibilityOperator
  value: string
}

export interface CmsVisibilityRule {
  id: string
  name: string
  match: 'all' | 'any'
  conditions: VisibilityCondition[]
  fallback: 'hide' | 'show_fallback'
  usedIn: number
  updatedAt: string
}

/* ------------------------------ Secciones ----------------------------- */

export type SectionType =
  | 'hero_banner'
  | 'banner_double'
  | 'banner_triple'
  | 'banner_grid'
  | 'banner_fullwidth'
  | 'banner_video'
  | 'banner_countdown'
  | 'banner_form'
  | 'carousel_manual'
  | 'carousel_dynamic'
  | 'product_grid'
  | 'products_by_category'
  | 'products_by_brand'
  | 'products_bestsellers'
  | 'products_new'
  | 'products_recommended'
  | 'products_b2b'
  | 'text_image'
  | 'rich_text'
  | 'video'
  | 'benefits'
  | 'testimonials'
  | 'buy_by_project'
  | 'buying_guides'
  | 'faq'
  | 'form'
  | 'stores_map'
  | 'services_block'
  | 'shipping_block'
  | 'featured_categories'
  | 'featured_brands'
  | 'mega_menu_embed'
  | 'quick_links'
  | 'project_cards'

export type SectionGroup = 'banners' | 'products' | 'content' | 'navigation'

export interface CmsSection {
  id: string
  internalName: string
  title: string
  subtitle: string
  type: SectionType
  group: SectionGroup
  order: number
  status: CmsStatus
  channel: CmsChannel
  device: CmsDevice
  segmentIds: string[]
  ruleId?: string
  startAt?: string
  endAt?: string
  updatedAt: string
  updatedBy: string
}

/* ------------------------------- Banners ------------------------------ */

export interface CmsBanner {
  id: string
  internalName: string
  title: string
  subtitle: string
  cta: string
  link: string
  imageDesktop: string
  imageMobile: string
  imageTablet: string
  alt: string
  placement: string
  channel: CmsChannel
  device: CmsDevice
  segmentIds: string[]
  branch: string
  priority: number
  startAt: string
  endAt: string
  utm: string
  analyticsEvent: string
  status: CmsStatus
  version: number
  abVariant?: 'A' | 'B'
  promotionId?: string
  clicks: number
  impressions: number
  updatedAt: string
  updatedBy: string
}

/* --------------------------- Landing pages ---------------------------- */

export type LandingType = 'campaign' | 'evergreen_seo' | 'b2b' | 'category' | 'project'

export interface CmsLandingPage {
  id: string
  internalName: string
  slug: string
  canonicalUrl: string
  channel: CmsChannel
  type: LandingType
  indexable: boolean
  metaTitle: string
  metaDescription: string
  h1: string
  ogTitle: string
  ogImage: string
  schema: string
  publishAt: string
  endAt: string
  segmentIds: string[]
  ruleId?: string
  activeVersion: number
  sections: number
  status: CmsStatus
  views: number
  conversion: number
  updatedAt: string
  updatedBy: string
}

/* ------------------------------- Media -------------------------------- */

export type MediaFormat = 'JPG' | 'PNG' | 'WEBP' | 'SVG' | 'GIF' | 'MP4'

export interface CmsMediaAsset {
  id: string
  name: string
  url: string
  format: MediaFormat
  weightKb: number
  dimensions: string
  alt: string
  tags: string[]
  folder: string
  usedIn: string[]
  uploadedAt: string
  uploadedBy: string
  status: 'active' | 'orphan' | 'expired'
  gradient?: string
}

/* ------------------------ Referencia de producto ---------------------- */

export interface CmsProductReference {
  sku: string
  name: string
  brand: string
  category: string
  imageOk: boolean
  webPublished: boolean
  priceAvailable: boolean
  stockAvailable: boolean
  promotionActive: boolean
  status: 'ok' | 'warning' | 'error'
  gradient?: string
}

/* ------------------------------ Carruseles ---------------------------- */

export type CarouselRule =
  | 'manual'
  | 'by_category'
  | 'by_brand'
  | 'by_price'
  | 'by_discount'
  | 'by_stock'
  | 'bestsellers'
  | 'new'
  | 'high_rotation'
  | 'b2b_recommended'
  | 'frequent_reorder'
  | 'complementary'

export interface CmsCarousel {
  id: string
  title: string
  rule: CarouselRule
  channel: CmsChannel
  maxItems: number
  hideNoStock: boolean
  hideNoPrice: boolean
  onlyPublished: boolean
  excludeBrands: string[]
  excludeCategories: string[]
  excludeSkus: string[]
  status: CmsStatus
  updatedAt: string
}

/* -------------------------------- Menús ------------------------------- */

export type MenuItemType = 'manual' | 'category' | 'landing' | 'external'

export interface CmsMenuItem {
  id: string
  label: string
  type: MenuItemType
  url: string
  icon?: string
  image?: string
  badge?: string
  order: number
  channel: CmsChannel
  device: CmsDevice
  visible: boolean
  children?: CmsMenuItem[]
}

export interface CmsMenu {
  id: string
  name: string
  location: 'header' | 'footer' | 'mega' | 'mobile'
  channel: CmsChannel
  items: CmsMenuItem[]
  itemCount: number
  brokenLinks: number
  updatedAt: string
  status: CmsStatus
}

/* -------------------------------- Footer ------------------------------ */

export interface FooterColumn {
  id: string
  title: string
  links: { label: string; url: string; valid: boolean }[]
}

export interface CmsFooter {
  id: string
  channel: CmsChannel
  columns: FooterColumn[]
  socials: { network: string; url: string; valid: boolean }[]
  paymentMethods: string[]
  newsletterEnabled: boolean
  status: CmsStatus
  updatedAt: string
}

/* --------------------------------- SEO -------------------------------- */

export type SeoScope = 'home' | 'category' | 'landing' | 'info_page'

export interface SeoIssue {
  code: string
  label: string
  severity: 'error' | 'warning'
}

export interface CmsSeoContent {
  id: string
  scope: SeoScope
  target: string
  slug: string
  metaTitle: string
  metaDescription: string
  h1: string
  topText: string
  bottomText: string
  canonical: string
  indexable: boolean
  ogTitle: string
  ogImage: string
  faqEnabled: boolean
  issues: SeoIssue[]
  status: CmsStatus
  updatedAt: string
}

/* --------------------------------- FAQ -------------------------------- */

export type FaqScope = 'category' | 'product' | 'landing' | 'shipping' | 'returns' | 'b2b' | 'checkout'

export interface CmsFaq {
  id: string
  question: string
  answer: string
  scope: FaqScope
  target: string
  channel: CmsChannel
  order: number
  schemaEnabled: boolean
  status: CmsStatus
  updatedAt: string
}

/* ------------------------------ Campañas ------------------------------ */

export interface CmsCampaign {
  id: string
  name: string
  channel: CmsChannel
  startAt: string
  endAt: string
  owner: string
  approver: string
  status: CmsStatus
  pieces: {
    banners: number
    landings: number
    carousels: number
    sections: number
    faqs: number
    seo: number
  }
  conflicts: number
  promotionId?: string
  updatedAt: string
}

/* ---------------------- Publicaciones / versiones --------------------- */

export interface CmsPublication {
  id: string
  entityType: string
  entityName: string
  channel: CmsChannel
  status: CmsStatus
  scheduledAt?: string
  publishedAt?: string
  requestedBy: string
  approvedBy?: string
  dueDate?: string
  comments: number
}

export interface CmsVersion {
  id: string
  entityType: string
  entityId: string
  entityName: string
  version: number
  isActive: boolean
  author: string
  createdAt: string
  note: string
  changes: number
}

/* ---------------------------- Experimentos ---------------------------- */

export type AbMetric = 'cta_click' | 'add_to_cart' | 'conversion' | 'time_on_page' | 'scroll' | 'form_submit'

export interface CmsExperiment {
  id: string
  name: string
  entityType: string
  entityName: string
  trafficA: number
  trafficB: number
  metric: AbMetric
  startAt: string
  endAt: string
  status: 'draft' | 'running' | 'paused' | 'finished'
  winner?: 'A' | 'B' | null
  liftA: number
  liftB: number
}

/* ------------------------------ Auditoría ----------------------------- */

export interface CmsAuditLog {
  id: string
  user: string
  action: string
  entityType: string
  entityName: string
  before: string
  after: string
  statusBefore?: CmsStatus
  statusAfter?: CmsStatus
  device: string
  at: string
}

/* ------------------------------ Permisos ------------------------------ */

export type CmsRole =
  | 'admin'
  | 'marketing'
  | 'comercial_web'
  | 'seo'
  | 'design'
  | 'approver'
  | 'read_only'

export interface CmsPermission {
  key: string
  label: string
  group: string
  roles: CmsRole[]
}

/* --------------------------- Configuración ---------------------------- */

export interface CmsSettings {
  allowedFormats: MediaFormat[]
  maxWeightMb: number
  channels: CmsChannel[]
  requireApproval: boolean
  autoPublishScheduled: boolean
  auditEnabled: boolean
  previewToken: string
}

/* ------------------------- Estado de fetch UI ------------------------- */

export type LoadState = 'idle' | 'loading' | 'success' | 'error' | 'empty'

/* --------------------------- Dashboard KPIs --------------------------- */

export interface DashboardKpi {
  key: string
  label: string
  value: number
  hint: string
  tone: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand'
  icon: string
}

export interface DashboardAlert {
  id: string
  severity: 'critical' | 'warning' | 'info'
  title: string
  detail: string
  module: string
  href: string
}

export interface DashboardActivity {
  id: string
  user: string
  action: string
  entity: string
  at: string
  status: CmsStatus
}
