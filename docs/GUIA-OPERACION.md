# Guía de operación — para entender y manejar la plataforma sin saber programar

Esta guía explica **qué es cada pieza, cómo se conectan y qué hacer cuando algo
no se ve bien**, en lenguaje simple. No necesitas saber programar para leerla.

---

## 1. Las piezas, explicadas con una tienda real

Imagina la operación como una tienda física:

| Pieza (nombre técnico) | Qué es en la analogía | Qué hace |
|---|---|---|
| **Tienda web** (`front-ecommerce`) | La **vitrina y las góndolas** | Es la página que ven los clientes: mimbral.cl. Muestra productos, carro, checkout. **No decide precios ni stock: solo muestra.** |
| **Panel de contenido** (`cms-front`) | La **oficina de marketing** | Herramienta interna donde el equipo crea banners, arma la portada, programa campañas. Los clientes nunca la ven. |
| **El coordinador** (`web-bff-service`) | El **jefe de tienda** | Único punto al que la tienda web le pide las cosas. Él consulta a bodega, caja y marketing, junta todo y entrega la página lista. |
| **Servicios internos** (microservicios) | **Bodega, caja, despacho, archivo** | Cada uno sabe una sola cosa: `inventory` = stock, `pricing` = precios, `catalog` = fichas de producto, `cart` = carros, `delivery` = despacho, `cms-service` = contenido publicado, etc. |

**La regla de oro:** la tienda web **solo habla con el coordinador**. Nunca va
directo a bodega o a caja. Y el panel de marketing habla **solo con el archivo
de contenido** (`cms-service`). Eso mantiene el orden.

```
CLIENTE                          EQUIPO INTERNO (marketing)
   │                                   │
   ▼                                   ▼
Tienda web                      Panel de contenido
(front-ecommerce)               (cms-front)
   │                                   │
   ▼                                   ▼
El coordinador ────lee lo publicado──► Archivo de contenido
(web-bff-service)                      (cms-service)
   │
   ├──► Bodega (inventory)   = ¿hay stock?
   ├──► Caja (pricing)       = ¿cuánto vale?
   ├──► Catálogo (catalog)   = ficha del producto
   ├──► Carros (cart)        = el carro del cliente
   ├──► Despacho (delivery)  = ¿llega a mi comuna?
   └──► … (búsqueda, promociones, pedidos, SEO)
```

---

## 2. Cómo llega un banner de marketing a la portada

Este es el flujo completo, de principio a fin:

1. Alguien de marketing entra al **Panel de contenido** y crea un banner
   ("Ofertas de invierno"), con su imagen y su link.
2. Lo **publica** (el panel lo guarda en el archivo de contenido, `cms-service`).
3. Un cliente abre **mimbral.cl**. La tienda le pide la portada al
   **coordinador**.
4. El coordinador va al archivo de contenido, toma el banner publicado, le
   agrega los productos con **precio y stock reales** (preguntando a caja y
   bodega), y entrega la portada armada.
5. El cliente ve el banner y los productos, tal como marketing lo diseñó.

**Nadie toca código en este flujo.** Marketing publica; la tienda se actualiza.

---

## 3. Los dos modos de la tienda: "maqueta" y "conectado"

La tienda web tiene un interruptor (un ajuste llamado `VITE_BFF_URL`):

| Modo | Cuándo | Qué se ve |
|---|---|---|
| **Maqueta** (interruptor apagado) | Demos, diseño, o si el coordinador está caído | La tienda funciona completa con **datos de ejemplo** (productos y precios ficticios). Todo se puede navegar. |
| **Conectado** (interruptor encendido) | Operación real | Portada, categorías, búsqueda, fichas, carro y checkout usan **datos reales** que entrega el coordinador. |

**Lo más importante:** si el coordinador o algún servicio interno **falla**, la
tienda **no se cae ni queda en blanco**: cada pantalla vuelve sola a los datos
de ejemplo. A esto le llamamos *degradación elegante*. El cliente siempre ve
una tienda funcionando (aunque con datos de muestra), nunca un error técnico.

