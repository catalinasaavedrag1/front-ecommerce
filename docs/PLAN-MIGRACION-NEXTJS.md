# Plan de migración del storefront a Next.js (SSR) — para cerrar el renderizado SEO

Plan por fases para migrar el front público de **Vite + React SPA** a
**Next.js (App Router)**, de modo que la metadata, canonicals y JSON-LD que el
BFF **ya entrega** en cada página se materialicen en el HTML que recibe Google.

> **Por qué existe este plan**: la cadena SEO tiene tres eslabones —
> `seo-service` (cerebro) → `web-bff-service` (orquestador) → front
> (renderizador). Los dos primeros están **listos y verificados**: home,
> categoría y ficha ya viajan con su bloque `seo` (`BffSeo`). El eslabón que
> falta es el renderizador: el SPA arma la página en el navegador y el HTML
> inicial lleva metadata estática. Ver `CONTRATOS-BFF.md` §11.

---

## 0. El estado actual, honesto

| Hecho | Impacto SEO |
|---|---|
| El front usa **HashRouter** (URLs `/#/producto/...`) | 🔴 **Crítico**: para Google todo el sitio es UNA sola URL (`mimbral.cl/`). Las páginas internas no existen como URLs indexables. Es el problema #1, incluso antes que el SSR. |
| El HTML inicial (`index.html`) tiene metadata fija | 🔴 Título/description iguales para todas las "páginas". |
| El bloque `seo` del BFF llega al front pero no se inyecta en el `<head>` | 🟠 El dato está; falta el renderizador. |
| Hosting actual: build estático (GitHub Pages, base `/front-ecommerce/`) | 🟠 SSR requiere un runtime Node (o Vercel / contenedor propio). |
| `robots.txt` y `sitemap.xml` ya los sirve el BFF en la raíz del dominio | ✅ Listo, no depende de la migración. |

**Alternativa considerada y descartada**: pre-render/SSG sobre Vite
(`vite-plugin-ssr`/`prerender`). Sirve para páginas estáticas, pero no resuelve
bien fichas de producto dinámicas (miles de URLs con precio/stock cambiantes),
y de todos modos exige abandonar HashRouter y el hosting estático. Si se va a
pagar ese costo, Next.js entrega además `generateMetadata`, ISR (revalidación
incremental), streaming y las convenciones de sitemap/robots — y es el estándar
del equipo (el cms-front ya es Next.js 14).

---

## 1. Qué sobrevive tal cual (la inversión está protegida)

La capa de integración se construyó agnóstica al framework — esto migra casi
sin tocar:

| Pieza | Estado en la migración |
|---|---|
| `src/api/*` (web-bff.client, apis por dominio, adapters, types, registry) | ✅ Portable. Único cambio: leer la base URL de `process.env` además de `import.meta.env` (2 líneas en `lib/env.ts`). |
| `src/lib/errors.ts` (catálogo code→userMessage) | ✅ Tal cual. |
| `src/lib/cookies.ts` | ✅ Se creó **para esto** ("para el día en que el proyecto migre a SSR"). Pasa a ser la pieza central de sesión. |
| Componentes de UI (Header, ProductCard, PriceTag, carruseles, footer…) | ✅ Portables; los interactivos llevan `'use client'`. |
| `src/index.css` (design system completo) | ✅ Se importa en el `layout.tsx` raíz. |
| Contextos (App/Cart/Wishlist) | ✅ Client components que envuelven `children` en el layout. |
| Hooks BFF (`useBffHome`, `useBffNavigation`, `useBffOrders`, `useBffCatalog`) | 🟡 Siguen sirviendo para las partes client-side; en páginas SSR se reemplazan por fetch directo en el server component (misma `api/`). |
| `src/lib/{session,auth,storage}.ts` (12 usos de `localStorage`) | 🟠 Necesitan guard SSR (`typeof window`) y, para SSR real, la sesión pasa de localStorage a **cookies** (ver F4). |
| `src/data/*` (mocks de degradación) | ✅ Tal cual — la degradación elegante se mantiene. |

