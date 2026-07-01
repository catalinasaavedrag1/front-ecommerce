import type {
  AbMetric,
  CarouselRule,
  CmsChannel,
  CmsDevice,
  CmsRole,
  CmsStatus,
  CmsSegmentType,
} from '@/features/cms/types'

export const CMS_BASE = '/cms'

/* ------------------------------- Estados ------------------------------ */

export type Tone = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand'

export const STATUS_META: Record<CmsStatus, { label: string; tone: Tone }> = {
  draft: { label: 'Borrador', tone: 'default' },
  in_review: { label: 'En revisión', tone: 'warning' },
  changes_requested: { label: 'Cambios solicitados', tone: 'warning' },
  approved: { label: 'Aprobado', tone: 'info' },
  scheduled: { label: 'Programado', tone: 'brand' },
  published: { label: 'Publicado', tone: 'success' },
  unpublished: { label: 'Despublicado', tone: 'default' },
  inactive: { label: 'Inactivo', tone: 'default' },
  archived: { label: 'Archivado', tone: 'default' },
  expired: { label: 'Vencido', tone: 'danger' },
  error: { label: 'Con error', tone: 'danger' },
}

export const CHANNEL_LABEL: Record<CmsChannel, string> = {
  b2c: 'B2C',
  b2b: 'B2B',
  both: 'B2C + B2B',
}

export const DEVICE_LABEL: Record<CmsDevice, string> = {
  desktop: 'Escritorio',
  mobile: 'Móvil',
  tablet: 'Tablet',
  all: 'Todos',
}

export const SEGMENT_TYPE_LABEL: Record<CmsSegmentType, string> = {
  public: 'Público general',
  logged_in: 'Cliente logueado',
  b2c: 'Cliente B2C',
  b2b: 'Cliente B2B',
  b2b_credit: 'Empresa con crédito',
  b2b_no_credit: 'Empresa sin crédito',
  internal_seller: 'Vendedor interno',
  branch: 'Sucursal preferida',
  price_list: 'Lista de precio',
  industry: 'Rubro de cliente',
  geo: 'Zona geográfica',
}

export const CAROUSEL_RULE_LABEL: Record<CarouselRule, string> = {
  manual: 'Manual por SKU',
  by_category: 'Por categoría',
  by_brand: 'Por marca',
  by_price: 'Por precio',
  by_discount: 'Por descuento',
  by_stock: 'Por stock',
  bestsellers: 'Más vendidos',
  new: 'Nuevos productos',
  high_rotation: 'Alta rotación',
  b2b_recommended: 'Recomendados B2B',
  frequent_reorder: 'Recompra frecuente',
  complementary: 'Complementarios',
}

export const AB_METRIC_LABEL: Record<AbMetric, string> = {
  cta_click: 'Click en CTA',
  add_to_cart: 'Agregar al carrito',
  conversion: 'Conversión',
  time_on_page: 'Tiempo en página',
  scroll: 'Scroll',
  form_submit: 'Formulario enviado',
}

export const ROLE_LABEL: Record<CmsRole, string> = {
  admin: 'Administrador CMS',
  marketing: 'Marketing',
  comercial_web: 'Comercial Web',
  seo: 'SEO',
  design: 'Diseño',
  approver: 'Aprobador',
  read_only: 'Solo lectura',
}

/* ----------------------------- Navegación ----------------------------- */

export type IconKey =
  | 'dashboard' | 'home' | 'landing' | 'sections' | 'banner' | 'media' | 'product'
  | 'carousel' | 'faq' | 'menu' | 'mega' | 'footer' | 'seo' | 'campaign' | 'calendar'
  | 'experiment' | 'segment' | 'rules' | 'preview' | 'approval' | 'version' | 'audit'
  | 'performance' | 'permission' | 'settings'

export interface NavItem { key: string; label: string; href: string; icon: IconKey }
/** Una sección = un ícono del rail. Sus `items` son la sub-navegación contextual. */
export interface NavGroup { key: string; title: string; icon: IconKey; items: NavItem[] }