El panel de contenido tiene el mismo interruptor
(`NEXT_PUBLIC_CMS_SERVICE_URL`): apagado usa ejemplos, encendido usa el archivo
de contenido real.

---

## 4. Los "interruptores" (configuración por entorno)

Estos ajustes se escriben en un archivo llamado `.env` (uno por aplicación).
Piensa en ellos como el panel de interruptores del local. Los importantes:

**Tienda web (`front-ecommerce/.env`):**
```
VITE_BFF_URL=/api/web-bff        ← encendido (a través del "túnel" local)
VITE_BFF_URL=                    ← apagado (modo maqueta)
```
En producción sería la dirección real, por ejemplo:
`VITE_BFF_URL=https://api.mimbral.cl/api/web-bff`

**Panel de contenido (`cms-front/.env`):**
```
NEXT_PUBLIC_CMS_SERVICE_URL=http://localhost:3040/api/cms   ← encendido
NEXT_PUBLIC_CMS_SERVICE_URL=                                ← apagado
```

**El coordinador (`web-bff-service/.env`):** tiene la lista de direcciones de
todos los servicios internos (bodega, caja, etc.). Ya viene un archivo de
ejemplo (`.env.example`) con todo listado; se copia y se ajustan direcciones.

> ⚠️ Regla: después de cambiar un `.env` hay que **reiniciar** esa aplicación.
> Los ajustes se leen solo al encender.

---

## 5. Cómo encender todo en un computador (receta paso a paso)

Necesitas tener instalado **Node.js** (el "motor" que ejecuta estas
aplicaciones; se descarga de nodejs.org, botón verde, siguiente-siguiente).
Cada bloque se pega en una terminal separada (una ventana por aplicación).

**A. El coordinador (web-bff-service):**
```
cd Microservicios/web-bff-service
cp .env.example .env
npm install
npm run start:dev
```
Queda escuchando en el puerto 3080. Para comprobar que vive, abre en el
navegador: `http://localhost:3080/api/web-bff/health` → debe decir `"ok"`.

**B. La tienda web (front-ecommerce):**
```
cd front-ecommerce
cp .env.example .env        ← y dentro dejar: VITE_BFF_URL=/api/web-bff
npm install
npm run dev
```
Se abre en `http://localhost:5173`.

**C. El panel de contenido (cms-front):**
```
cd cms-front
cp .env.example .env        ← y ajustar NEXT_PUBLIC_CMS_SERVICE_URL si cms-service está arriba
npm install
npm run dev
```
Se abre en `http://localhost:4000`.

**Importante sobre los datos reales:** el coordinador arriba **sin** los
servicios internos (bodega, caja, catálogo…) responde, pero sin datos — y la
tienda mostrará los de ejemplo. Para ver **datos reales de verdad** hay que
levantar además los servicios internos con sus bases de datos (eso es tarea del
equipo técnico/infraestructura; está en la lista de pendientes de abajo).

---

## 6. Checklist para salir a producción

Lo que falta no es código de la tienda: es **operación**. En orden:

- [ ] **Levantar los servicios internos con datos** (catalog, search, pricing,
  inventory, cart, cms-service, delivery) en el servidor. *Responsable: equipo
  backend/infraestructura.* Sin esto, la tienda conectada muestra ejemplos.
- [ ] **Apuntar las direcciones**: que `api.mimbral.cl` dirija al coordinador,
  y poner esa dirección en el `.env` de la tienda publicada. *Responsable:
  infraestructura.*
