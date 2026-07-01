import type {
  CmsAuditLog,
  CmsBanner,
  CmsCampaign,
  CmsCarousel,
  CmsExperiment,
  CmsFaq,
  CmsLandingPage,
  CmsMediaAsset,
  CmsMenu,
  CmsPermission,
  CmsProductReference,
  CmsPublication,
  CmsSection,
  CmsSegment,
  CmsSeoContent,
  CmsVersion,
  CmsVisibilityRule,
  DashboardActivity,
  DashboardAlert,
  DashboardKpi,
} from '@/features/cms/types'

const G = {
  blue: 'linear-gradient(120deg,#102a63,#1f4aa8)',
  green: 'linear-gradient(120deg,#0f6347,#1aa06f)',
  red: 'linear-gradient(120deg,#7a1d15,#e1251b)',
  navy: 'linear-gradient(140deg,#0e2a63,#1e4f8a)',
  teal: 'linear-gradient(120deg,#0e7490,#22d3ee)',
  amber: 'linear-gradient(120deg,#d8261c,#f6a821)',
}

/* ------------------------------ Dashboard ----------------------------- */

export const dashboardKpis: DashboardKpi[] = [
  { key: 'published', label: 'Contenido publicado', value: 148, hint: '32 este mes', tone: 'success', icon: 'published' },
  { key: 'scheduled', label: 'Programado', value: 19, hint: 'Próximos 30 días', tone: 'brand', icon: 'calendar' },
  { key: 'pending', label: 'Pendiente de aprobación', value: 7, hint: '2 vencen hoy', tone: 'warning', icon: 'approval' },
  { key: 'campaigns', label: 'Campañas activas', value: 5, hint: '1 por vencer', tone: 'info', icon: 'campaign' },
  { key: 'banner_issues', label: 'Banners con problemas', value: 3, hint: 'Peso / sin mobile', tone: 'danger', icon: 'banner' },
  { key: 'seo_errors', label: 'Errores SEO', value: 11, hint: 'H1 y meta', tone: 'danger', icon: 'seo' },
  { key: 'broken_links', label: 'Links rotos', value: 4, hint: 'Footer y menús', tone: 'warning', icon: 'rules' },
  { key: 'expired', label: 'Contenido vencido', value: 6, hint: 'Requiere revisión', tone: 'default', icon: 'version' },
]

export const dashboardAlerts: DashboardAlert[] = [
  { id: 'al-1', severity: 'critical', title: 'Banner activo sin promoción vigente', detail: '“Invierno · Calefacción 30%” sigue publicado pero la promoción terminó ayer.', module: 'Banners', href: '/comercial-web/cms/banners' },
  { id: 'al-2', severity: 'critical', title: 'Landing indexable sin contenido', detail: '/campanas/fiestas-patrias está indexable pero tiene 0 secciones.', module: 'Landing Pages', href: '/comercial-web/cms/landing-pages' },
  { id: 'al-3', severity: 'warning', title: '3 imágenes superan 400 KB', detail: 'Se recomienda convertir a WebP para mejorar la carga mobile.', module: 'Media', href: '/comercial-web/cms/media' },
  { id: 'al-4', severity: 'warning', title: '2 secciones sin versión mobile', detail: 'Hero B2B y Beneficios no tienen configuración mobile.', module: 'Home Builder', href: '/comercial-web/cms/home' },
  { id: 'al-5', severity: 'info', title: 'Campaña “Primavera Jardín” inicia en 5 días', detail: 'Tiene 4 piezas pendientes de aprobación.', module: 'Campañas', href: '/comercial-web/cms/campaigns' },
]

export const dashboardActivity: DashboardActivity[] = [
  { id: 'ac-1', user: 'María González', action: 'publicó', entity: 'Banner · Pinturas 20% látex', at: 'Hace 25 min', status: 'published' },
  { id: 'ac-2', user: 'Diego Soto', action: 'envió a revisión', entity: 'Landing · Convenios Empresas 2026', at: 'Hace 1 h', status: 'in_review' },
  { id: 'ac-3', user: 'Carolina Pérez', action: 'aprobó', entity: 'Home · Variante B2B', at: 'Hace 2 h', status: 'approved' },
  { id: 'ac-4', user: 'Javier Rojas', action: 'programó', entity: 'Campaña · Fiestas Patrias', at: 'Hace 3 h', status: 'scheduled' },
  { id: 'ac-5', user: 'María González', action: 'restauró versión', entity: 'Footer B2C · v12', at: 'Ayer', status: 'published' },
]

export const pendingPublications: CmsPublication[] = [
  { id: 'pb-1', entityType: 'Landing', entityName: 'Convenios Empresas 2026', channel: 'b2b', status: 'in_review', requestedBy: 'Diego Soto', dueDate: '2026-07-01', comments: 3 },
  { id: 'pb-2', entityType: 'Banner', entityName: 'Fiestas Patrias · Obra gruesa', channel: 'both', status: 'in_review', requestedBy: 'Javier Rojas', dueDate: '2026-07-02', comments: 1 },
  { id: 'pb-3', entityType: 'Sección', entityName: 'Carrusel recompra B2B', channel: 'b2b', status: 'changes_requested', requestedBy: 'María González', dueDate: '2026-07-03', comments: 5 },
  { id: 'pb-4', entityType: 'Landing', entityName: 'Primavera Jardín', channel: 'b2c', status: 'approved', scheduledAt: '2026-09-01', requestedBy: 'Marketing', approvedBy: 'Carolina Pérez', comments: 0 },
]

