# Integración con el web-bff-service

Guía completa de cómo este front consume el **web-bff-service** (el Backend For
Frontend del ecommerce, en `Microservicios/web-bff-service`). Escrita para que
la entienda cualquiera del equipo.

> 📐 **Contrato técnico** (mapeo endpoint-por-endpoint brief↔BFF, headers,
> contexto B2C/B2B, gaps del BFF y decisiones de arquitectura):
> **[`CONTRATOS-BFF.md`](CONTRATOS-BFF.md)**. Esta guía es el "cómo se usa"; ese
> documento es el "qué expone y por qué".

**Índice**: [Idea general](#idea-general) · [Cómo activarla](#cómo-activarla) ·
[Las piezas](#las-piezas-srcapi) · [Qué pantalla usa qué](#qué-pantalla-usa-qué) ·
[Carrito y checkout](#carrito-y-checkout) · [Entornos](#entornos) ·
[Verificación](#qué-se-verificó-en-vivo) · [Troubleshooting](#troubleshooting) ·
[Límites conocidos](#límites-conocidos)

---

## Idea general

El front funciona en **dos modos** y cambia entre ellos con una sola variable:

![Doble modo](img/08-integracion-front.png)

| Modo | Configuración | Qué pasa |
| --- | --- | --- |
| **Maqueta** (default) | `VITE_BFF_URL` vacío o sin `.env` | Todo funciona con los datos de ejemplo de `src/data/` — el comportamiento original |
| **Conectado** | `VITE_BFF_URL=/api/web-bff` | Home, categoría, búsqueda y ficha cargan datos reales del BFF; el carrito se espeja; el checkout hace el handoff real |

La regla de oro del diseño es la **degradación elegante**: si el BFF no está,
falla, o responde vacío, cada pantalla vuelve sola a los datos locales.
**La tienda nunca queda en blanco.**

![Degradación elegante](img/09-degradacion.png)

## Cómo activarla

```bash
cp .env.example .env
# dejar: VITE_BFF_URL=/api/web-bff
npm run dev        # el proxy de vite.config.ts manda /api/web-bff a localhost:3080
```

Requisito para ver datos reales: el web-bff-service corriendo (`Microservicios/
web-bff-service`: `npm install && npm run start:dev`) y, para datos de negocio,
sus microservicios downstream.

## Las piezas

La integración está en dos capas: **`src/lib/`** (fundaciones) y **`src/api/`**
(cliente + apis por dominio). Ningún componente hace `fetch` a mano.

### `src/lib/` — fundaciones

| Archivo | Qué hace |
| --- | --- |
| `env.ts` | Base URL del BFF (`VITE_BFF_URL`), `isBffEnabled()`, timeout, locale/moneda |
| `storage.ts` | Claves de `localStorage` en un solo lugar |
| `session.ts` | `sessionId()` anónimo persistente + `cartId` activo |
| `auth.ts` | Token del cliente (Bearer). El BFF deriva la identidad del **JWT** |
| `context.ts` | Contexto B2C/B2B **derivado del cliente** (canal, comuna) |
| `cookies.ts` | Utilidades de cookie (para un futuro SSR; hoy no se usan) |
| `errors.ts` | `BffError` tipado + catálogo `code → userMessage` + `toUserMessage()` |

### `src/api/` — cliente y dominios

| Archivo | Qué hace | Detalle importante |
| --- | --- | --- |
| `web-bff.client.ts` | **Cliente HTTP único** (`webBffRequest`) | Compone headers de contexto (`x-sales-channel`, `x-session-id`, token, `x-cart-id`, `x-commune`…), timeout, desenvuelve `{ success, data }` y lanza `BffError` |
| `types.ts` | Tipos del BFF | Espejo de las vistas (`BffProductCard`, `BffCart`, `BffCheckoutHandoff`…) |
| `adapters.ts` | Traducción | Convierte las vistas del BFF al tipo `Product` del front — por eso **ningún componente cambió** |
| `registry.ts` | Productos vivos | Memoria + sessionStorage; `getProduct()` de `src/data/products.ts` lo consulta **primero**, así carrito y "vistos recientemente" resuelven SKUs reales que no existen en los mocks |
| `home.api.ts` · `category.api.ts` · `search.api.ts` · `product.api.ts` | Catálogo por pantalla | `fetchHomeProducts`, `fetchCategoryProducts`, `searchProducts`, `fetchProductDetail` (+ las versiones "crudas" que devuelven la vista completa del BFF) |
| `cart.api.ts` | Carrito | Devuelve el carrito **recalculado** del BFF (`addItem`, `setItemQty`, `applyCoupon`, `validateCart`…). Wrappers `mirror*` para compat con la UI actual |
| `checkout.api.ts` | Checkout | `getCheckout`, `getDeliveryOptions`, `getPaymentMethods` y `confirmCheckout()` (handoff) |
| `account.api.ts` · `orders.api.ts` · `delivery.api.ts` · `auth.api.ts` | Cuenta, pedidos, despacho, sesión | Preparadas; wiring de UI en Fase 4 |
| `../hooks/useBffCatalog.ts` | Hooks por pantalla | Devuelven `{ data, live, loading }`; `live=true` solo si los datos vienen del BFF |

## Qué pantalla usa qué

| Pantalla | Hook | Endpoint del BFF | Fallback |
| --- | --- | --- | --- |
| `HomePage` | `useBffHome()` | `GET /home` (contenido CMS: hero/secciones/banners + productos) | maqueta local completa |
| `Header` / `CategoriesPage` | `useBffNavigation()` | `GET /navigation` (menú `main` del CMS) | `categoryTree` local |
| `CategoryPage` | `useCategoryProducts(id, slug)` | `GET /categories/:slug` | `productsByCategory()` |
| `SearchPage` | `useSearchProducts(q)` | `GET /search?q=` | filtro local |
| `ProductPage` | `useProductDetail(id)` | `GET /products/:slug` | registro → mock |
| `OffersPage` | `useHomeProducts()` | `GET /home` (filtrado a ofertas) | catálogo local |
| `OrdersPage` | `useBffOrders(mode)` | `GET /orders` (requiere sesión) | pedidos de ejemplo |
| `CartContext` | — (`bffCart`) | `POST/PATCH/DELETE /cart/...` (carrito recalculado) | carrito local |
| `CheckoutPage` / `OrderSummary` | — (`bffCart`) | totales del BFF + `POST /checkout/:id/confirm` | `buildTotals` local |
| *(login — UI en demo)* | `api/auth.api.ts` listo | `POST /auth/login\|refresh\|logout`, `GET /auth/me`, `GET /context` | demo local |

Los filtros, ordenamientos y la UI operan **igual en ambos modos**, porque el
adaptador entrega el mismo tipo `Product` de siempre (con `imageUrl` extra: si
viene, `ProductImage` muestra la foto real con fallback al tile).

## Carrito y checkout

![Carrito y handoff](img/11-carrito-handoff-front.png)

**Dirección de diseño** (ver `CONTRATOS-BFF.md` §7): cuando el BFF está
conectado, la **fuente de verdad de totales, stock validado y promociones es el
BFF**. El cálculo local (`utils/pricing.ts`) queda solo como *fallback* de
maqueta o caída del BFF. En **checkout siempre se recalcula** contra el BFF.

- `cart.api.ts` ya devuelve el carrito **recalculado** por cart-service en cada
  operación (`addItem`, `setItemQty`, `removeItem`, `applyCoupon`,
  `validateCart`). La primera operación crea el carrito y guarda su `cartId`.
- **Hoy** la UI mantiene el carrito local como estado visual y espeja al BFF
  (best-effort, wrappers `mirror*`) para no romper la maqueta; la migración de
  la UI a "BFF manda" es la **Fase 4**.
- Al confirmar, `confirmCheckout()` fija la entrega y dispara el **handoff**
  (snapshot + lock en cart-service). El `snapshotId` se usa como número de
  referencia (`MIM-XXXXXXXX`).
- **Importante**: el handoff no crea la orden ni cobra — eso ocurre downstream.
  No mostrar "compra realizada" como si fuera una orden confirmada de verdad.

## Entornos

![Entornos](img/12-entornos.png)

- **Dev**: proxy de Vite (`/api/web-bff` → `localhost:3080`), sin CORS.
- **Prod**: el edge sirve el build estático y rutea `/api/web-bff/*` al BFF
  (que además atiende `/robots.txt` y `/sitemap.xml` en la raíz del dominio).

## Qué se verificó en vivo

![Verificación en vivo](img/13-verificacion-vivo.png)

Con el BFF corriendo de verdad y este front en un Chromium real (y los
microservicios de dominio **apagados**, el peor caso): la home llamó al BFF y
pintó; ficha, búsqueda y carrito llamaron al BFF, recibieron 502 y **pintaron
igual** por fallback. Ninguna pantalla se rompió.

## Troubleshooting

| Síntoma | Causa probable | Solución |
| --- | --- | --- |
| Todo se ve como maqueta aunque configuré la URL | Vite no recargó el `.env` | Reiniciar `npm run dev` (las env de Vite se leen al arrancar) |
| Errores CORS en consola | Llamada directa sin proxy | Usa `VITE_BFF_URL=/api/web-bff` (proxy) o agrega tu origen a `CORS_ORIGINS` del BFF |
| Productos sin foto real | El BFF no está entregando `image` | Normal en fallback; con catalog vivo llega `imageUrl` |
| El carrito "no llega" al backend | BFF caído o cart-service caído | Es best-effort por diseño: el carrito local sigue; revisa `POST /api/web-bff/cart` en la pestaña Network |
| 401 en cuenta/pedidos | No hay token | Correcto: no existe aún proveedor de login de clientes (ver límites) |

## Límites conocidos

- **Login de clientes**: el BFF valida JWT pero **no emite tokens** (solo
  `GET /auth/session`). Falta definir el emisor/proxy — ver `CONTRATOS-BFF.md`
  gap #1. La pantalla de login sigue siendo demo local hasta cerrarlo.
- **Cuenta B2B**: faltan `/account/companies`, `/account/price-lists`,
  `/account/permissions` en el BFF (gap #3).
- **Contexto B2B por JWT**: para ver precios/condiciones B2B reales hace falta
  un token con los claims (`customerType`, `priceListId`…). El front **no**
  envía `x-customer-id`/`x-price-list-id` por seguridad (§4 del contrato).
- **Cotizaciones, listas y favoritos**: sin backend; siguen locales.
- **CMS admin**: **ya no vive en este repo** (Fase 2, hecha): se eliminó
  `src/features/cms/` y sus rutas. El backoffice está en `cms-front` (directo a
  `cms-service`); este front solo consume contenido publicado vía BFF. Ver
  `CONTRATOS-BFF.md` §9.
- **Datos reales**: requieren los microservicios de dominio corriendo (catalog,
  pricing, inventory, cart…). El front y el BFF ya están listos para cuando
  estén arriba.

---

_Documentación del BFF (arquitectura, endpoints, operación):
`Microservicios/web-bff-service/docs/README.md`._