- [ ] **Autorizar el dominio**: en el `.env` del coordinador, agregar el
  dominio real de la tienda a `CORS_ORIGINS` (es la lista de "quién puede
  llamarme"). *Responsable: backend.*
- [ ] **Publicar contenido inicial** en el panel: portada, banners, menús.
  *Responsable: marketing (¡sin código!).*
- [ ] **Decidir el login de clientes** (hoy pospuesto a propósito): quién emite
  la credencial de cliente. Hasta entonces, "Mi cuenta" y "Mis pedidos" muestran
  datos de ejemplo, y los precios de empresa (B2B) usan la maqueta.
  *Responsable: decisión de negocio + backend.*

---

## 7. Si algo se ve mal — síntomas y qué hacer

| Lo que ves | Qué significa (casi siempre) | Qué hacer |
|---|---|---|
| La tienda muestra productos "de ejemplo" en vez de los reales | El coordinador o un servicio interno está apagado o inalcanzable | No es urgente para el cliente (la tienda sigue en pie). Avisar al equipo técnico: "revisar web-bff-service y sus servicios" |
| Publicé un banner y no aparece | El contenido quedó en borrador, o el coordinador guarda una copia por unos minutos (caché) | Verificar que el banner esté **publicado** (no borrador). Esperar ~5 minutos. Si sigue sin salir, avisar a técnico |
| El panel de contenido muestra datos raros/de ejemplo | El panel está en modo ejemplo (interruptor apagado) o cms-service está caído | Avisar a técnico: "revisar NEXT_PUBLIC_CMS_SERVICE_URL y cms-service" |
| Un precio se ve distinto entre la portada y el carro | El carro valida contra la caja real; la portada pudo quedar con una copia breve | Es autocorrectivo en minutos. Si persiste, avisar: "revisar pricing-service" |
| "Mis pedidos" muestra pedidos que no son míos | Son los datos de ejemplo (aún no hay login real de clientes) | Es esperado por ahora (ver checklist, punto login) |
| Cambié un ajuste y no pasó nada | Los `.env` se leen al encender | Pedir que **reinicien** esa aplicación |

**Regla para reportar:** di **qué pantalla**, **qué esperabas ver** y **qué
viste**. Con eso el equipo técnico encuentra el problema rápido (cada error
lleva un código de rastreo interno llamado *correlationId* que ellos saben
buscar en los registros).

---

## 8. Glosario mínimo

- **Front / frontend**: la parte visible, lo que se abre en el navegador.
- **BFF (el coordinador)**: "Backend For Frontend". Un servicio cuyo único
  trabajo es armarle las páginas listas a la tienda. Es la **única puerta** de
  la web pública.
- **Microservicio**: un programa pequeño que hace una sola cosa (stock,
  precios, carros…). Se combinan como piezas de Lego.
- **CMS**: sistema de gestión de contenido. Donde marketing edita sin código.
- **Publicar (en el CMS)**: pasar un contenido de borrador a visible. Solo lo
  publicado llega a la tienda.
- **`.env` / variable de entorno**: archivo de ajustes de cada aplicación
  (direcciones, interruptores). Se lee al encender.
- **Caché**: copia temporal para responder rápido. Explica por qué un cambio
  puede tardar unos minutos en verse.
- **Degradación elegante**: si algo falla, la tienda muestra datos de ejemplo
  en vez de romperse. El cliente nunca ve un error técnico.
- **Modo maqueta**: la tienda funcionando 100% con datos de ejemplo, sin
  ningún servidor detrás. Ideal para demos y diseño.

---

## 9. Dónde está la documentación técnica (para el equipo dev)

- **Diccionario campo por campo y API por API** (técnico + en simple):
  `front-ecommerce/docs/DICCIONARIO-DATOS-Y-APIS.md`
- Contrato tienda ↔ coordinador: `front-ecommerce/docs/CONTRATOS-BFF.md`
- Guía de integración con diagramas: `front-ecommerce/docs/INTEGRACION-BFF.md`
- Contrato panel ↔ archivo de contenido: `cms-front/docs/CONTRATOS-CMS.md`
- Docs del coordinador (arquitectura, endpoints, operación):
  `Microservicios/web-bff-service/docs/`
