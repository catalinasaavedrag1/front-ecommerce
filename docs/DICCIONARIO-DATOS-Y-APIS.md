# Diccionario de datos y APIs — campo por campo, técnico y en simple

Referencia completa de **todos los campos** (headers, ajustes, modelos de
datos) y **todas las APIs** de la plataforma. Cada elemento se explica en dos
registros:

- **Técnico** → para el equipo de desarrollo (nombre exacto, tipo, origen).
- **En simple** → para cualquier persona del negocio, sin jerga.

Y siempre se indica **con qué se conecta** (qué pieza lo produce y quién lo usa).

> Piezas (ver `GUIA-OPERACION.md`): **Tienda web** = front-ecommerce ·
> **Coordinador** = web-bff-service · **Panel de contenido** = cms-front ·
> **Archivo de contenido** = cms-service · **Servicios internos** = bodega
> (inventory), caja (pricing), catálogo (catalog), carros (cart), despacho
> (delivery), buscador (search), promociones (promotion), pedidos (oms), SEO
> (seo), clientes (customer).

**Índice**
1. [Headers: el "contexto" que viaja en cada petición](#1-headers)
2. [Memoria del navegador (localStorage)](#2-memoria-del-navegador)
3. [Variables de entorno (los interruptores)](#3-variables-de-entorno)
4. [El sobre de toda respuesta del coordinador](#4-el-sobre)
5. [Modelos de datos, campo por campo](#5-modelos-de-datos)
6. [APIs del coordinador (web-bff-service), una por una](#6-apis-del-coordinador)
7. [APIs del archivo de contenido (cms-service)](#7-apis-de-cms-service)

---

## 1. Headers: el "contexto" que viaja en cada petición <a name="1-headers"></a>

**En simple:** cada vez que la tienda le pide algo al coordinador, adjunta una
"ficha del visitante": quién es, en qué modo compra, dónde quiere el despacho.
Con esa ficha, el coordinador responde con los precios y stock correctos **sin
que la tienda tenga que calcular nada**.

**Técnico:** los compone `src/api/web-bff.client.ts` en el front; los lee el
`RequestContextFactory` del BFF y arma el `RequestContext` que viaja a todos
los servicios internos.

| Header | Técnico | En simple | Se conecta con |
|---|---|---|---|
| `x-sales-channel` | `'web'` (B2C) o `'b2b'`. El front lo **deriva** del tipo de cliente logueado (`lib/context.ts`); nunca se elige a mano. | "¿Está comprando como persona o como empresa?" Cambia qué precios y promociones aplican. | Caja (pricing: qué lista usar), promociones, contenido segmentado del CMS. |
| `x-session-id` | UUID v4 generado una vez por navegador y persistido (`lib/session.ts`). | El "número de visita" anónimo: permite recordar tu carro **sin** que inicies sesión. | Coordinador (sesión anónima en Redis), carros (cart-service). |
| `authorization` | `Bearer <JWT>`. El BFF **valida** la firma (JWT_SECRET) y extrae los claims: `customerId`, `customerType`, `priceListId`, `companyId`, `roles`, `hasCredit`. | La credencial firmada del cliente logueado. Todo lo que "eres" viaja dentro, firmado — nadie puede inventarse una lista de precios. | Clientes (customer), pedidos (oms), caja (lista B2B), crédito. **Hoy nadie emite este token** (login pospuesto): sin él, todo funciona como visitante anónimo. |
| `x-cart-id` | Id del carro abierto, guardado tras crear el carro (`lib/session.ts`). | El "número de tu carro" para retomarlo entre páginas. | Carros (cart-service) vía coordinador. |
| `x-store-id` | Tienda física de contexto (opcional). | "Estoy comprando pensando en la sucursal X" — afecta retiro y stock local. | Bodega (stock por tienda), retiro en tienda. |
| `x-commune` / `x-region` | Comuna/región de despacho seleccionada (persistida por `AppContext`). El BFF la pone en `context.location` y despacho/checkout la usan si el cuerpo no trae una. | "¿A qué comuna te llevamos las cosas?" Cambia costos y disponibilidad de despacho. | Despacho (delivery-service) y checkout. |
| `x-locale` | `es-CL`. | El idioma/formato: pesos chilenos, textos en español. | Formateo de precios y textos en el coordinador. |
| `x-currency` | `CLP`. | La moneda. | Caja y formateo. |
| `x-correlation-id` | Lo genera el BFF si no viene; se devuelve en cada respuesta. | El "número de seguimiento" de cada petición: con él, el equipo técnico encuentra en los registros qué pasó exactamente. | Todos los servicios (trazabilidad de errores). |
| `content-type` | `application/json`. | Detalle de fontanería: "te hablo en formato JSON". | Todo. |

**Lo que NO se envía (decisión de seguridad):** `x-customer-id` y
`x-price-list-id`. El coordinador los deduce **del token firmado**, no de lo
que el navegador diga. Si viajaran como headers, cualquiera podría reclamarse
la lista de precios de otro.

---

## 2. Memoria del navegador (localStorage) <a name="2-memoria-del-navegador"></a>

**En simple:** la tienda guarda unas pocas cosas en el navegador del cliente
para que al volver todo siga donde estaba. Se borran al limpiar datos del
navegador.

**Técnico:** claves centralizadas en `src/lib/storage.ts` (`STORAGE_KEYS`).

| Clave | Técnico | En simple | Se conecta con |
|---|---|---|---|
| `mimbral.customer` | JSON del `Customer` logueado (nombre, tipo b2c/b2b, empresa, lista, crédito). | "Quién soy" en este navegador. De aquí se **deriva** el modo Persona/Empresa. | `AppContext`, header `x-sales-channel`. |
| `mimbral.comuna` | Comuna seleccionada. | "Dónde quiero mi despacho". | Header `x-commune`, cálculo de despacho. |
| `mimbral.priceview` | Preferencia B2B: ver precios neto/bruto/ambos. | Cómo prefiere ver los precios una empresa. | Solo la UI (no viaja al backend). |
| `mimbral.token` | JWT del cliente. | La credencial guardada para no reloguear a cada rato. | Header `authorization`. |
| `mimbral.bff.session` | UUID de sesión anónima. | El número de visita. | Header `x-session-id`. |
| `mimbral.bff.cartId` | Id del carro en cart-service. | El número del carro abierto. | Header `x-cart-id`, APIs de carro. |
| `mimbral.bff.products` | Cache de productos que llegaron del BFF (sessionStorage, máx. 300). | Una libreta con los últimos productos vistos "de verdad", para que carro y "vistos recientemente" funcionen con SKUs reales. | `api/registry.ts`. |
| `mimbral.cart` | Las líneas del carro local (visual). | El carro que ves al instante, aunque no haya internet al backend. | `CartContext` (el BFF recalcula el oficial cuando está vivo). |

---

## 3. Variables de entorno (los interruptores) <a name="3-variables-de-entorno"></a>

**En simple:** cada aplicación tiene un archivo `.env` con sus ajustes, como el
panel de interruptores de un local. Se leen **al encender** (cambiar uno ⇒
reiniciar esa aplicación).

### 3.1 Tienda web (`front-ecommerce/.env`)

| Variable | Técnico | En simple | Se conecta con |
|---|---|---|---|
| `VITE_BFF_URL` | Base URL del BFF. Vacía ⇒ modo maqueta. `/api/web-bff` en dev (proxy Vite → :3080); URL completa en prod. | **El interruptor maestro**: apagado = tienda de demostración; encendido = datos reales. | Coordinador. |
| `VITE_BFF_TIMEOUT_MS` | Timeout por petición (default 8000 ms). | Cuántos segundos espera la tienda antes de rendirse y usar datos de ejemplo. | Cliente HTTP del front. |

### 3.2 Panel de contenido (`cms-front/.env`)

| Variable | Técnico | En simple | Se conecta con |
|---|---|---|---|
| `NEXT_PUBLIC_CMS_SERVICE_URL` | Base de cms-service (`http://localhost:3040/api/cms` en dev). Vacía ⇒ modo ejemplo. | Interruptor del panel: apagado = datos de muestra; encendido = contenido real. | Archivo de contenido. |
| `NEXT_PUBLIC_CMS_TIMEOUT_MS` | Timeout (default 8000 ms). | Ídem tienda. | Cliente HTTP del panel. |
| `NEXT_PUBLIC_CMS_ADMIN_USER_ID` / `NEXT_PUBLIC_CMS_CLIENT` / `NEXT_PUBLIC_CMS_ADMIN_PERMISSIONS` | Identidad admin que se envía como headers (`x-user-id`, `x-client`, `x-user-permissions`). En prod los sobreescribe el api-gateway. | "Quién firma los cambios de contenido" mientras no haya login corporativo conectado. | cms-service (guard de gateway). |

### 3.3 El coordinador (`web-bff-service/.env`) — los principales

| Variable | Técnico | En simple | Se conecta con |
|---|---|---|---|
| `PORT` / `API_PREFIX` | 3080 / `api/web-bff`. | La "puerta y el letrero" del coordinador. | Tienda web, proxy/edge. |
| `CORS_ORIGINS` | Lista de orígenes permitidos (dominios del front). | La lista de invitados: qué sitios pueden llamar al coordinador. **Hay que agregar el dominio real al salir a producción.** | Navegadores de los clientes. |
| `JWT_SECRET` / `JWT_EXPIRES_IN` | Secreto de validación de tokens (obligatorio en prod) y su vigencia. | La llave con que se verifica que las credenciales de clientes son auténticas. | Login futuro, cuenta, pedidos, B2B. |
| `ANONYMOUS_SESSION_TTL_SECONDS` | Vigencia de la sesión anónima (30 días). | Cuánto tiempo "te recordamos" sin login. | Sesiones/carros anónimos. |
| `REDIS_URL` / `REDIS_ENABLED` / `CACHE_ENABLED` | Redis para cache de lecturas y sesiones. | La "memoria rápida": responde al tiro lo ya consultado. Apagable en dev. | Todo lo cacheado. |
| `CACHE_TTL_HOME/CATEGORY/PRODUCT/SEO/CONTENT/…` | Segundos de vida de cada copia (home 300, producto 120…). | Por cuántos minutos se sirve la copia antes de re-preguntar. **Explica por qué un banner tarda ~5 min en aparecer.** | Home, categorías, fichas, contenido. |
| `HTTP_TIMEOUT_MS` / `HTTP_MAX_RETRIES` / `CIRCUIT_BREAKER_*` | Paciencia, reintentos y "cortacircuito" hacia servicios internos. | Si bodega no contesta, el coordinador no se queda pegado: corta, reintenta o sigue sin ese dato. | Los 15 servicios internos. |
| `CATALOG_SERVICE_URL`, `SEARCH_…`, `PRICING_…`, `PROMOTION_…`, `INVENTORY_…`, `CART_…`, `CMS_…`, `SEO_…`, `CUSTOMER_…`, `CUSTOMER_CREDIT_…`, `OMS_…`, `DELIVERY_…`, `FINANCE_…`, `NOTIFICATION_…`, `COMERCE_SERVICE_URL` | Dirección de cada servicio interno. | La **agenda de teléfonos** del coordinador: dónde ubicar a bodega, caja, despacho, etc. | Cada microservicio. |
| `KAFKA_ENABLED` | Mensajería de eventos (apagada por defecto). | Un "citófono" interno para avisos entre servicios; hoy apagado. | Invalidación de cache futura. |

---

## 4. El sobre de toda respuesta del coordinador <a name="4-el-sobre"></a>

**En simple:** todo lo que responde el coordinador viene en un "sobre" con el
mismo formato: si salió bien, adentro viene el contenido; si salió mal, viene
una explicación con código y número de seguimiento.

**Técnico** (verificado en vivo):

```json
// Éxito
{ "success": true, "data": { …contenido… }, "correlationId": "uuid" }

// Error (plano, no anidado)
{ "success": false, "code": "STOCK_UNAVAILABLE", "message": "…",
  "statusCode": 409, "details": {…}, "correlationId": "uuid" }
```

| Campo | Técnico | En simple |
|---|---|---|
| `success` | boolean. | ¿Salió bien? |
| `data` | El contenido (uno de los modelos de la sección 5). | El paquete pedido. |
| `code` | Código estable de error (`STOCK_UNAVAILABLE`, `PRICING_UNAVAILABLE`, `RESOURCE_NOT_FOUND`, `VALIDATION_ERROR`, `DOWNSTREAM_SERVICE_ERROR`, `INTERNAL_ERROR`…). | La causa en una palabra. La tienda la traduce a un mensaje amable (`lib/errors.ts`): "Este producto no tiene stock disponible". **El cliente jamás ve errores técnicos.** |
| `message` | Texto del error (ya viene apto). | La explicación. |
| `statusCode` | HTTP (404, 409, 502…). | La categoría del problema. |
| `details` | Payload extra (p. ej. `{service: "catalog"}`). | Pista para el equipo técnico; no se muestra. |
| `correlationId` | UUID de la petición. | El número de seguimiento para buscar en los registros. |

---

## 5. Modelos de datos, campo por campo <a name="5-modelos-de-datos"></a>

Son los "paquetes" que viajan dentro del sobre. Todos están **orientados a
pantalla**: el coordinador ya hizo los cálculos; la tienda solo pinta.
(Espejo en código: `src/api/types.ts`, verificado contra los mappers del BFF.)

### 5.1 Precio (`BffPrice`) — lo produce la caja (pricing-service)

| Campo | Técnico | En simple |
|---|---|---|
| `amount` | number, precio de venta final (CLP). | **Lo que paga el cliente.** |
| `formatted` | string ya formateado ("$4.990"). | El precio listo para mostrar, con puntos y signo. |
| `listAmount` / `listFormatted` | Precio de lista; solo viene si hay descuento. | El precio "tachado" de antes de la oferta. |
| `hasDiscount` | boolean. | ¿Está en oferta? |
| `discountLabel` | "-17%" (si aplica). | La etiqueta del descuento. |
| `currency` | "CLP". | La moneda. |

> Con cliente B2B (token con `priceListId`), la caja usa **su** lista: estos
> mismos campos llegan con los valores de empresa. La tienda no distingue —
> solo pinta.

### 5.2 Disponibilidad (`BffAvailability`) — la produce bodega (inventory-service-v3)

| Campo | Técnico | En simple |
|---|---|---|
| `available` | boolean. | ¿Se puede comprar? |
| `status` | `in_stock` \| `low_stock` \| `out_of_stock`. | Verde / amarillo / rojo. |
| `label` | "Disponible" / "No disponible". | El texto que se muestra. |
| `quantityLabel` | "Ultimas unidades" (solo low). | El aviso de urgencia. |

> **A propósito no viene la cantidad exacta de stock**: el front no debe
> conocer (ni mostrar) inventario profundo. Es una regla de arquitectura.

### 5.3 Tarjeta de producto (`BffProductCard`) — catálogo + caja + bodega + promociones

Es lo que llena las **grillas** (home, categoría, búsqueda).

| Campo | Técnico | En simple |
|---|---|---|
| `sku` | Código de negocio del producto (referenceId). | El "RUT" del producto. |
| `slug` | Identificador para URL ("taladro-bosch-650w"). | El nombre-para-el-link. |
| `name` | Nombre comercial. | Cómo se llama. |
| `url` | Ruta canónica de la ficha. | El link a su página. |
| `image` | URL de la foto principal (opcional). | Su foto. |
| `brand` | Marca (opcional). | La marca. |
| `price` | `BffPrice` o `null` (si la caja no respondió). | Su precio (o "precio no disponible"). |
| `available` + `availability` | Ver 5.2. | ¿Hay stock? |
| `promotions.badges` / `.labels` | Textos cortos de promociones activas. | Las cintas tipo "2x1", "Envío gratis". |

### 5.4 Ficha de producto (`BffProductDetail`) — además de lo anterior

| Campo | Técnico | En simple |
|---|---|---|
| `title` | Título largo de la ficha. | El titular de la página. |
| `category` | Nombre de la categoría. | Dónde vive en el árbol. |
| `description` | Texto descriptivo. | La descripción de venta. |
| `images[]` | `{url, alt}` múltiples. | La galería de fotos. |
| `specs[]` | `{label, value}` (de atributos del catálogo). | La tabla de características ("Potencia: 650W"). |
| `measurementUnit` | Unidad ("un", "kg", "m²"). | Cómo se vende. |
| `seo` | `BffSeo` (5.9), opcional. | Los datos para Google de esta ficha. |

### 5.5 Carro (`BffCart`) — lo produce carros (cart-service); **es la fuente oficial de totales**

| Campo | Técnico | En simple |
|---|---|---|
| `cartId` | Id del carro. | El número del carro. |
| `itemCount` / `totalQuantity` | Nº de productos distintos / unidades totales. | "3 productos, 7 unidades". |
| `currency` | "CLP". | Moneda. |
| `items[].itemId` | Id de la línea (para modificar/borrar). | El número de esa línea del carro. |
| `items[].sku` / `.name` / `.image` | Qué producto es. | Qué hay en el carro. |
| `items[].quantity` | Cantidad. | Cuántas unidades. |
| `items[].unitPriceFormatted` / `.totalFormatted` | Precio unitario y total de la línea, ya formateados. | Lo que cuesta cada una y la línea completa. |
| `items[].availabilityStatus` | Estado de stock re-validado. | "Ojo, quedó sin stock mientras comprabas". |
| `totals.subtotalFormatted` | Suma de productos. | Subtotal. |
| `totals.discountFormatted` | Descuentos aplicados (cupones/promos). | Cuánto te ahorraste. |
| `totals.shippingFormatted` | Costo de despacho o "Por calcular". | El envío. |
| `totals.totalFormatted` | **El total final.** | **Lo que vas a pagar.** |
| `checkoutId` | Si ya se inició un checkout. | El número del proceso de pago. |

> Regla "el BFF manda": cuando este paquete llega, la tienda muestra **estos**
> totales (badge "Totales validados"). El cálculo local es solo respaldo de
> maqueta.

### 5.6 Handoff de checkout (`BffCheckoutHandoff`)

| Campo | Técnico | En simple |
|---|---|---|
| `cartId` | Carro confirmado. | Qué carro se cerró. |
| `snapshotId` | Foto inmutable del carro; se usa como referencia `MIM-XXXXXXXX`. | El **número de referencia** de tu compra. |
| `lockId` | Bloqueo del carro durante el pago. | "El carro queda congelado mientras pagas" (nadie le cambia precios). |
| `status` / `expiresAt` | Estado y vencimiento del bloqueo. | Hasta cuándo está reservado. |
| — | **Importante:** el handoff **no cobra ni crea la orden**; eso pasa después (checkout/OMS). | Es el "ticket de intención", no la boleta. |

### 5.7 Home (`BffHome`) — el coordinador la arma con CMS + catálogo + caja + bodega

| Campo | Técnico | En simple |
|---|---|---|
| `hero` | `data` libre del bloque hero de la página CMS (o null). | La portada grande de arriba, si marketing la definió. |
| `sections[]` | `{id, type, title, data, products[]}`; el BFF completa los SKUs del CMS con precio/stock reales. | Las filas que armó marketing ("Destacados de invierno") **ya con precios de verdad**. |
| `banners[]` | `BffBanner` (5.8), placement `home-hero`. | Los banners publicados. |
| `seo` | `BffSeo` (5.9). | Los datos para Google de la portada. |

### 5.8 Banner (`BffBanner`) — viene del archivo de contenido (cms-service)

| Campo | Técnico | En simple |
|---|---|---|
| `id` / `name` | Identificador y nombre interno. | Cómo lo llamó marketing. |
| `placement` | Ubicación ("home-hero", "category-<slug>"). | En qué lugar de la página va. |
| `desktopImageUrl` / `mobileImageUrl` | Imágenes por dispositivo. | La imagen para computador y para teléfono. |
| `altText` | Texto alternativo. | Lo que "lee" Google y el lector de pantalla. |
| `targetUrl` | A dónde lleva el clic. | El link del banner. |
| `salesChannel` | B2C/B2B/ambos. | A qué público se muestra. |
| `priority` | Orden. | Cuál va primero. |
| `status` | Publicado/inactivo. | Si está al aire. |

### 5.9 SEO (`BffSeo`) — lo produce seo-service (con fallback del coordinador)

| Campo | Técnico | En simple |
|---|---|---|
| `title` / `description` | Meta título y descripción. | El titular y resumen que muestra Google. |
| `canonical` | URL canónica. | "Esta es la dirección oficial de esta página" (evita duplicados). |
| `robots` / `indexable` | "index,follow" / boolean. | ¿Queremos que Google la muestre? |
| `keywords` | Palabras clave (opcional). | Términos asociados. |
| `openGraph` / `twitter` | Metadatos para compartir en redes. | Cómo se ve la tarjetita al compartir el link. |
| `hreflang[]` | Variantes por idioma/país. | Versiones para otros países. |
| `structuredData[]` | JSON-LD (schema.org: Product, BreadcrumbList…). | Datos "etiquetados" para que Google muestre precio y estrellas en el resultado. |

### 5.10 Búsqueda (`BffSearchPage`) y Categoría (`BffCategoryPage`)

| Campo | Técnico | En simple |
|---|---|---|
| `query` / `correctedQuery` | Lo buscado y la corrección ("taladr" → "taladro"). | Qué escribiste y qué entendimos. |
| `total` / `page` / `pageSize` | Paginación. | Cuántos resultados hay y en qué página vas. |
| `products[]` | `BffProductCard[]` (5.3). | Los resultados. |
| `filters[].code/.label/.options[{value,label,count}]` | Facetas del buscador. | Los filtros laterales ("Marca (12)"). |
| `sortOptions[]` | Relevancia, precio asc/desc, más nuevos. | El selector "ordenar por". |
| `redirect` | `{targetUrl, status}` — búsquedas que redirigen (p. ej. a una landing). | "Buscaste 'despacho' → te llevamos a la página de despacho". |
| *(categoría)* `category{id,name,slug}` | La categoría resuelta. | Dónde estás parado. |
| *(categoría)* `breadcrumbs[{label,url}]` | Migas de pan. | El caminito "Inicio > Construcción > Cementos". |
| *(categoría)* `banners[]` / `seo` | Banners del CMS para esa categoría + SEO. | La decoración y datos de Google de la categoría. |

### 5.11 Sesión (`BffSession`) — verificado en vivo

| Campo | Técnico | En simple |
|---|---|---|
| `sessionId` | El de `x-session-id`. | Tu número de visita. |
| `customerId` | Solo si el token es válido. | Quién eres (si iniciaste sesión). |
| `isAuthenticated` | boolean. | ¿Estás logueado? |
| `cartId` | Carro asociado, si existe. | Tu carro abierto. |

### 5.12 Despacho (`BffDeliveryOption`)

| Campo | Técnico | En simple |
|---|---|---|
| `type` | `pickup` \| `home_delivery`. | Retiro en tienda o despacho a domicilio. |
| `label` | Texto listo ("Retiro en tienda"). | Cómo se muestra la opción. |
| `available` | boolean. | ¿Se puede en tu comuna? |
| `costFormatted` / `etaLabel` | "$4.990" / "Llega el jueves". | Cuánto cuesta y cuándo llega. |
| `storeId` | Tienda de retiro (si aplica). | En qué sucursal retiras. |

### 5.13-bis Navegación (`BffNavigation`, `BffMenuItem`) — menú editorial del CMS + categorías del catálogo

Lo devuelve `GET /navigation`. El coordinador junta **dos fuentes**: el menú
`main` que administra marketing en el CMS y las categorías raíz del catálogo
(respaldo estructural).

| Campo | Técnico | En simple | Se conecta con |
|---|---|---|---|
| `menu` | `{id, code, name, items[]}` o `null` si no hay menú publicado. | El menú que armó marketing. Si es `null`, la tienda usa su menú local. | cms-service (`/public/menu/main`) vía coordinador. |
| `menu.code` | Código estable del menú ("main", "footer"). | Qué menú es (el principal, el del pie). | El Front CMS lo crea/edita en `/menus`. |
| `menu.items[].id` | Id del item. | Identificador interno. | — |
| `menu.items[].label` | Texto visible del item. | Lo que se lee en el menú ("Herramientas"). | Editable en el MenuBuilder del backoffice. |
| `menu.items[].url` | Link del item (p. ej. `/categoria/herramientas`). | A dónde te lleva el clic. **La tienda extrae el slug de aquí** para colgar el subárbol en la categoría correcta. | Rutas del front (`/categoria/:slug`). |
| `menu.items[].position` | Orden dentro del nivel. | Cuál va primero. | Orden visual del mega-menú. |
| `menu.items[].isVisible` | boolean. | Si está oculto, no se pinta (permite preparar sin publicar al menú). | Filtrado en `useBffNavigation`. |
| `menu.items[].children[]` | Items anidados (recursivo, 3 niveles en la práctica). | Las subcategorías y sub-subcategorías del flyout. | Árbol del mega-menú del Header y de la página Categorías. |
| `categories[]` | `{id, name, reference}` — categorías raíz del catálogo. | La lista "estructural" de categorías (independiente del menú editorial). | catalog-service vía coordinador. |

> **Cómo lo consume la tienda** (`useBffNavigation`): convierte `menu.items` al
> árbol `{slugCategoría → subcategorías}`. Los *tiles* de categoría (íconos,
> descripciones) siguen siendo diseño local; **lo editorial — qué links cuelgan
> de cada categoría — lo controla marketing**. Sin menú publicado, el árbol
> local de la maqueta queda intacto.

### 5.13-ter Auth y contexto comercial (fachada) — campos de entrada y salida

**`POST /auth/login`** (entrada → id-service):

| Campo | Técnico | En simple | Se conecta con |
|---|---|---|---|
| `correo` | email (también acepta RUT en id-service). | Tu usuario. | Tabla de usuarios de id-service. |
| `password` | string (bcrypt en el backend). | Tu contraseña. | id-service la verifica; el BFF nunca la guarda. |
| `plataformaId` | int — plataforma registrada en id-service (canal web). | "Desde qué sistema entras". | Control de acceso por plataforma de id-service. |
| `forzarSesion` | boolean opcional. | "Cierra mi otra sesión abierta y entra igual" (respuesta al 409). | Caso `SESSION_ALREADY_ACTIVE`. |

**Salida de login/refresh**: `token` (el JWT firmado — la credencial), más
`usuarioId`, `nombre`, `correo` para saludar sin otra llamada.

**`GET /context`** (salida — la "ficha comercial" de la sesión):

| Campo | Técnico | En simple | Se conecta con |
|---|---|---|---|
| `session.sessionId` / `.isAuthenticated` | Sesión anónima + estado de login. | Tu número de visita y si iniciaste sesión. | `x-session-id`, JWT. |
| `customer.customerId/customerType/roles/priceListId/companyId` | Claims del JWT (no editables por el cliente). | Quién eres, si eres persona o empresa, tu lista de precios. | id-service (emisor del token). |
| `commercial.salesChannel` | 'web' \| 'b2b'. | En qué canal estás comprando. | Header `x-sales-channel`; caja y promociones. |
| `commercial.storeId` | Tienda de contexto. | Tu sucursal de referencia. | `x-store-id`; stock por tienda, retiro. |
| `commercial.location` | `{commune, region}` o null. | Tu comuna de despacho. | Headers `x-commune`/`x-region`; despacho. |
| `commercial.company` | Empresa resuelta en comerce-service (o null si no aplica / no responde). | La ficha de tu empresa (razón social, condiciones). | comerce-service (`/company/:idOrRef`), failOpen. |

> Regla de oro documentada: **id-service define quién eres** (emite el JWT);
> **comerce-service define dónde operas** (empresa, canal, tienda). El
> coordinador solo compone; ninguno reemplaza al otro.

### 5.13 Cuenta y pedidos (`BffAccountProfile`, `BffAddress`, `BffOrderSummary/Detail`)

> ⚠️ Estos modelos son **pragmáticos**: requieren sesión (token) y sus payloads
> reales aún no se pudieron observar en vivo (login pospuesto). Refinar cuando
> haya identidad (gap #1/#5 en `CONTRATOS-BFF.md`).

| Campo | Técnico | En simple |
|---|---|---|
| `profile.customerId/name/email/type/company/rut/roles/priceListId/hasCredit` | Perfil desde customer-service. | Tu ficha de cliente (y de tu empresa si eres B2B). |
| `address.id/label/addressLine1/commune/region/isDefault` | Direcciones guardadas. | Tu libreta de direcciones. |
| `order.orderId/createdAt/statusLabel/totalFormatted/itemCount` | Resumen desde oms-service-v2, con **estado entendible** (no estados internos). | Cada compra: número, fecha, estado ("Despachado"), total. |
| `orderDetail.items[]/fulfillment{method,statusLabel,trackingUrl}/documents[]/totals` | Detalle + seguimiento + documentos (boleta/factura). | Qué compraste, dónde va el paquete, y tus documentos. |

---

## 6. APIs del coordinador (web-bff-service), una por una <a name="6-apis-del-coordinador"></a>

**En simple:** una API es una "ventanilla": la tienda se acerca, pide algo con
su ficha (headers), y recibe un paquete (modelo de la sección 5) dentro del
sobre (sección 4). Base real: `https://<dominio>/api/web-bff`.

**Si una ventanilla falla**, la tienda **no se rompe**: muestra datos de
ejemplo o un mensaje amable. Eso ya está construido.

### 6.1 Salud

| API | Técnico | En simple |
|---|---|---|
| `GET /health` · `GET /health/ready` | Liveness/readiness para monitoreo. | "¿Estás vivo, coordinador?" — la usa el equipo técnico y los monitores automáticos. |

### 6.2 Portada

| API | Técnico | En simple |
|---|---|---|
| `GET /home` | Devuelve `BffHome` (5.7). Orquesta: cms (página home + banners) → catalog/pricing/inventory/promotion (enriquecer SKUs) → seo. Cache ~5 min. | "Dame la portada lista": lo que armó marketing, con precios y stock de verdad. La llama la página de inicio. |

### 6.3 Navegación

| API | Técnico | En simple |
|---|---|---|
| `GET /navigation` | `BffNavigation` (5.13-bis): menú `main` publicado en el CMS + categorías raíz del catálogo. Cache ~10 min. | "Dame el menú principal": lo que marketing armó en el backoffice, listo para el mega-menú. Lo consumen el encabezado y la página de categorías (`useBffNavigation`), con el menú local como respaldo. |

### 6.4 Categoría

| API | Técnico | En simple |
|---|---|---|
| `GET /categories/:slug?page=&pageSize=&sort=&filtros…` | `BffCategoryPage` (5.10). Orquesta catalog (categoría/breadcrumb) + search (productos/facetas) + cms (banners de categoría) + seo. | "Muéstrame la góndola de Herramientas": productos con precio/stock, filtros y su decoración. La llama la página de categoría. |

### 6.5 Búsqueda

| API | Técnico | En simple |
|---|---|---|
| `GET /search?q=&page=&sort=…` | `BffSearchPage` (5.10) vía search-service + enriquecimiento. | "El cliente escribió 'taladro'": resultados, filtros y sugerencias. |
| `GET /search/autocomplete?q=` | Sugerencias mientras escribe. | Las ideas que aparecen bajo el buscador tecla a tecla. |
| `GET /search/suggestions` | Búsquedas populares/recomendadas. | "Qué busca la gente". |

### 6.6 Producto

| API | Técnico | En simple |
|---|---|---|
| `GET /products/:slug` | `BffProductDetail` (5.4). Catalog + pricing + inventory + promotion + seo. | "Dame la ficha completa del taladro X". La llama la página de producto. |
| `GET /products/cards?skus=a,b,c` | `BffProductCard[]` por lote. | "Dame las tarjetitas de estos 5 productos" (carruseles, relacionados). |
| `GET /products/:sku/availability` | Solo disponibilidad fresca (5.2). | "¿Sigue habiendo stock?" — revalidación rápida sin recargar la ficha. |

### 6.7 Carro — **cada operación devuelve el carro recalculado completo (5.5)**

| API | Técnico | En simple |
|---|---|---|
| `POST /cart` | Crea carro; devuelve `cartId`. | "Ábreme un carro nuevo". Primera vez que agregas algo. |
| `GET /cart/:cartId` | El carro actual recalculado. | "Muéstrame mi carro" (precios re-validados hoy, no los de ayer). |
| `POST /cart/:cartId/items` `{sku, quantity}` | Agrega línea. | "Échale 2 sacos de cemento". |
| `PATCH /cart/:cartId/items/:itemId` `{quantity}` | Cambia cantidad. | "Mejor que sean 5". |
| `DELETE /cart/:cartId/items/:itemId` | Quita línea. | "Saca el cemento". |
| `POST /cart/:cartId/apply-coupon` `{code}` | Aplica cupón; el descuento lo calcula el backend. | "Tengo el cupón INVIERNO10". Si no vale, llega un error amable. |
| `DELETE /cart/:cartId/coupon/:code` | Quita cupón. | "Ya no quiero usar ese cupón". |
| `POST /cart/:cartId/validate` | Re-valida stock/precios de todo el carro. | "Antes de pagar, revisa que todo siga disponible y al mismo precio". |

### 6.8 Checkout (el proceso de pago)

| API | Técnico | En simple |
|---|---|---|
| `GET /checkout/:cartId` | Estado del checkout (carro validado + opciones). | "¿Cómo va mi proceso de compra?" |
| `POST /checkout/:cartId/validate` | Revalida el carro para el checkout. | El doble-chequeo antes de pagar. |
| `POST /checkout/:cartId/delivery-options` `{commune?}` | Opciones de entrega (5.12). Usa la comuna del cuerpo **o la del header `x-commune`**. | "¿Cómo me lo pueden entregar en Puerto Montt?" |
| `POST /checkout/:cartId/payment-methods` | Medios de pago. **Hoy devuelve lista vacía** (no hay payment-service storefront). | "¿Cómo puedo pagar?" — pendiente de conectar pagos. |
| `POST /checkout/:cartId/confirm` `{fulfillmentMethod, commune…}` | Fija la entrega y hace el **handoff** (5.6): snapshot + lock. **No cobra ni crea la orden.** | "Confirmo": el carro se congela con número de referencia. El cobro y la orden vienen después (downstream). |

### 6.9 Cuenta (requiere token; hoy responde 401/mock hasta que exista login)

| API | Técnico | En simple |
|---|---|---|
| `GET /account/profile` · `PATCH /account/profile` | Perfil (customer-service). El `customerId` sale **del token**, jamás de la URL. | "Mis datos" / "cámbiame el teléfono". |
| `GET/POST/PATCH/DELETE /account/addresses[/:id]` | Libreta de direcciones. | "Mis direcciones de despacho". |
| `GET /account/orders` · `/orders/:id` · `/:id/tracking` · `/:id/documents` | Pedidos del cliente (oms + delivery + documentos). Verifica propiedad: si el pedido no es tuyo → 404. | "Mis compras, dónde viene el camión, y mi factura". |

### 6.10 Pedidos (alias raíz)

| API | Técnico | En simple |
|---|---|---|
| `GET /orders` · `GET /orders/:orderId` · `…/tracking` · `…/documents` | Igual que 6.9 (mismo guard de propiedad). | El historial de compras. |
| `POST /orders/:orderId/cancel-request` | Solicitud de cancelación (no cancela directo: crea la solicitud). | "Quiero cancelar este pedido" → queda pedido, lo procesa operaciones. |

### 6.11 Despacho

| API | Técnico | En simple |
|---|---|---|
| `POST /delivery/options` `{commune?…}` | Opciones (5.12) vía delivery-service. Fallback a `x-commune`. | "¿Qué opciones de entrega hay para mi comuna?" (se usa en la ficha y el carro). |
| `GET /delivery/pickup-locations` | Puntos de retiro. **Hoy vacío** (catálogo de puntos no migrado). | "¿Dónde puedo retirar?" — pendiente. |
| `GET /delivery/zones` | Zonas/comunas con cobertura. | "¿Llegan a mi comuna?" |
| `POST /delivery/quote` | Cotiza costo/plazo de un envío. | "¿Cuánto me cuesta y cuándo llega?" |

### 6.12 B2B (requiere token de empresa; guard `b2b-customer`)

| API | Técnico | En simple |
|---|---|---|
| `GET /b2b/dashboard` | Agrega crédito (customer-credit) + últimos pedidos (oms). | El panel de la empresa: cupo disponible y compras recientes. |
| `GET /b2b/credit-status` | Estado de línea de crédito. | "¿Cuánto cupo me queda?" |
| `POST /b2b/quick-order` | Compra rápida por lista de SKUs. | "Cárgame al carro esta lista de 40 códigos de una". |

### 6.13 Contenido publicado (CMS vía coordinador)

| API | Técnico | En simple |
|---|---|---|
| `GET /content/banners?placement=` | Banners publicados (5.8). | "Dame los banners de tal ubicación". |
| `GET /content/pages/:slug` | Página informativa publicada. | "Términos y condiciones", "Quiénes somos". |
| `GET /content/landings/:slug` | Landing de campaña publicada. | La página especial de una campaña ("/dia-de-la-madre"). |

### 6.14 SEO

| API | Técnico | En simple |
|---|---|---|
| `GET /seo/meta?path=` | `BffSeo` (5.9) por ruta. | Los datos de Google para cualquier página. ⚠️ *Hoy el dato llega pero la tienda (SPA) aún no lo pinta en el `<head>`; se cierra con la migración a Next.js (`PLAN-MIGRACION-NEXTJS.md`).* |
| `GET /seo/structured-data/product/:slug` | JSON-LD del producto. | La ficha "etiquetada" para que Google muestre precio y estrellas. |
| `GET /sitemap.xml` · `GET /robots.txt` | **En la raíz del dominio** (fuera del prefijo). | El mapa del sitio y las reglas para el robot de Google. |

### 6.15 Sesión y autenticación

| API | Técnico | En simple |
|---|---|---|
| `GET /auth/session` | `BffSession` (5.11). Con token válido incluye `customerId`. | "¿Quién soy para ti?" — con esto la tienda sabe si mostrarte "Hola, Camila" o "Inicia sesión". |
| `POST /auth/login` | Fachada → id-service (`{correo, password, plataformaId, forzarSesion?}` → `{token…}`). Errores: `INVALID_CREDENTIALS` 401, `SESSION_ALREADY_ACTIVE` 409. IAM caído → 502 honesto. | "Quiero iniciar sesión": el coordinador le pide la credencial al servicio de identidad y te la entrega firmada. *(La pantalla de login de la tienda sigue en demo por decisión de producto.)* |
| `POST /auth/refresh` | `{tokenAnterior}` → `{token}` nuevo vía id-service. | "Renuévame la credencial antes de que venza". |
| `POST /auth/logout` | `{usuarioId, plataformaId}`; best-effort (nunca falla hacia el front). | "Cierra mi sesión" — y aunque el sistema interno no responda, tu navegador la olvida igual. |
| `GET /auth/me` | Claims del token + permisos (id-service, failOpen) + empresa (comerce-service, failOpen). | "Muéstrame todo lo que sabes de mí": quién soy, qué puedo hacer y mi empresa. |
| `GET /context` | Contexto comercial de la sesión: canal, cliente, empresa, tienda, comuna (`commercial-context`). | La "ficha completa de la visita": ¿persona o empresa?, ¿qué canal?, ¿qué comuna? — todo lo que el resto de la tienda usa para mostrarte lo correcto. |
| `GET /account/companies` · `GET /account/permissions` | Empresa del comprador (comerce) y permisos (id-service), ambos failOpen. | "Mi empresa" y "qué me dejan hacer" para el portal B2B. |

### 6.16 Observabilidad

| API | Técnico | En simple |
|---|---|---|
| `GET /metrics` | Métricas Prometheus. | El "tablero de instrumentos" que leen los monitores del equipo técnico. |

---

## 7. APIs del archivo de contenido (cms-service) <a name="7-apis-de-cms-service"></a>

Base: `http://<host>:3040/api/cms`. **Dos mundos separados:**

- **Admin** (lo usa el Panel de contenido): crear, editar, aprobar, publicar.
- **`/public/*`** (lo usa SOLO el coordinador): leer lo ya publicado.

**En simple:** el panel escribe en el archivo; el coordinador solo lee lo que
está "al aire". El cliente nunca toca cms-service directo.

Formato: listados `{items, total, page, pageSize}`; errores
`{statusCode, error, timestamp}` (sin sobre `success`). Identidad admin por
headers de gateway (`x-user-id`, `x-user-permissions`; en dev asume permiso
total).

### 7.1 Admin — por dominio

| Dominio | APIs | En simple |
|---|---|---|
| **Páginas** (home, landings, informativas) | `GET/POST /pages`, `GET /pages/by-slug`, `GET/PATCH /pages/:id`, `GET /pages/:id/versions` | Crear y editar las páginas del sitio; ver su historial de versiones. |
| **Flujo editorial** (páginas y contenidos) | `POST …/:id/submit-review` · `/approve` · `/reject` · `/request-changes` · `/publish` · `/unpublish` · `/archive` · `/rollback/:versionId` | El ciclo de vida: borrador → revisión → aprobado → **publicado** (recién ahí lo ve el cliente) → despublicar o volver a una versión anterior. |
| **Contenidos/bloques** | `GET/POST /contents`, `GET/PATCH /contents/:id`, versiones + flujo editorial | Los bloques reutilizables (artículos, guías, textos). |
| **Componentes** (banners, carruseles, grillas) | `GET/POST /components`, `GET/PATCH /components/:id`, `POST /components/:id/duplicate`, `GET /components/:id/preview-data` | Las piezas visuales: un banner hero, un carrusel de productos. "Duplicar" para no partir de cero. |
| **Menús** | `GET/POST /menus`, `GET /menus/by-code/:code`, `GET/PATCH /menus/:id`, `POST /menus/:id/items`, `PATCH/DELETE /menus/items/:itemId` | El menú del encabezado y el pie de página: agregar/ordenar/quitar entradas. |
| **Media** | `POST /media/upload-url` → `POST /media/confirm-upload`, `GET /media`, `GET/PATCH/DELETE /media/:id` | La biblioteca de imágenes: se pide un "permiso de subida", se sube la imagen, se confirma. |
| **Campañas** | `GET/POST /campaigns`, `GET/PATCH /campaigns/:id`, `POST /campaigns/:id/contents`, `DELETE /campaigns/:id/contents/:contentId` | Agrupar contenido bajo una campaña ("Navidad 2026") con sus fechas. |
| **SEO** | `GET /seo`, `GET/PUT /seo/:entityType/:entityId`, `POST /seo/validate` | Editar título/descripción para Google de categorías, marcas y páginas; validar antes de guardar. |
| **Publicación programada** | `POST /publishing/schedule`, `GET /publishing/jobs`, `GET /publishing/jobs/:id` | "Publica este banner el lunes a las 00:00" y ver la cola de programaciones. |
| **Segmentación** | `GET/POST /targeting-rules…` | Reglas de "a quién se le muestra" (B2C/B2B, dispositivo…). |
| **Auditoría** | `GET /audit`, `GET /audit/history/:entityType/:entityId` | El libro de novedades: quién cambió qué y cuándo. |

### 7.2 Público — solo para el coordinador

| API | En simple |
|---|---|
| `GET /public/home` | La página home **publicada** (la que el coordinador convierte en `BffHome`). |
| `GET /public/pages/by-slug` | Una página informativa publicada. |
| `GET /public/banners?placement=` | Banners al aire de una ubicación. |
| `GET /public/menu/:code` | El menú publicado. |
| `GET /public/footer` | El pie de página publicado. |
| `GET /public/seo/:entityType/:entityId` | El SEO editado de una entidad. |

---

## Cómo leer todo esto junto (el viaje completo de una compra)

1. Cliente abre la portada → tienda llama `GET /home` con su ficha (headers §1)
   → recibe `BffHome` (5.7) con banners del CMS y productos con `BffPrice` (5.1)
   y `BffAvailability` (5.2).
2. Busca "taladro" → `GET /search` → `BffSearchPage` (5.10).
3. Abre la ficha → `GET /products/:slug` → `BffProductDetail` (5.4) + `BffSeo` (5.9).
4. Agrega al carro → `POST /cart` + `POST /cart/:id/items` → cada vez vuelve el
   `BffCart` (5.5) **recalculado**: esos totales son los que se muestran.
5. Elige entrega → `POST /checkout/:id/delivery-options` (usa tu `x-commune`) →
   `BffDeliveryOption[]` (5.12).
6. Confirma → `POST /checkout/:id/confirm` → `BffCheckoutHandoff` (5.6): carro
   congelado con referencia `MIM-XXXXXXXX`. El cobro y la orden siguen su curso
   en los servicios internos.
7. Si cualquier ventanilla falla en el camino, el sobre (§4) trae un `code`, la
   tienda muestra su mensaje amable, y la experiencia degrada sin romperse.