**Lo que se reescribe**: el cascarón — `main.tsx`/`App.tsx` (28 rutas de
react-router) → estructura `app/` de Next, y `vite.config.ts` → `next.config`.

---

## 2. Mapeo de rutas (react-router → App Router)

| Hoy (`/#/…`) | Next (`app/…`) | Render |
|---|---|---|
| `/` (Home) | `app/page.tsx` | **SSR/ISR** (contenido CMS + productos vía BFF; revalidate ~300s como el cache del BFF) |
| `/categoria/:slug` | `app/categoria/[slug]/page.tsx` | **SSR** (PLP con facetas; `generateMetadata` desde `BffCategoryPage.seo`) |
| `/producto/:id` | `app/producto/[id]/page.tsx` | **SSR** (PDP; metadata + JSON-LD desde `BffProductDetail.seo`) |
| `/buscar` | `app/buscar/page.tsx` | SSR liviano (los resultados pueden hidratar client-side; **noindex** por defecto — regla de facetas) |
| `/categorias`, `/ofertas`, `/tiendas`, `/servicios`, `/ayuda`, `/nosotros`, `/legal/:doc`, etc. (~15 informativas) | `app/<ruta>/page.tsx` | SSG/ISR (metadata estática o de `GET /seo/meta`) |
| `/carro`, `/checkout` | `app/carro`, `app/checkout` | **Client** (`'use client'` — interactivas, sin valor SEO, **noindex**) |
| `/cuenta`, `/mis-pedidos`, `/favoritos`, `/listas`, `/ingresar` | client + **noindex** | Privadas/sesión. |
| `/empresas`, `/empresas/credito`, `/cotizacion` | SSR simple (B2B tiene valor SEO) | |

**Redirecciones**: los links históricos `/#/...` no llegan al servidor (el
fragment no viaja), así que se resuelven con un mini-script en la home: si
`location.hash` empieza con `#/`, `router.replace(hash.slice(1))`. Costo: 5
líneas. Los enlaces externos antiguos siguen funcionando.

---

## 3. Fases del proyecto

### F0 — Preparación (en el repo actual, sin romper nada) · ~1-2 días
- Guards SSR en `lib/storage|session|auth` (`typeof window === 'undefined'` → no-op/null).
- `lib/env.ts` lee `NEXT_PUBLIC_WEB_BFF_URL` **o** `VITE_BFF_URL` (compatible con ambos mundos durante la transición).
- Verificar que ningún componente importe `import.meta.env` directo (hoy ya está centralizado en `lib/env.ts` ✅).
- *Se puede mergear al repo actual sin efecto visible.*

### F1 — Cascarón Next.js · ~2-3 días
- Scaffold Next 14+ (App Router, TS). `app/layout.tsx`: importa `index.css`, monta `<AppProvider><WishlistProvider><CartProvider>` (client) y el `Header`/`Footer`.
- `next.config`: `rewrites` de `/api/web-bff/*` → BFF (reemplaza el proxy de Vite); imágenes remotas permitidas.
- Variables: `NEXT_PUBLIC_WEB_BFF_URL` (browser) y `WEB_BFF_INTERNAL_URL` (server, red interna — el server llama al BFF directo, sin pasar por el edge).
- Criterio de salida: la home renderiza client-side igual que hoy, bajo Next.

### F2 — Páginas SEO server-side (el corazón) · ~4-6 días
- **Home**: server component que llama `fetchHome()` en el servidor; `generateMetadata()` mapea `BffSeo` → `Metadata` de Next (title, description, robots, canonical, openGraph, twitter); `structuredData` → `<script type="application/ld+json">`. ISR `revalidate: 300`.
- **PDP** (`producto/[id]`): ídem con `fetchProductDetailRaw()`; JSON-LD `Product` del BFF. `dynamic` con cache corto (precio/stock cambian).
- **PLP** (`categoria/[slug]`): ídem con `fetchCategoryPage()`; facetas se hidratan client-side.
- Mapeo `BffSeo → Metadata` en un helper único (`lib/seo-next.ts`): un solo lugar donde vive la traducción.
- Criterio de salida: **"Ver código fuente" muestra title/description/canonical/JSON-LD reales por URL.**