/* ------------------------------- Banners ------------------------------ */

export const banners: CmsBanner[] = [
  { id: 'bn-1001', internalName: 'Invierno calefacción hero', title: 'Tu hogar más cálido', subtitle: 'Hasta 30% en calefacción', cta: 'Ver ofertas', link: '/categoria/electrohogar', imageDesktop: G.blue, imageMobile: G.blue, imageTablet: G.blue, alt: 'Estufas y calefactores en oferta', placement: 'Home · Hero', channel: 'both', device: 'all', segmentIds: ['sg-1'], branch: 'Todas', priority: 1, startAt: '2026-06-15', endAt: '2026-06-30', utm: 'utm_campaign=invierno', analyticsEvent: 'banner_invierno', status: 'error', version: 4, promotionId: 'PRM-8841', clicks: 1842, impressions: 48210, updatedAt: '2026-06-28', updatedBy: 'María González' },
  { id: 'bn-1002', internalName: 'Pinturas latex hero', title: 'Renueva tus espacios', subtitle: '20% en látex premium', cta: 'Ver pinturas', link: '/categoria/pinturas', imageDesktop: G.green, imageMobile: G.green, imageTablet: G.green, alt: 'Pinturas látex premium', placement: 'Home · Hero', channel: 'b2c', device: 'all', segmentIds: ['sg-2'], branch: 'Todas', priority: 2, startAt: '2026-06-20', endAt: '2026-07-20', utm: 'utm_campaign=pinturas', analyticsEvent: 'banner_pinturas', status: 'published', version: 2, promotionId: 'PRM-8850', clicks: 967, impressions: 31044, updatedAt: '2026-06-27', updatedBy: 'Diego Soto' },
  { id: 'bn-1003', internalName: 'Empresas mayorista hero', title: 'Precios mayoristas para tu obra', subtitle: 'Cotiza en línea', cta: 'Ir al portal', link: '/empresas', imageDesktop: G.green, imageMobile: G.green, imageTablet: G.green, alt: 'Portal empresas', placement: 'Home · Hero', channel: 'b2b', device: 'all', segmentIds: ['sg-3'], branch: 'Todas', priority: 1, startAt: '2026-06-01', endAt: '2026-08-31', utm: 'utm_campaign=empresas', analyticsEvent: 'banner_empresas', status: 'published', version: 1, clicks: 412, impressions: 9820, updatedAt: '2026-06-25', updatedBy: 'Comercial Web' },
  { id: 'bn-1004', internalName: 'Fiestas patrias obra', title: 'Adelanta tu obra gruesa', subtitle: 'Cemento, fierro y áridos', cta: 'Ver materiales', link: '/categoria/construccion', imageDesktop: G.red, imageMobile: G.red, imageTablet: G.red, alt: 'Materiales de construcción', placement: 'Home · Secundario', channel: 'both', device: 'all', segmentIds: [], branch: 'Todas', priority: 3, startAt: '2026-08-25', endAt: '2026-09-18', utm: 'utm_campaign=18', analyticsEvent: 'banner_18', status: 'scheduled', version: 1, clicks: 0, impressions: 0, updatedAt: '2026-06-30', updatedBy: 'Javier Rojas' },
  { id: 'bn-1005', internalName: 'Herramientas bauker cat', title: 'Nueva línea Bauker', subtitle: 'Potencia profesional', cta: 'Ver herramientas', link: '/categoria/herramientas', imageDesktop: G.navy, imageMobile: G.navy, imageTablet: G.navy, alt: 'Herramientas Bauker', placement: 'Categoría · Cabecera', channel: 'both', device: 'desktop', segmentIds: [], branch: 'Todas', priority: 2, startAt: '2026-06-10', endAt: '2026-07-15', utm: '', analyticsEvent: 'banner_bauker', status: 'published', version: 3, clicks: 534, impressions: 15210, updatedAt: '2026-06-22', updatedBy: 'Diseño' },
  { id: 'bn-1006', internalName: 'Credito 60 dias checkout', title: 'Paga a 60 días', subtitle: 'Crédito Mimbral empresas', cta: 'Solicitar', link: '/empresas/credito', imageDesktop: G.navy, imageMobile: G.navy, imageTablet: G.navy, alt: 'Crédito empresas', placement: 'Checkout · Lateral', channel: 'b2b', device: 'all', segmentIds: ['sg-4'], branch: 'Todas', priority: 4, startAt: '2026-05-01', endAt: '2026-07-01', utm: '', analyticsEvent: 'banner_credito', status: 'inactive', version: 2, clicks: 128, impressions: 4300, updatedAt: '2026-06-18', updatedBy: 'Comercial Web' },
  { id: 'bn-1007', internalName: 'Popup bienvenida', title: 'Suscríbete y obtén 10%', subtitle: 'En tu primera compra', cta: 'Suscribirme', link: '/ofertas', imageDesktop: G.amber, imageMobile: G.amber, imageTablet: G.amber, alt: 'Pop-up bienvenida', placement: 'Pop-up', channel: 'b2c', device: 'all', segmentIds: ['sg-1'], branch: 'Todas', priority: 5, startAt: '', endAt: '', utm: '', analyticsEvent: 'popup_welcome', status: 'draft', version: 1, clicks: 0, impressions: 0, updatedAt: '2026-06-29', updatedBy: 'Marketing' },
  { id: 'bn-1008', internalName: 'Jardin primavera sec', title: 'Temporada primavera', subtitle: 'Todo para tu jardín', cta: 'Ver jardín', link: '/categoria/jardin', imageDesktop: G.green, imageMobile: G.green, imageTablet: G.green, alt: 'Jardín y terraza', placement: 'Home · Secundario', channel: 'b2c', device: 'all', segmentIds: [], branch: 'Todas', priority: 3, startAt: '2026-09-01', endAt: '2026-11-30', utm: '', analyticsEvent: 'banner_jardin', status: 'scheduled', version: 1, clicks: 0, impressions: 0, updatedAt: '2026-06-30', updatedBy: 'Marketing' },
]