export const NAV: NavGroup[] = [
  {
    key: 'inicio', title: 'Inicio', icon: 'dashboard',
    items: [{ key: 'dashboard', label: 'Dashboard', href: `${CMS_BASE}/dashboard`, icon: 'dashboard' }],
  },
  {
    key: 'contenido', title: 'Contenido', icon: 'sections',
    items: [
      { key: 'home', label: 'Home Builder', href: `${CMS_BASE}/home`, icon: 'home' },
      { key: 'landing-pages', label: 'Landing Pages', href: `${CMS_BASE}/landing-pages`, icon: 'landing' },
      { key: 'sections', label: 'Secciones', href: `${CMS_BASE}/sections`, icon: 'sections' },
      { key: 'banners', label: 'Banners', href: `${CMS_BASE}/banners`, icon: 'banner' },
      { key: 'carousels', label: 'Carruseles', href: `${CMS_BASE}/carousels`, icon: 'carousel' },
      { key: 'media', label: 'Media Library', href: `${CMS_BASE}/media`, icon: 'media' },
      { key: 'product-experience', label: 'Product Experience', href: `${CMS_BASE}/product-experience`, icon: 'product' },
      { key: 'faq', label: 'FAQ / Ayuda', href: `${CMS_BASE}/faq`, icon: 'faq' },
    ],
  },
  {
    key: 'navegacion', title: 'Navegación', icon: 'menu',
    items: [
      { key: 'menus', label: 'Menús', href: `${CMS_BASE}/menus`, icon: 'menu' },
      { key: 'mega-menu', label: 'Mega Menú', href: `${CMS_BASE}/mega-menu`, icon: 'mega' },
      { key: 'footer', label: 'Footer', href: `${CMS_BASE}/footer`, icon: 'footer' },
    ],
  },
  {
    key: 'marketing', title: 'Marketing & SEO', icon: 'campaign',
    items: [
      { key: 'campaigns', label: 'Campañas', href: `${CMS_BASE}/campaigns`, icon: 'campaign' },
      { key: 'campaigns-calendar', label: 'Calendario', href: `${CMS_BASE}/campaigns/calendar`, icon: 'calendar' },
      { key: 'seo', label: 'SEO Hub', href: `${CMS_BASE}/seo`, icon: 'seo' },
      { key: 'experiments', label: 'Experimentos A/B', href: `${CMS_BASE}/experiments`, icon: 'experiment' },
    ],
  },
  {
    key: 'segmentacion', title: 'Segmentación', icon: 'segment',
    items: [
      { key: 'segments', label: 'Segmentos', href: `${CMS_BASE}/segments`, icon: 'segment' },
      { key: 'visibility-rules', label: 'Reglas de visibilidad', href: `${CMS_BASE}/visibility-rules`, icon: 'rules' },
    ],
  },
  {
    key: 'publicacion', title: 'Publicación', icon: 'approval',
    items: [
      { key: 'preview', label: 'Preview Center', href: `${CMS_BASE}/preview`, icon: 'preview' },
      { key: 'approvals', label: 'Aprobaciones', href: `${CMS_BASE}/approvals`, icon: 'approval' },
      { key: 'versions', label: 'Versiones & Rollback', href: `${CMS_BASE}/versions`, icon: 'version' },
    ],
  },
  {
    key: 'gobierno', title: 'Gobierno', icon: 'settings',
    items: [
      { key: 'audit', label: 'Auditoría', href: `${CMS_BASE}/audit`, icon: 'audit' },
      { key: 'performance', label: 'Performance', href: `${CMS_BASE}/performance`, icon: 'performance' },
      { key: 'permissions', label: 'Permisos', href: `${CMS_BASE}/permissions`, icon: 'permission' },
      { key: 'settings', label: 'Configuración', href: `${CMS_BASE}/settings`, icon: 'settings' },
    ],
  },
]

/** Resuelve la sección y el módulo activos a partir del pathname (mejor match). */
export function activeNav(pathname: string): { group: NavGroup; item?: NavItem } {
  let best: { group: NavGroup; item?: NavItem; len: number } = { group: NAV[0], len: -1 }
  for (const g of NAV) {
    for (const it of g.items) {
      if (pathname === it.href || pathname.startsWith(it.href + '/')) {
        if (it.href.length > best.len) best = { group: g, item: it, len: it.href.length }
      }
    }
  }
  return { group: best.group, item: best.item }
}

/* --------------------- Metadata de módulos (scaffold) ------------------ */

export interface ModuleMeta {
  title: string
  eyebrow: string
  description: string
  capabilities: string[]
  iteration: number
}