### F3 — Resto de páginas + navegación · ~3-4 días
- Migración mecánica de las ~20 páginas restantes (client u SSG según tabla §2).
- Header/menú: el server layout puede pre-cargar `GET /navigation` y pasarla como initial data al hook (menos flicker).
- Script de redirección de URLs `/#/…`.

### F4 — Sesión por cookies · ~2-3 días
- `x-session-id`: pasa de localStorage a **cookie** (utilidades ya listas en `lib/cookies.ts`), para que el server también la envíe al BFF y el carrito/contexto sean consistentes SSR↔client.
- Token: cookie `httpOnly` (cuando se active el login) — el server lee la cookie y arma el header `authorization` hacia el BFF.
- La comuna (`x-commune`) también viaja en cookie para que el SSR de PDP muestre despacho correcto.

### F5 — Hosting y despliegue · ~1-2 días + coordinación infra
- GitHub Pages **no sirve** para SSR: se necesita runtime Node — opciones: contenedor propio junto a los microservicios (consistente con el stack actual) o Vercel.
- CORS deja de ser tema para las llamadas server-side (red interna); para el browser se mantiene `CORS_ORIGINS` con el dominio real.
- Actualizar `GUIA-OPERACION.md` (la receta de encendido cambia: `next dev` / `next start`).

### F6 — Verificación SEO (cierre) · ~1-2 días
- `curl` a cada tipo de página: metadata y JSON-LD presentes en el HTML crudo.
- Google Rich Results Test sobre PDP (schema `Product`).
- Lighthouse SEO ≥ 95 en home/PLP/PDP.
- Sitemap del BFF apuntando a las URLs reales (sin `#`) e indexación de facetas según las reglas del punto pendiente en seo-service.

**Total estimado: ~3 semanas de un dev** (±1 según fricción de hosting).
F0 puede entrar hoy mismo; F1–F2 son el 80% del valor SEO.

---

## 4. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Links históricos `/#/...` rotos | Script de redirección por hash (F3); el fragment nunca llegó a indexarse, así que no hay equity SEO que perder. |
| `localStorage` explota en SSR | Guards en F0 (antes de tocar Next). |
| Doble fuente de sesión (cookie vs localStorage) durante la transición | F4 hace el corte completo a cookies; hasta entonces las páginas SSR operan como anónimas (degradación ya soportada por el BFF). |
| Cambio de hosting (estático → Node) | Es la única decisión de infraestructura nueva; levantarla al equipo ANTES de F1. |
| Precio/stock desactualizados en HTML cacheado | ISR corto en PDP + revalidación client-side del precio (patrón ya existente con `GET /products/:sku/availability`). |
| La maqueta/degradación se pierde | No: `VITE_BFF_URL`→`NEXT_PUBLIC_WEB_BFF_URL` vacío sigue significando modo maqueta; los mocks y fallbacks se mantienen. |

## 5. Criterios de aceptación del proyecto

1. Cada URL pública existe **sin `#`** y responde HTML con su `title`,
   `description`, `canonical`, `robots` y JSON-LD propios (visibles en "ver
   código fuente").
2. Los datos SEO provienen del bloque `seo` del BFF (cadena
   seo-service → BFF → front intacta; cero lógica SEO duplicada en el front).
3. Carro/checkout/cuenta siguen client-side, `noindex`, sin regresión de UX.
4. La degradación a maqueta sigue funcionando sin BFF.
5. Rich Results Test pasa en PDP; Lighthouse SEO ≥ 95.
6. Redirección de URLs `/#/...` activa.