/* -------------------------------- Media ------------------------------- */

export const media: CmsMediaAsset[] = [
  { id: 'md-1', name: 'hero-invierno.jpg', url: '/media/hero-invierno.jpg', format: 'JPG', weightKb: 412, dimensions: '1600×600', alt: 'Estufas en oferta', tags: ['hero', 'invierno'], folder: 'Campañas', usedIn: ['Banner Invierno'], uploadedAt: '2026-06-28', uploadedBy: 'Diseño', status: 'active', gradient: G.blue },
  { id: 'md-2', name: 'pinturas-latex.jpg', url: '/media/pinturas-latex.jpg', format: 'JPG', weightKb: 388, dimensions: '1600×600', alt: 'Pinturas látex', tags: ['pinturas'], folder: 'Campañas', usedIn: ['Banner Pinturas'], uploadedAt: '2026-06-27', uploadedBy: 'Diseño', status: 'active', gradient: G.green },
  { id: 'md-3', name: 'empresas-obra.png', url: '/media/empresas-obra.png', format: 'PNG', weightKb: 654, dimensions: '1600×600', alt: 'Portal empresas', tags: ['b2b'], folder: 'B2B', usedIn: ['Banner Empresas'], uploadedAt: '2026-06-25', uploadedBy: 'Comercial Web', status: 'active', gradient: G.green },
  { id: 'md-4', name: 'herramientas-bauker.jpg', url: '/media/herramientas-bauker.jpg', format: 'JPG', weightKb: 298, dimensions: '1200×280', alt: 'Herramientas Bauker', tags: ['herramientas', 'marca'], folder: 'Marcas', usedIn: ['Banner Bauker'], uploadedAt: '2026-06-22', uploadedBy: 'Diseño', status: 'active', gradient: G.navy },
  { id: 'md-5', name: 'fiestas-patrias.jpg', url: '/media/fiestas-patrias.jpg', format: 'JPG', weightKb: 501, dimensions: '800×300', alt: 'Fiestas patrias', tags: ['campaña'], folder: 'Campañas', usedIn: ['Banner 18'], uploadedAt: '2026-06-30', uploadedBy: 'Diseño', status: 'active', gradient: G.red },
  { id: 'md-6', name: 'credito-60dias.png', url: '/media/credito-60dias.png', format: 'PNG', weightKb: 221, dimensions: '400×500', alt: 'Crédito 60 días', tags: ['b2b', 'checkout'], folder: 'B2B', usedIn: ['Banner Crédito'], uploadedAt: '2026-06-18', uploadedBy: 'Comercial Web', status: 'active', gradient: G.navy },
  { id: 'md-7', name: 'og-mimbral.jpg', url: '/media/og-mimbral.jpg', format: 'JPG', weightKb: 154, dimensions: '1200×630', alt: 'Open Graph Mimbral', tags: ['seo', 'og'], folder: 'SEO', usedIn: ['SEO Home'], uploadedAt: '2026-06-20', uploadedBy: 'SEO', status: 'active', gradient: G.blue },
  { id: 'md-8', name: 'jardin-primavera.jpg', url: '/media/jardin-primavera.jpg', format: 'JPG', weightKb: 433, dimensions: '800×300', alt: 'Jardín primavera', tags: ['jardín'], folder: 'Campañas', usedIn: [], uploadedAt: '2026-06-30', uploadedBy: 'Diseño', status: 'orphan', gradient: G.green },
  { id: 'md-9', name: 'banner-antiguo-cyber.jpg', url: '/media/banner-antiguo-cyber.jpg', format: 'JPG', weightKb: 720, dimensions: '1600×600', alt: '', tags: ['cyber'], folder: 'Archivo', usedIn: [], uploadedAt: '2026-05-02', uploadedBy: 'Diseño', status: 'expired', gradient: G.amber },
  { id: 'md-10', name: 'iconos-servicios.svg', url: '/media/iconos-servicios.svg', format: 'SVG', weightKb: 24, dimensions: 'vector', alt: 'Íconos servicios', tags: ['iconos'], folder: 'Sistema', usedIn: ['Bloque servicios'], uploadedAt: '2026-04-14', uploadedBy: 'Diseño', status: 'active', gradient: G.teal },
]

/* ------------------------------ Landings ------------------------------ */