export const MODULES: Record<string, ModuleMeta> = {
  home: {
    title: 'Home Builder',
    eyebrow: 'Contenido',
    description: 'Construye la home por bloques con drag & drop, versiones desktop/mobile/tablet, variantes por segmento y programación por sección.',
    capabilities: ['Editor por bloques (3 columnas)', 'Canal B2C/B2B', 'Variantes por segmento', 'Programación por sección', 'Preview con fecha futura', 'Rollback de home completa', 'Clonar / Home por campaña / sucursal'],
    iteration: 2,
  },
  'landing-pages': {
    title: 'Landing Page Builder',
    eyebrow: 'Contenido',
    description: 'Landings por campaña, evergreen SEO, B2B, categoría o proyecto, con secciones drag & drop, SEO completo, FAQ y versionado.',
    capabilities: ['Tipos: campaña, SEO, B2B, categoría, proyecto', 'SEO completo + Open Graph + Schema', 'Secciones drag & drop', 'Segmentación y reglas', 'Preview avanzado', 'Aprobaciones y rollback'],
    iteration: 2,
  },
  sections: {
    title: 'Section Builder',
    eyebrow: 'Contenido',
    description: 'Biblioteca de secciones (banners, productos, contenido, navegación) reutilizables con configuración desktop/mobile y reglas.',
    capabilities: ['30+ tipos de sección', 'Config desktop / mobile', 'Reglas de visibilidad', 'Segmentación B2C/B2B', 'Programación', 'Validaciones antes de publicar'],
    iteration: 3,
  },
  carousels: {
    title: 'Dynamic Carousel Builder',
    eyebrow: 'Contenido',
    description: 'Carruseles manuales o dinámicos por regla (categoría, marca, descuento, más vendidos, B2B…), con exclusiones y fallback.',
    capabilities: ['Reglas dinámicas de selección', 'Ocultar sin stock / sin precio', 'Solo web-published', 'Exclusión de marcas/categorías/SKUs', 'Segmento B2B/B2C', 'Fallback'],
    iteration: 3,
  },
  'product-experience': {
    title: 'Product Experience Manager',
    eyebrow: 'Contenido',
    description: 'Decide cómo se presentan los productos en el contenido. Consulta catálogo/precio/stock/promos, no los administra.',
    capabilities: ['Vitrinas manuales', 'Grupos comerciales de SKUs', 'Health-check de catálogo', 'Integración simulada: catalog / pricing / inventory / promotion / search', 'Relacionados manuales'],
    iteration: 2,
  },
  'mega-menu': {
    title: 'Mega Menu Builder',
    eyebrow: 'Navegación',
    description: 'Mega menú con subniveles, íconos, imágenes y badges, con orden drag & drop y preview desktop/mobile.',
    capabilities: ['Subniveles', 'Íconos / imágenes / badges', 'Links a categorías/landings/externos', 'Orden drag & drop', 'Validación de links rotos', 'Canal y dispositivo'],
    iteration: 3,
  },
  footer: {
    title: 'Footer Builder',
    eyebrow: 'Navegación',
    description: 'Footer B2C/B2B/mobile con columnas editables, legales, redes, medios de pago, newsletter y validaciones.',
    capabilities: ['Columnas editables', 'Legales y políticas', 'Redes y WhatsApp', 'Medios de pago', 'Newsletter', 'Validación de links/teléfonos'],
    iteration: 3,
  },
  seo: {
    title: 'SEO Content Hub',
    eyebrow: 'Marketing & SEO',
    description: 'Metadatos editables de home, categorías, landings y páginas informativas, con validaciones y vista SERP.',
    capabilities: ['Meta title/description, H1, textos', 'Canonical, slug, indexable', 'Open Graph', 'FAQ SEO', 'Validaciones (H1 vacío/duplicado, meta largo…)', 'Redirecciones sugeridas'],
    iteration: 2,
  },
  campaigns: {
    title: 'Campaign Manager',
    eyebrow: 'Marketing & SEO',
    description: 'Gestiona campañas completas (banners, landings, carruseles, bloques, productos, SEO, FAQ) con fechas, responsables y aprobación del paquete.',
    capabilities: ['Agrupar todas las piezas', 'Duplicar campaña anterior', 'Programar y activar/desactivar', 'Ver conflictos', 'Calendario', 'Aprobar todo el paquete', 'Vincular a promoción'],
    iteration: 2,
  },
  faq: {
    title: 'FAQ / Help Content Builder',
    eyebrow: 'Contenido',
    description: 'FAQ por categoría, producto, landing, despacho, devoluciones, B2B o checkout, con orden drag & drop y schema FAQ.',
    capabilities: ['FAQ por página/categoría/producto', 'Preguntas reutilizables', 'Orden drag & drop', 'Schema FAQ', 'Estado publicado/borrador', 'Canal B2C/B2B'],
    iteration: 3,
  },
  menus: {
    title: 'Menú Builder',
    eyebrow: 'Navegación',
    description: 'Menús header/mobile/B2B/por sucursal con subniveles, íconos, imágenes, links a categorías/landings y validación de links.',
    capabilities: ['Menú desktop / mobile / B2B', 'Subniveles', 'Links a categorías/landings/externos', 'Orden drag & drop', 'Preview desktop/mobile', 'Validación de links rotos'],
    iteration: 3,
  },
  approvals: {
    title: 'Workflow de aprobación',
    eyebrow: 'Publicación',
    description: 'Flujo Borrador → En revisión → Cambios → Aprobado → Programado → Publicado, con comentarios, responsables y bloqueo de edición.',
    capabilities: ['Estados del flujo', 'Comentarios y menciones', 'Historial de aprobación', 'Responsable y fecha límite', 'Bloqueo al aprobar'],
    iteration: 2,
  },
  versions: {
    title: 'Versionado & Rollback',
    eyebrow: 'Publicación',
    description: 'Historial de versiones con comparación, restauración y rollback de banner, landing o home completa.',
    capabilities: ['Historial de versiones', 'Comparar versiones', 'Restaurar / rollback', 'Quién cambió qué', 'Duplicar versión'],
    iteration: 2,
  },
  'campaigns-calendar': {
    title: 'Calendario editorial',
    eyebrow: 'Marketing & SEO',
    description: 'Calendario comercial con vistas mensual/semanal/timeline/lista, conflictos y espacios ocupados en home.',
    capabilities: ['Vistas mensual/semanal/timeline/lista', 'Por canal / responsable / estado', 'Conflictos entre campañas', 'Banners que se pisan', 'Contenido que vence'],
    iteration: 2,
  },
  experiments: {
    title: 'Experimentos A/B',
    eyebrow: 'Marketing & SEO',
    description: 'Crea variantes A/B, define tráfico y métrica objetivo, pausa y elige ganador.',
    capabilities: ['Variante A / B', 'Split de tráfico', 'Métrica objetivo', 'Fechas y pausa', 'Selección de ganador'],
    iteration: 3,
  },
  segments: {
    title: 'Segment Builder',
    eyebrow: 'Segmentación',
    description: 'Segmentos B2C/B2B (crédito, sucursal, lista de precio, rubro, zona) para personalizar contenido con fallback.',
    capabilities: ['Segmentos B2C/B2B', 'Asignar contenido a segmentos', 'Previsualizar como segmento', 'Evitar conflictos', 'Fallback general'],
    iteration: 2,
  },
  'visibility-rules': {
    title: 'Visibility Rule Builder',
    eyebrow: 'Segmentación',
    description: 'Editor visual de reglas (canal, tipo cliente, segmento, sucursal, fecha, dispositivo, stock…) con fallback.',
    capabilities: ['Constructor visual de condiciones', 'AND / OR', 'Fallback ocultar/mostrar', '10 tipos de condición', 'Reutilizable en secciones'],
    iteration: 2,
  },
  preview: {
    title: 'Preview Center',
    eyebrow: 'Publicación',
    description: 'Simula la web como la verá un cliente específico: dispositivo, canal, segmento, sucursal, lista de precio y fecha futura.',
    capabilities: ['Desktop/Mobile/Tablet', 'Canal B2C/B2B', 'Cliente/segmento específico', 'Lista de precio / sucursal', 'Fecha futura', 'Campaña'],
    iteration: 2,
  },
  audit: {
    title: 'Auditoría',
    eyebrow: 'Gobierno',
    description: 'Registro completo: usuario, acción, contenido, valor anterior/nuevo, fecha y estado.',
    capabilities: ['Log inmutable', 'Valor anterior / nuevo', 'Estado anterior / nuevo', 'Filtros por usuario/acción/entidad', 'Exportable'],
    iteration: 2,
  },
  performance: {
    title: 'Performance Content Monitor',
    eyebrow: 'Gobierno',
    description: 'Alertas de contenido: imágenes pesadas, exceso de secciones/carruseles, sin WebP, sin versión mobile, links rotos.',
    capabilities: ['Imágenes pesadas / sin WebP', 'Exceso de secciones/carruseles', 'Sin versión mobile', 'Links rotos', 'Contenido duplicado', 'Score por página'],
    iteration: 2,
  },
  permissions: {
    title: 'Permisos granulares',
    eyebrow: 'Gobierno',
    description: 'Matriz de permisos por rol (Admin, Marketing, Comercial Web, SEO, Diseño, Aprobador, Solo lectura).',
    capabilities: ['Matriz permiso × rol', 'cms.*.view/edit/publish', 'Roles predefinidos', 'Bloqueo de acciones críticas'],
    iteration: 2,
  },
  settings: {
    title: 'Configuración CMS',
    eyebrow: 'Gobierno',
    description: 'Formatos, tamaños por banner, estados, canales, segmentos, flujo de aprobación, límites de peso y plantillas.',
    capabilities: ['Formatos y peso máximo', 'Canales y segmentos', 'Flujo de aprobación', 'Plantillas de landing/sección', 'Config de preview y fallback'],
    iteration: 2,
  },
}
