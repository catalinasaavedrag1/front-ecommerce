# Contratos e integración Front Ecommerce ↔ web-bff-service

Documento técnico de la integración. Complementa `INTEGRACION-BFF.md` (guía de
uso) con: el **contrato real** de cada endpoint, el **mapeo** entre lo que pide
el brief y lo que el BFF expone hoy, los **gaps** a cerrar en el BFF (sin
inventar lógica en el front) y las **decisiones de arquitectura** cerradas.

> Estado: Fase 0 + Fase 1 (capa `api/` limpia del front). Ver "Roadmap".

---

## 1. Regla de arquitectura

```
Cliente final ─► Front Ecommerce (este repo) ─► web-bff-service ─► microservicios internos
Equipo interno ─► Front CMS (repo cms-front)  ─► cms-service     ─► DB CMS
                  web-bff-service ─► cms-service (solo lee contenido publicado)
```

El Front Ecommerce **no** habla con microservicios internos (catalog, pricing,
inventory, search, promotion, seo, cms, cart, checkout, oms, delivery, customer,
id, comerce). Solo con el **web-bff-service**. El BFF orquesta y devuelve
modelos "listos para pintar". El front **no calcula** precio, stock,
promociones, despacho ni reglas de OMS.

---

## 2. Base URL, prefijo y modos

| | Valor |
|---|---|
| Prefijo del BFF | `api/web-bff` (NestJS `setGlobalPrefix`) |
| Puerto local del BFF | `3080` |
| Variable del front | `VITE_BFF_URL` |
| Dev (recomendado) | `VITE_BFF_URL=/api/web-bff` (proxy de `vite.config.ts` → `localhost:3080`) |
| Prod | `VITE_BFF_URL=https://api.mimbral.cl/web-bff` (o el host real) |
| Vacía / ausente | **modo maqueta**: la app funciona con `src/data/*` |

El front funciona en **dos modos** y cambia con esa sola variable. Regla de oro:
**degradación elegante** — si el BFF no está, falla o responde vacío, cada
pantalla vuelve sola a los datos locales. La tienda nunca queda en blanco.

---

## 3. Capa de integración del front (esta pasada)

```
src/lib/
  env.ts        Base URL, isBffEnabled, timeout, locale/moneda
  storage.ts    Claves de localStorage centralizadas
  session.ts    sessionId anónimo + cartId
  auth.ts       token del cliente (Bearer)
  context.ts    contexto B2C/B2B derivado del cliente (canal, comuna)
  cookies.ts    utilidades de cookie (para futuro SSR)
  errors.ts     BffError + catálogo code→userMessage + toUserMessage()
src/api/
  web-bff.client.ts   webBffRequest<T> — ÚNICO punto de fetch al BFF
  types.ts            tipos espejo de las vistas del BFF
  adapters.ts         BFF view → Product del front (0 cambios en componentes)
  registry.ts         productos vivos por SKU (memoria + sessionStorage)
  home.api.ts  category.api.ts  search.api.ts  product.api.ts
  cart.api.ts  checkout.api.ts  account.api.ts  orders.api.ts
  delivery.api.ts  auth.api.ts
```

Ningún componente hace `fetch` a mano: consumen `api/*.api.ts` (directo o vía
`hooks/useBffCatalog.ts`), y estas usan `webBffRequest`.

---

## 4. Contexto y headers (lo que el front envía)

El cliente compone estos headers en cada llamada (`web-bff.client.ts`):