export const landings: CmsLandingPage[] = [
  { id: 'lp-1', internalName: 'Cyber Mimbral', slug: '/cyber', canonicalUrl: 'https://mimbral.cl/cyber', channel: 'b2c', type: 'campaign', indexable: false, metaTitle: 'Cyber Mimbral · Ofertas', metaDescription: 'Las mejores ofertas del Cyber.', h1: 'Cyber Mimbral', ogTitle: 'Cyber Mimbral', ogImage: '/media/cyber.jpg', schema: 'WebPage', publishAt: '2026-10-01', endAt: '2026-10-04', segmentIds: ['sg-1'], activeVersion: 6, sections: 8, status: 'scheduled', views: 0, conversion: 0, updatedAt: '2026-06-29', updatedBy: 'Marketing' },
  { id: 'lp-2', internalName: 'Convenios Empresas 2026', slug: '/empresas/convenios', canonicalUrl: 'https://mimbral.cl/empresas/convenios', channel: 'b2b', type: 'b2b', indexable: true, metaTitle: 'Convenios Empresas 2026', metaDescription: 'Beneficios para empresas con convenio.', h1: 'Convenios para empresas', ogTitle: 'Convenios Empresas', ogImage: '', schema: 'WebPage', publishAt: '', endAt: '', segmentIds: ['sg-3'], activeVersion: 2, sections: 5, status: 'in_review', views: 0, conversion: 0, updatedAt: '2026-06-30', updatedBy: 'Comercial Web' },
  { id: 'lp-3', internalName: 'Guía pintura', slug: '/guias/como-pintar', canonicalUrl: 'https://mimbral.cl/guias/como-pintar', channel: 'b2c', type: 'evergreen_seo', indexable: true, metaTitle: 'Cómo pintar tu casa · Guía', metaDescription: 'Guía paso a paso para pintar.', h1: 'Cómo pintar tu casa', ogTitle: 'Guía de pintura', ogImage: '/media/guia-pintura.jpg', schema: 'Article', publishAt: '2026-03-01', endAt: '', segmentIds: [], activeVersion: 3, sections: 6, status: 'published', views: 12840, conversion: 2.1, updatedAt: '2026-06-12', updatedBy: 'SEO' },
  { id: 'lp-4', internalName: 'Proyecto baño', slug: '/proyectos/renovar-bano', canonicalUrl: 'https://mimbral.cl/proyectos/renovar-bano', channel: 'b2c', type: 'project', indexable: true, metaTitle: 'Renueva tu baño', metaDescription: 'Todo para renovar tu baño.', h1: 'Renueva tu baño', ogTitle: 'Proyecto baño', ogImage: '/media/proyecto-bano.jpg', schema: 'WebPage', publishAt: '2026-05-10', endAt: '', segmentIds: [], activeVersion: 4, sections: 7, status: 'published', views: 5210, conversion: 1.6, updatedAt: '2026-06-18', updatedBy: 'Marketing' },
  { id: 'lp-5', internalName: 'Fiestas Patrias', slug: '/campanas/fiestas-patrias', canonicalUrl: 'https://mimbral.cl/campanas/fiestas-patrias', channel: 'both', type: 'campaign', indexable: true, metaTitle: 'Fiestas Patrias', metaDescription: '', h1: '', ogTitle: '', ogImage: '', schema: '', publishAt: '2026-08-25', endAt: '2026-09-19', segmentIds: [], activeVersion: 1, sections: 0, status: 'error', views: 0, conversion: 0, updatedAt: '2026-06-30', updatedBy: 'Marketing' },
  { id: 'lp-6', internalName: 'Categoría Cemento', slug: '/l/cemento', canonicalUrl: 'https://mimbral.cl/l/cemento', channel: 'both', type: 'category', indexable: true, metaTitle: 'Cemento y hormigón', metaDescription: 'Cemento al mejor precio.', h1: 'Cemento y hormigón', ogTitle: 'Cemento', ogImage: '/media/cemento.jpg', schema: 'CollectionPage', publishAt: '2026-02-01', endAt: '', segmentIds: [], activeVersion: 5, sections: 5, status: 'published', views: 8930, conversion: 3.4, updatedAt: '2026-06-05', updatedBy: 'SEO' },
]

/* ------------------------------ Secciones ----------------------------- */

export const sections: CmsSection[] = [
  { id: 'sc-1', internalName: 'Hero home B2C', title: 'Tu hogar más cálido', subtitle: 'Ofertas de invierno', type: 'hero_banner', group: 'banners', order: 1, status: 'published', channel: 'b2c', device: 'all', segmentIds: [], updatedAt: '2026-06-28', updatedBy: 'Marketing' },
  { id: 'sc-2', internalName: 'Hero home B2B', title: 'Precios mayoristas', subtitle: 'Cotiza en línea', type: 'hero_banner', group: 'banners', order: 1, status: 'published', channel: 'b2b', device: 'desktop', segmentIds: ['sg-3'], updatedAt: '2026-06-27', updatedBy: 'Comercial Web' },
  { id: 'sc-3', internalName: 'Beneficios despacho/retiro', title: 'Despacho y retiro', subtitle: '', type: 'benefits', group: 'content', order: 2, status: 'published', channel: 'both', device: 'all', segmentIds: [], updatedAt: '2026-06-14', updatedBy: 'Diseño' },
  { id: 'sc-4', internalName: 'Carrusel más vendidos', title: 'Los más vendidos', subtitle: '', type: 'carousel_dynamic', group: 'products', order: 3, status: 'published', channel: 'b2c', device: 'all', segmentIds: [], updatedAt: '2026-06-19', updatedBy: 'Marketing' },
  { id: 'sc-5', internalName: 'Carrusel recompra B2B', title: 'Vuelve a comprar', subtitle: '', type: 'products_b2b', group: 'products', order: 4, status: 'changes_requested', channel: 'b2b', device: 'all', segmentIds: ['sg-3'], updatedAt: '2026-06-30', updatedBy: 'Comercial Web' },
  { id: 'sc-6', internalName: 'Compra por proyecto', title: 'Compra por proyecto', subtitle: '', type: 'buy_by_project', group: 'content', order: 5, status: 'published', channel: 'b2c', device: 'all', segmentIds: [], updatedAt: '2026-06-10', updatedBy: 'Marketing' },
  { id: 'sc-7', internalName: 'Marcas destacadas', title: 'Marcas que trabajamos', subtitle: '', type: 'featured_brands', group: 'navigation', order: 6, status: 'published', channel: 'both', device: 'all', segmentIds: [], updatedAt: '2026-06-08', updatedBy: 'Diseño' },
  { id: 'sc-8', internalName: 'Bloque servicios', title: 'Servicios Mimbral', subtitle: '', type: 'services_block', group: 'content', order: 7, status: 'draft', channel: 'both', device: 'all', segmentIds: [], updatedAt: '2026-06-30', updatedBy: 'Marketing' },
]

