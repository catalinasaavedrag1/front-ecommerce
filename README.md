# Mimbral — Frontend B2C / B2B

Tienda online estilo **Sodimac / Lowe's / Wayfair** para **Mimbral**, retail de
construcción y mejoramiento del hogar. Una sola aplicación que atiende dos tipos
de cliente:

- **B2C (Personas):** precios a público con IVA incluido, ofertas, despacho a
  domicilio o retiro en tienda.
- **B2B (Empresas):** precios netos, **descuentos por volumen**, **línea de
  crédito**, **cotizaciones** en línea, stock por bodega y despacho a faena.

El modo se cambia desde el conmutador **Personas / Empresas** del header y queda
guardado en el navegador.

## Stack

- **React 18 + TypeScript**
- **Vite** (dev server y build)
- **React Router 6** (ruteo SPA)
- CSS propio con design system (sin dependencias de UI)
- Estado con Context API (`AppContext` para modo/sesión, `CartContext` para el carro), persistido en `localStorage`

## Scripts

```bash
npm install      # instalar dependencias
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # build de producción a /dist
npm run preview  # previsualizar el build
npm run typecheck# chequeo de tipos
```

## Estructura

```
src/
  api/             # cliente único del BFF (web-bff.client.ts) + apis por dominio
                   # (home, category, search, product, cart, checkout, account,
                   #  orders, delivery, auth) + adapters/registry/types
  lib/             # env, session, auth, context (B2C/B2B), errors, cookies
  components/      # Header, Footer, ProductCard, PriceTag, ModeSwitch, ...
  context/         # AppContext (modo B2C/B2B + sesión), CartContext
  data/products.ts # catálogo demo + categorías + bodegas (fallback de maqueta)
  pages/           # Home, Categoría, Producto, Carro, Checkout,
                   # Portal Empresas, Cotización, Login, Pedidos, Búsqueda
  utils/           # pricing (fallback de precios), cart (totales), format (CLP, IVA, RUT)
  types.ts         # tipos del dominio
```

## Lógica de precios

> Con el BFF conectado, **el precio/stock/promos los resuelve el BFF** y esta
> lógica local queda como *fallback* de maqueta o caída del BFF (ver
> `docs/CONTRATOS-BFF.md` §7). El front no es fuente oficial de precios.

Fallback local en `src/utils/pricing.ts`:

- **B2C:** usa `retailPrice` (IVA incluido) y `retailOffer` si existe.
- **B2B:** parte del **neto base** (`b2bNet`), aplica el tramo de **volumen**
  correspondiente a la cantidad y el **descuento corporativo** del cliente; el
  total se muestra en neto y con IVA (19%).

## Cuentas de demostración

En `/ingresar` hay accesos rápidos:

- 👤 **Persona** (Camila) → modo B2C.
- 🏢 **Empresa** (Constructora Andes) → modo B2B con lista mayorista, descuento
  corporativo y línea de crédito.

> Datos, precios y catálogo son de demostración.

## Conexión con el web-bff-service

> 📘 Guía completa con diagramas: **[`docs/INTEGRACION-BFF.md`](docs/INTEGRACION-BFF.md)**

El front puede funcionar en dos modos:

| Modo | Cómo | Qué pasa |
| --- | --- | --- |
| **Maqueta** (default) | `VITE_BFF_URL` vacío/ausente | Todo funciona con los datos de ejemplo de `src/data/` (comportamiento original) |
| **Conectado** | `VITE_BFF_URL=/api/web-bff` (+ proxy de Vite) o URL directa | Home, categoría, búsqueda y ficha cargan del BFF; el carrito se espeja a cart-service y el checkout hace el handoff real |

```bash
cp .env.example .env
# editar: VITE_BFF_URL=/api/web-bff   (el proxy de vite.config.ts apunta a localhost:3080)
npm run dev
```

La degradación es automática: si el BFF no responde, cada pantalla vuelve a los
datos locales (no se rompe la navegación). Piezas de la integración:

- `src/api/web-bff.client.ts` — **cliente HTTP único** (`webBffRequest`): headers de contexto B2C/B2B, timeout, sobre `{success,data}`, `BffError` tipado
- `src/lib/` — fundaciones: `env`, `session`, `auth`, `context` (canal B2C/B2B), `errors` (`code → userMessage`)
- `src/api/*.api.ts` — apis por dominio (home, category, search, product, cart, checkout, account, orders, delivery, auth)
- `src/api/adapters.ts` — vistas del BFF → tipo `Product` del front (los componentes no cambian)
- `src/api/registry.ts` — registro de productos vivos (carrito/vistos recientes resuelven SKUs reales)
- `src/hooks/useBffCatalog.ts` — hooks con fallback por pantalla

Documentación de la integración:

- **[`docs/INTEGRACION-BFF.md`](docs/INTEGRACION-BFF.md)** — guía de uso con diagramas.
- **[`docs/CONTRATOS-BFF.md`](docs/CONTRATOS-BFF.md)** — contrato técnico: mapeo endpoint↔BFF, headers, gaps y decisiones de arquitectura.
- Documentación completa del BFF: `Microservicios/web-bff-service/docs/`.