| Header | Valor | Lo lee el BFF |
|---|---|---|
| `content-type` | `application/json` | — |
| `x-sales-channel` | `web` (B2C) · `b2b` (B2B) | ✅ `SalesChannelContextService` |
| `x-session-id` | UUID anónimo persistente | ✅ |
| `x-locale` | `es-CL` | ✅ |
| `x-currency` | `CLP` | ✅ |
| `authorization` | `Bearer <token>` si hay sesión | ✅ (valida JWT) |
| `x-cart-id` | cartId activo si existe | ✅ |
| `x-store-id` | tienda física si aplica | ✅ |
| `x-commune` | comuna de despacho si existe | ⚠️ **no consumido aún** (gap #4) |

### Decisión clave — contexto B2B por JWT, no por headers

El BFF deriva `customerId`, `customerType` (B2C/B2B), `priceListId`,
`companyId` y `roles` **desde los claims del JWT** (`CustomerContextService`),
**no** desde headers. Por eso el front **NO envía** `x-customer-id` ni
`x-price-list-id` (a diferencia de lo que sugería el brief): que el cliente
afirme su propia lista de precios sería inseguro. El canal B2C/B2B se **deriva**
del cliente logueado (`context.ts`) y solo se comunica el matiz vía
`x-sales-channel`.

> Implicancia: para ver precios/condiciones B2B reales hace falta un **token
> con esos claims**. Ver gap #1 (login/emisión de token).

---

## 5. Mapeo de endpoints — brief ↔ BFF real

Leyenda: ✅ existe y está cableado · 🟡 existe, aún sin UI · ❌ falta en el BFF.

### Home
| Brief | BFF real | Estado |
|---|---|---|
| `GET /home` | `GET /home` | ✅ `home.api.ts` |

### Categorías
| `GET /categories/:slug` | `GET /categories/:slug?pageSize=` | ✅ `category.api.ts` |

### Búsqueda
| `GET /search?q=&page=&sort=&filters=` | `GET /search?q=&page=&sort=&pageSize=` (+`/autocomplete`, `/suggestions`) | ✅ `search.api.ts` |

### Ficha de producto
| `GET /products/:slug` | `GET /products/:slug` (+`/cards`, `/:sku/availability`) | ✅ `product.api.ts` |

### Carrito
| Brief | BFF real | Estado |
|---|---|---|
| `GET /cart` | `POST /cart` (crea) · `GET /cart/:cartId` | 🟡 `cart.api.ts` |
| `POST /cart/items` | `POST /cart/:cartId/items` | 🟡 |
| `PATCH /cart/items/:itemId` | `PATCH /cart/:cartId/items/:itemId` | 🟡 |
| `DELETE /cart/items/:itemId` | `DELETE /cart/:cartId/items/:itemId` | 🟡 |
| `POST /cart/coupon` | `POST /cart/:cartId/apply-coupon` | 🟡 |
| `DELETE /cart/coupon` | `DELETE /cart/:cartId/coupon/:code` | 🟡 |
| — | `POST /cart/:cartId/validate` | 🟡 |

> Diferencia: el BFF lleva `cartId` en la ruta. El front lo abstrae en
> `cart.api.ts` (toma el cartId de sesión).

### Checkout
| Brief | BFF real | Estado |
|---|---|---|
| `POST /checkout/start` | *(implícito: `POST /cart` + `GET /checkout/:cartId`)* | 🟡 |
| `POST /checkout/customer` | ❌ no existe como paso | gap #2 |
| `POST /checkout/delivery` | `POST /checkout/:cartId/delivery-options` | 🟡 |
| `POST /checkout/payment` | `POST /checkout/:cartId/payment-methods` | 🟡 |
| `POST /checkout/confirm` | `POST /checkout/:cartId/confirm` | ✅ (handoff) |
| `GET /checkout/:id` | `GET /checkout/:cartId` | 🟡 |

### Cuenta / B2B
| Brief | BFF real | Estado |
|---|---|---|
| `GET /account/me` | `GET /account/profile` | 🟡 `account.api.ts` |
| `GET /account/addresses` | `GET /account/addresses` (+POST/PATCH/DELETE) | 🟡 |
| `GET /account/companies` | ❌ | gap #3 |
| `GET /account/price-lists` | ❌ | gap #3 |
| `GET /account/permissions` | ❌ | gap #3 |

### Pedidos
| `GET /orders` · `GET /orders/:id` | idem (+`/tracking`, `/documents`, `POST /cancel-request`) | 🟡 `orders.api.ts` |

### Despacho
| Brief | BFF real | Estado |
|---|---|---|
| *(dentro de ficha/checkout)* | `POST /delivery/options` · `GET /delivery/pickup-locations` · `GET /delivery/zones` · `POST /delivery/quote` | 🟡 `delivery.api.ts` |

### Contenido publicado (CMS vía BFF)
| `GET /landings/:slug` | `GET /content/landings/:slug` · `GET /content/pages/:slug` · `GET /content/banners` | 🟡 |
| navegación/menús | `GET /navigation` | 🟡 |

### SEO
| metadata / schema.org / sitemap | `GET /seo/meta` · `GET /seo/structured-data/product/:slug` · `GET /sitemap.xml` · `GET /robots.txt` | 🟡 |

### Sesión / auth
| Brief login/logout | `GET /auth/session` (solo contexto; **no emite token**) | gap #1 |

---

## 6. Sobre de respuesta y errores

**Éxito:**
```json
{ "success": true, "data": { /* … */ }, "correlationId": "…" }
```
`webBffRequest` desenvuelve y devuelve `data`.

**Error (plano, NO anidado en `error`):**
```json
{ "success": false, "code": "STOCK_UNAVAILABLE", "message": "…",
  "statusCode": 409, "details": null, "correlationId": "…" }
```

El front tipa esto como `BffError` (`lib/errors.ts`) y **siempre** muestra un
mensaje amigable vía `toUserMessage(err)`. Nunca se muestran errores técnicos
(SAP, Prisma, Kafka, SQL, "reservation failed"…).

Códigos reales del BFF mapeados: `STOCK_UNAVAILABLE`, `PRICING_UNAVAILABLE`,
`RESOURCE_NOT_FOUND`, `INVALID_SALES_CHANNEL`, `VALIDATION_ERROR`,
`BAD_REQUEST`, `DOWNSTREAM_SERVICE_ERROR`, `INTERNAL_ERROR` + alias del brief
(`OUT_OF_STOCK`, `CHECKOUT_EXPIRED`, `DELIVERY_NOT_AVAILABLE`, …) + transporte
(`NETWORK_ERROR`, `TIMEOUT`).

---

## 6b. Verificación en vivo (BFF corriendo)

Se levantó el `web-bff-service` local (sin downstream: Redis/Kafka/cache
apagados, servicios de dominio a puerto muerto → `failOpen`) y se golpearon los
endpoints reales. Resultado:

| Comprobación | Resultado |
|---|---|
| Envelope de éxito `{ success, data, correlationId }` | ✅ confirmado (`/health`, `/home`, `/auth/session`) |
| Envelope de error `{ success:false, code, message, statusCode, details, correlationId }` | ✅ confirmado; `DOWNSTREAM_SERVICE_ERROR` (502) en `/categories`, `/search`, `/products`, `/cart`, `/account` |
| **Contexto B2B por JWT** | ✅ con un token `{ customerType:b2b, priceListId, companyId }` el BFF resolvió `customerId` e `isAuthenticated:true` en `/auth/session`. Valida §4 (front manda token, BFF deriva del claim) |
| Guard de auth | ✅ con token pasa; falla recién en downstream (no 401) |
| `BffSession` | ✅ calza exacto: `{ sessionId, customerId?, isAuthenticated, cartId? }` |

Cruce campo-a-campo contra los mappers reales del BFF (`src/mappers/*.mapper.ts`):
`BffPrice`, `BffAvailability`, `BffProductCard`, `BffProductDetail`,
`BffCartItem`, `BffFilter` y `promotions` **calzan exacto**. Se corrigieron los
tipos que omitían campos:

- `BffHome.seo` y `BffCategoryPage.seo` (**requeridos** — el BFF siempre los
  devuelve; se agregó el tipo `BffSeo`, espejo de `SeoView`).
- `BffProductDetail.seo?` (opcional).
- `BffSearchPage.redirect?` (opcional).
- `BffCart.checkoutId?` (opcional).

> No se pudieron ver los datos poblados de product/cart/search en vivo porque
> requieren sus downstream con DB. La forma (nombres de campos) quedó verificada
> contra los mappers, que son la fuente del contrato.

---

## 7. Carrito y precios — "el BFF manda"

Decisión: **cuando el BFF está conectado, la fuente de verdad de totales, stock
validado y promociones es el BFF** (cart-service vía BFF). El cálculo local
(`utils/pricing.ts`) queda **solo como fallback** de maqueta o caída del BFF.
En **checkout siempre se recalcula** contra el BFF antes de confirmar.

- Plomería lista: `cart.api.ts` (`fetchCart`, `addItem`, `setItemQty`,
  `removeItem`, `applyCoupon`, `validateCart` devuelven el carrito
  **recalculado** del BFF) y `checkout.api.ts` (recalcula/confirma).
- **Fase 4 (hecho):** `CartContext` expone `bffCart` (el carrito recalculado del
  BFF; se hidrata al montar y tras cada operación). `OrderSummary` usa esos
  totales (`subtotal/discount/shipping/total Formatted`) como **autoritativos**
  cuando `bffCart` existe, con el badge "Totales validados"; en maqueta o caída
  del BFF cae a `buildTotals`. La página de carrito interactiva mantiene su
  aritmética local para las barras de progreso/IVA (necesita números), tomando
  el total autoritativo del BFF cuando está vivo.

---

## 8. Gaps del BFF a cerrar (contratos propuestos, NO lógica en el front)

**Gap #1 — Login / emisión de token.** El BFF valida JWT pero no lo emite.
Falta definir el emisor (probablemente `id-service`) y, si se quiere que el
front hable solo con el BFF, un proxy:
```
POST /auth/login   { username, password }  → { token, expiresIn, customer }
POST /auth/logout                          → { success }
POST /auth/refresh { refreshToken }        → { token }
```
El token debe incluir claims: `sub/customerId`, `customerType`, `priceListId`,
`companyId`, `roles`.

**Gap #2 — Checkout por pasos de cliente.** No hay `POST /checkout/:id/customer`.
Si el flujo lo requiere (asociar cliente/dirección al checkout), definir:
```
POST /checkout/:cartId/customer { customerId?, guest?, addressId?, address? }
```

**Gap #3 — Cuenta B2B.** Faltan:
```
GET /account/companies     → empresas asociadas al comprador
GET /account/price-lists   → listas de precio disponibles
GET /account/permissions   → permisos/rol del comprador
```
(Alternativa: incluirlos dentro de `GET /account/profile`.)

**Gap #4 — Contexto de ubicación.** `RequestContextFactory` no puebla
`context.location` (región/comuna). El BFF debería leer `x-commune`/`x-region`
(o `lat/lng`) para resolver despacho/stock por zona. El front ya envía
`x-commune`; es forward-compatible.

**Gap #5 — Formas de las vistas.** Los tipos de `account`, `orders`, `delivery`
y `checkout` en `api/types.ts` son pragmáticos y deben **refinarse contra los
payloads reales** del BFF cuando se levante el entorno integrado.

---

## 9. Decisión cerrada — separar el CMS admin del front público

**El CMS admin NO debe vivir en este repo.** Hoy `src/features/cms/` (~50
componentes de backoffice) se rutea en `App.tsx` vía `cmsRoutes()`; es una
**duplicación** del repo `cms-front` (Next.js) y hace que el backoffice viaje
en el bundle público. 

Decisión: el backoffice queda **solo en `cms-front`**, conectado **directo a
`cms-service`** (`api/cms`, sin pasar por el BFF). Este front público solo
**consume contenido ya publicado** vía BFF (`/home`, `/categories`,
`/content/landings`). 

**Estado (Fase 2, hecha):** se eliminó `src/features/cms/` (45 archivos) y el
`cmsRoutes()` de `App.tsx` de este repo. El bundle bajó ~138 kB de JS. Falta
(Fase 3, en `cms-front`): cablear `cms-front` contra `cms-service` — reemplazar
`simulateRequest`/mocks por un `cms-service.client.ts`.

---

## 10. Roadmap

- [x] **Fase 0** — Contratos, mapeo y gaps (este documento).
- [x] **Fase 1** — Capa `api/` + `lib/` limpia, contexto B2C/B2B, errores
  centralizados, sin romper la maqueta (degradación intacta).
- [x] **Fase 2** — Sacar el CMS admin del front público (decisión §9): hecho.
- [ ] **Fase 3** — `cms-front` ↔ `cms-service` (cliente real, sin mocks).
- [~] **Fase 4** — En curso:
  - [x] Ofertas → BFF (vía home, degradable). Funciona en vivo.
  - [x] Carrito "BFF manda" en los resúmenes (`CartContext.bffCart` + `OrderSummary`).
  - [x] Pedidos → hook `useBffOrders` con degradación (dormido hasta login, gap #1).
  - [x] Tipos refinados contra payloads reales (§6b).
  - [ ] Cuenta (perfil): el perfil hoy es el `customer` local; el wiring a
    `/account/profile` queda dormido hasta que exista login real (gap #1).
  - [ ] Página de carrito interactiva 100% sobre totales del BFF (requiere
    cart-service arriba para probar end-to-end).

---

## 11. SEO (nota importante)

Este front es un **SPA con Vite (React + react-router-dom), no Next.js**. El
capítulo de SSR del brief no aplica tal cual: no hay render de servidor. El SEO
se resuelve por otra vía (el BFF ya expone `sitemap.xml`, `robots.txt` y
`/seo/meta`; para metadata por página se puede usar pre-render/SSG o
`react-helmet`). Definir estrategia antes de asumir SSR.