/* ------------------------------ Productos ----------------------------- */

export const products: CmsProductReference[] = [
  { sku: 'MIM-CON-4001', name: 'Cemento Especial 25kg', brand: 'Andescem', category: 'Construcción', imageOk: true, webPublished: true, priceAvailable: true, stockAvailable: true, promotionActive: true, status: 'ok', gradient: G.navy },
  { sku: 'MIM-CON-4002', name: 'Fierro Estriado 8mm x 6m', brand: 'AceroChile', category: 'Construcción', imageOk: true, webPublished: true, priceAvailable: true, stockAvailable: true, promotionActive: false, status: 'ok', gradient: G.blue },
  { sku: 'MIM-HER-2001', name: 'Taladro Percutor 750W', brand: 'Bauker', category: 'Herramientas', imageOk: true, webPublished: true, priceAvailable: true, stockAvailable: false, promotionActive: false, status: 'warning', gradient: G.navy },
  { sku: 'MIM-PIN-1601', name: 'Látex Premium Blanco 1GL', brand: 'Colormax', category: 'Pinturas', imageOk: true, webPublished: true, priceAvailable: true, stockAvailable: true, promotionActive: true, status: 'ok', gradient: G.green },
  { sku: 'MIM-ELE-3401', name: 'Estufa a Gas 3400', brand: 'Calent', category: 'Electrohogar', imageOk: false, webPublished: true, priceAvailable: true, stockAvailable: true, promotionActive: true, status: 'warning', gradient: G.amber },
  { sku: 'MIM-JAR-5001', name: 'Manguera Riego 20m', brand: 'AgroVida', category: 'Jardín', imageOk: true, webPublished: false, priceAvailable: false, stockAvailable: true, promotionActive: false, status: 'error', gradient: G.green },
  { sku: 'MIM-GAS-7001', name: 'Cañería PVC 110mm', brand: 'Hidroflex', category: 'Gasfitería', imageOk: true, webPublished: true, priceAvailable: true, stockAvailable: true, promotionActive: false, status: 'ok', gradient: G.teal },
  { sku: 'MIM-MAD-4101', name: 'Plancha OSB 11mm', brand: 'Maderba', category: 'Construcción', imageOk: true, webPublished: true, priceAvailable: true, stockAvailable: true, promotionActive: false, status: 'ok', gradient: G.navy },
]

/* ------------------------------ Carruseles ---------------------------- */

export const carousels: CmsCarousel[] = [
  { id: 'cr-1', title: 'Los más vendidos', rule: 'bestsellers', channel: 'b2c', maxItems: 12, hideNoStock: true, hideNoPrice: true, onlyPublished: true, excludeBrands: [], excludeCategories: [], excludeSkus: [], status: 'published', updatedAt: '2026-06-19' },
  { id: 'cr-2', title: 'Recompra frecuente', rule: 'frequent_reorder', channel: 'b2b', maxItems: 10, hideNoStock: true, hideNoPrice: true, onlyPublished: true, excludeBrands: [], excludeCategories: [], excludeSkus: [], status: 'changes_requested', updatedAt: '2026-06-30' },
  { id: 'cr-3', title: 'Nuevos en herramientas', rule: 'by_category', channel: 'both', maxItems: 8, hideNoStock: true, hideNoPrice: false, onlyPublished: true, excludeBrands: [], excludeCategories: [], excludeSkus: [], status: 'published', updatedAt: '2026-06-11' },
  { id: 'cr-4', title: 'Ofertas de temporada', rule: 'by_discount', channel: 'b2c', maxItems: 12, hideNoStock: false, hideNoPrice: true, onlyPublished: true, excludeBrands: ['Sin marca'], excludeCategories: [], excludeSkus: [], status: 'scheduled', updatedAt: '2026-06-24' },
  { id: 'cr-5', title: 'Recomendados para tu obra', rule: 'b2b_recommended', channel: 'b2b', maxItems: 10, hideNoStock: true, hideNoPrice: true, onlyPublished: true, excludeBrands: [], excludeCategories: [], excludeSkus: [], status: 'draft', updatedAt: '2026-06-29' },
]

/* ------------------------------ Campañas ------------------------------ */

export const campaigns: CmsCampaign[] = [
  { id: 'cp-1', name: 'Invierno 2026', channel: 'both', startAt: '2026-06-15', endAt: '2026-07-31', owner: 'Marketing', approver: 'Carolina Pérez', status: 'published', pieces: { banners: 3, landings: 1, carousels: 2, sections: 4, faqs: 2, seo: 1 }, conflicts: 1, promotionId: 'PRM-8841', updatedAt: '2026-06-28' },
  { id: 'cp-2', name: 'Fiestas Patrias', channel: 'both', startAt: '2026-08-25', endAt: '2026-09-19', owner: 'Marketing', approver: 'Carolina Pérez', status: 'scheduled', pieces: { banners: 2, landings: 1, carousels: 1, sections: 3, faqs: 0, seo: 1 }, conflicts: 0, updatedAt: '2026-06-30' },
  { id: 'cp-3', name: 'Primavera Jardín', channel: 'b2c', startAt: '2026-09-01', endAt: '2026-11-30', owner: 'Marketing', approver: 'Carolina Pérez', status: 'in_review', pieces: { banners: 1, landings: 1, carousels: 1, sections: 2, faqs: 1, seo: 1 }, conflicts: 0, updatedAt: '2026-06-29' },
  { id: 'cp-4', name: 'Convenios Empresas', channel: 'b2b', startAt: '2026-07-01', endAt: '2026-12-31', owner: 'Comercial Web', approver: 'Carolina Pérez', status: 'in_review', pieces: { banners: 1, landings: 1, carousels: 1, sections: 2, faqs: 1, seo: 1 }, conflicts: 0, updatedAt: '2026-06-30' },
  { id: 'cp-5', name: 'Cyber Mimbral', channel: 'b2c', startAt: '2026-10-01', endAt: '2026-10-04', owner: 'Marketing', approver: 'Carolina Pérez', status: 'draft', pieces: { banners: 4, landings: 1, carousels: 3, sections: 6, faqs: 2, seo: 2 }, conflicts: 2, updatedAt: '2026-06-27' },
]

/* ------------------------------ Segmentos ----------------------------- */

export const segments: CmsSegment[] = [
  { id: 'sg-1', name: 'Público general', type: 'public', description: 'Visitantes sin sesión', channel: 'b2c', members: 0, updatedAt: '2026-01-10' },
  { id: 'sg-2', name: 'Cliente B2C logueado', type: 'logged_in', description: 'Personas con cuenta', channel: 'b2c', members: 84200, updatedAt: '2026-05-02' },
  { id: 'sg-3', name: 'Empresa con crédito', type: 'b2b_credit', description: 'Cuentas B2B con línea aprobada', channel: 'b2b', members: 1240, updatedAt: '2026-06-01' },
  { id: 'sg-4', name: 'Empresa sin crédito', type: 'b2b_no_credit', description: 'Cuentas B2B sin línea', channel: 'b2b', members: 860, updatedAt: '2026-06-01' },
  { id: 'sg-5', name: 'Constructoras', type: 'industry', description: 'Rubro construcción', channel: 'b2b', members: 410, updatedAt: '2026-04-18' },
  { id: 'sg-6', name: 'Sucursal San Javier', type: 'branch', description: 'Clientes con sucursal preferida San Javier', channel: 'both', members: 3200, updatedAt: '2026-03-22' },
  { id: 'sg-7', name: 'Rubro agrícola', type: 'industry', description: 'Clientes agrícolas', channel: 'b2b', members: 220, updatedAt: '2026-05-30' },
]

/* -------------------------- Reglas visibilidad ------------------------ */

export const visibilityRules: CmsVisibilityRule[] = [
  { id: 'vr-1', name: 'Solo empresas logueadas', match: 'all', conditions: [{ id: 'c1', field: 'channel', operator: 'is', value: 'b2b' }, { id: 'c2', field: 'customer_type', operator: 'is', value: 'logged_in' }], fallback: 'hide', usedIn: 6, updatedAt: '2026-06-10' },
  { id: 'vr-2', name: 'Campaña invierno vigente', match: 'all', conditions: [{ id: 'c1', field: 'date', operator: 'between', value: '2026-06-15..2026-07-31' }, { id: 'c2', field: 'active_campaign', operator: 'is', value: 'Invierno 2026' }], fallback: 'show_fallback', usedIn: 3, updatedAt: '2026-06-14' },
  { id: 'vr-3', name: 'Retiro San Javier', match: 'all', conditions: [{ id: 'c1', field: 'branch', operator: 'is', value: 'Balmaceda San Javier' }], fallback: 'show_fallback', usedIn: 2, updatedAt: '2026-05-20' },
  { id: 'vr-4', name: 'Solo mobile', match: 'any', conditions: [{ id: 'c1', field: 'device', operator: 'is', value: 'mobile' }], fallback: 'hide', usedIn: 4, updatedAt: '2026-06-02' },
]

/* ------------------------------ Versiones ----------------------------- */

export const versions: CmsVersion[] = [
  { id: 'v-1', entityType: 'Home', entityId: 'home-b2c', entityName: 'Home B2C', version: 24, isActive: true, author: 'Marketing', createdAt: '2026-06-28 15:20', note: 'Actualiza hero invierno', changes: 5 },
  { id: 'v-2', entityType: 'Home', entityId: 'home-b2c', entityName: 'Home B2C', version: 23, isActive: false, author: 'Marketing', createdAt: '2026-06-25 10:02', note: 'Reordena secciones', changes: 3 },
  { id: 'v-3', entityType: 'Banner', entityId: 'bn-1001', entityName: 'Invierno hero', version: 4, isActive: true, author: 'María González', createdAt: '2026-06-28 09:12', note: 'Nuevo copy', changes: 2 },
  { id: 'v-4', entityType: 'Landing', entityId: 'lp-3', entityName: 'Guía pintura', version: 3, isActive: true, author: 'SEO', createdAt: '2026-06-12 11:40', note: 'Optimiza meta', changes: 4 },
  { id: 'v-5', entityType: 'Footer', entityId: 'ft-b2c', entityName: 'Footer B2C', version: 12, isActive: true, author: 'María González', createdAt: '2026-06-30 08:00', note: 'Restaurada desde v11', changes: 1 },
  { id: 'v-6', entityType: 'Landing', entityId: 'lp-2', entityName: 'Convenios Empresas', version: 2, isActive: false, author: 'Comercial Web', createdAt: '2026-06-30 17:30', note: 'Draft en revisión', changes: 6 },
]

/* ------------------------------ Auditoría ----------------------------- */

export const auditLogs: CmsAuditLog[] = [
  { id: 'au-1', user: 'María González', action: 'Publicó banner', entityType: 'Banner', entityName: 'Pinturas 20% látex', before: 'Aprobado', after: 'Publicado', statusBefore: 'approved', statusAfter: 'published', device: 'Chrome · macOS', at: '2026-06-30 14:35' },
  { id: 'au-2', user: 'Diego Soto', action: 'Editó meta title', entityType: 'SEO', entityName: 'SEO Home', before: 'Mimbral', after: 'Mimbral · Construcción y Hogar', device: 'Chrome · Windows', at: '2026-06-30 12:10' },
  { id: 'au-3', user: 'Carolina Pérez', action: 'Aprobó', entityType: 'Home', entityName: 'Home Variante B2B', before: 'En revisión', after: 'Aprobado', statusBefore: 'in_review', statusAfter: 'approved', device: 'Safari · iPad', at: '2026-06-30 11:02' },
  { id: 'au-4', user: 'Javier Rojas', action: 'Programó campaña', entityType: 'Campaña', entityName: 'Fiestas Patrias', before: '—', after: '2026-08-25', device: 'Chrome · Windows', at: '2026-06-30 10:20' },
  { id: 'au-5', user: 'María González', action: 'Restauró versión', entityType: 'Footer', entityName: 'Footer B2C v11 → v12', before: 'v11', after: 'v12', device: 'Chrome · macOS', at: '2026-06-30 08:00' },
]

/* -------------------------------- FAQ --------------------------------- */

export const faqs: CmsFaq[] = [
  { id: 'fq-1', question: '¿Cuánto demora el despacho?', answer: 'Entre 24 y 72 horas hábiles según comuna.', scope: 'shipping', target: 'Global', channel: 'both', order: 1, schemaEnabled: true, status: 'published', updatedAt: '2026-06-10' },
  { id: 'fq-2', question: '¿Puedo pagar a 30 días?', answer: 'Sí, con cuenta empresa y línea de crédito aprobada.', scope: 'b2b', target: 'Empresas', channel: 'b2b', order: 1, schemaEnabled: true, status: 'published', updatedAt: '2026-06-12' },
  { id: 'fq-3', question: '¿Cómo cambio un producto?', answer: 'Tienes 30 días para cambios y devoluciones.', scope: 'returns', target: 'Global', channel: 'both', order: 2, schemaEnabled: true, status: 'published', updatedAt: '2026-06-05' },
  { id: 'fq-4', question: '¿Hacen despacho a obra?', answer: 'Sí, coordinamos despacho a faena en todo Chile.', scope: 'b2b', target: 'Empresas', channel: 'b2b', order: 2, schemaEnabled: false, status: 'draft', updatedAt: '2026-06-29' },
  { id: 'fq-5', question: '¿Qué medios de pago aceptan?', answer: 'Webpay, tarjetas, transferencia y crédito B2B.', scope: 'checkout', target: 'Checkout', channel: 'both', order: 1, schemaEnabled: true, status: 'published', updatedAt: '2026-06-08' },
]

/* --------------------------------- SEO -------------------------------- */

export const seoContents: CmsSeoContent[] = [
  { id: 'se-1', scope: 'home', target: 'Home', slug: '/', metaTitle: 'Mimbral · Construcción y Hogar', metaDescription: 'Todo para construir y mejorar tu hogar.', h1: 'Construcción y hogar', topText: '', bottomText: '', canonical: 'https://mimbral.cl/', indexable: true, ogTitle: 'Mimbral', ogImage: '/media/og-mimbral.jpg', faqEnabled: true, issues: [], status: 'published', updatedAt: '2026-06-30' },
  { id: 'se-2', scope: 'category', target: 'Construcción', slug: '/categoria/construccion', metaTitle: 'Materiales de Construcción', metaDescription: '', h1: 'Materiales de Construcción', topText: 'Cemento, fierro y áridos…', bottomText: '', canonical: 'https://mimbral.cl/categoria/construccion', indexable: true, ogTitle: '', ogImage: '', faqEnabled: false, issues: [{ code: 'meta_desc_empty', label: 'Meta description vacía', severity: 'error' }], status: 'published', updatedAt: '2026-06-20' },
  { id: 'se-3', scope: 'landing', target: 'Fiestas Patrias', slug: '/campanas/fiestas-patrias', metaTitle: '', metaDescription: '', h1: '', topText: '', bottomText: '', canonical: '', indexable: true, ogTitle: '', ogImage: '', faqEnabled: false, issues: [{ code: 'h1_empty', label: 'H1 vacío', severity: 'error' }, { code: 'meta_title_empty', label: 'Meta title vacío', severity: 'error' }, { code: 'landing_no_faq', label: 'Landing sin FAQ', severity: 'warning' }], status: 'error', updatedAt: '2026-06-30' },
  { id: 'se-4', scope: 'category', target: 'Herramientas', slug: '/categoria/herramientas', metaTitle: 'Herramientas y Maquinarias · Mimbral · Las mejores marcas al mejor precio para tu taller', metaDescription: 'Herramientas eléctricas, a batería y manuales.', h1: 'Herramientas', topText: '', bottomText: '', canonical: 'https://mimbral.cl/categoria/herramientas', indexable: true, ogTitle: '', ogImage: '', faqEnabled: false, issues: [{ code: 'meta_title_long', label: 'Meta title muy largo', severity: 'warning' }], status: 'published', updatedAt: '2026-06-15' },
  { id: 'se-5', scope: 'info_page', target: 'Quiénes somos', slug: '/nosotros', metaTitle: 'Sobre Mimbral', metaDescription: 'Conoce nuestra historia.', h1: 'Quiénes somos', topText: '', bottomText: '', canonical: 'https://mimbral.cl/nosotros', indexable: true, ogTitle: 'Sobre Mimbral', ogImage: '', faqEnabled: false, issues: [], status: 'published', updatedAt: '2026-05-30' },
]

/* ---------------------------- Experimentos ---------------------------- */

export const experiments: CmsExperiment[] = [
  { id: 'ex-1', name: 'Hero invierno · copy A/B', entityType: 'Banner', entityName: 'Invierno hero', trafficA: 50, trafficB: 50, metric: 'cta_click', startAt: '2026-06-18', endAt: '2026-07-02', status: 'running', winner: null, liftA: 3.1, liftB: 3.8 },
  { id: 'ex-2', name: 'CTA empresas', entityType: 'Landing', entityName: 'Convenios Empresas', trafficA: 60, trafficB: 40, metric: 'form_submit', startAt: '2026-06-01', endAt: '2026-06-20', status: 'finished', winner: 'B', liftA: 1.2, liftB: 2.4 },
  { id: 'ex-3', name: 'Orden de secciones home', entityType: 'Home', entityName: 'Home B2C', trafficA: 50, trafficB: 50, metric: 'add_to_cart', startAt: '2026-06-25', endAt: '2026-07-10', status: 'running', winner: null, liftA: 5.4, liftB: 5.1 },
  { id: 'ex-4', name: 'Pop-up bienvenida', entityType: 'Banner', entityName: 'Pop-up 10%', trafficA: 50, trafficB: 50, metric: 'conversion', startAt: '', endAt: '', status: 'draft', winner: null, liftA: 0, liftB: 0 },
]

/* ------------------------------ Permisos ------------------------------ */

export const permissions: CmsPermission[] = [
  { key: 'cms.dashboard.view', label: 'Ver dashboard', group: 'Dashboard', roles: ['admin', 'marketing', 'comercial_web', 'seo', 'design', 'approver', 'read_only'] },
  { key: 'cms.home.edit', label: 'Editar home', group: 'Home', roles: ['admin', 'marketing', 'comercial_web'] },
  { key: 'cms.home.publish', label: 'Publicar home', group: 'Home', roles: ['admin', 'approver'] },
  { key: 'cms.banner.create', label: 'Crear banner', group: 'Banners', roles: ['admin', 'marketing', 'design'] },
  { key: 'cms.banner.publish', label: 'Publicar banner', group: 'Banners', roles: ['admin', 'approver'] },
  { key: 'cms.landing.create', label: 'Crear landing', group: 'Landings', roles: ['admin', 'marketing', 'comercial_web'] },
  { key: 'cms.landing.publish', label: 'Publicar landing', group: 'Landings', roles: ['admin', 'approver'] },
  { key: 'cms.media.upload', label: 'Subir media', group: 'Media', roles: ['admin', 'marketing', 'design'] },
  { key: 'cms.media.delete', label: 'Eliminar media', group: 'Media', roles: ['admin'] },
  { key: 'cms.seo.edit', label: 'Editar SEO', group: 'SEO', roles: ['admin', 'seo'] },
  { key: 'cms.campaign.approve', label: 'Aprobar campaña', group: 'Campañas', roles: ['admin', 'approver'] },
  { key: 'cms.version.restore', label: 'Restaurar versión', group: 'Versiones', roles: ['admin', 'approver'] },
  { key: 'cms.abtest.manage', label: 'Gestionar A/B', group: 'Experimentos', roles: ['admin', 'marketing'] },
  { key: 'cms.settings.manage', label: 'Configurar CMS', group: 'Sistema', roles: ['admin'] },
]

/* -------------------------------- Menús ------------------------------- */

export const menus: CmsMenu[] = [
  { id: 'mn-1', name: 'Menú principal (categorías)', location: 'header', channel: 'both', items: [], itemCount: 16, brokenLinks: 0, updatedAt: '2026-06-10', status: 'published' },
  { id: 'mn-2', name: 'Mega menú Construcción', location: 'mega', channel: 'both', items: [], itemCount: 24, brokenLinks: 1, updatedAt: '2026-06-18', status: 'published' },
  { id: 'mn-3', name: 'Menú B2B', location: 'header', channel: 'b2b', items: [], itemCount: 8, brokenLinks: 0, updatedAt: '2026-06-05', status: 'published' },
  { id: 'mn-4', name: 'Footer · Servicio al cliente', location: 'footer', channel: 'both', items: [], itemCount: 6, brokenLinks: 2, updatedAt: '2026-06-22', status: 'published' },
]
