# Diseño de referencia

Material de diseño de Mimbral, usado como referencia para la implementación
en React (`src/`). **No es código de la app**: son maquetas estáticas y
capturas. Antes vivía dentro de `ecommerce.zip` en la raíz del repo; se
descomprimió aquí para que sea revisable y diffeable.

## Estructura

- `mockups/*.dc.html` — maquetas exportadas desde la herramienta de diseño
  (formato design-canvas). Se renderizan con `mockups/support.js` (runtime
  generado, no editar). Requieren `window.React`/`window.ReactDOM`.
- `mockups/renders/*.png` — render de cada maqueta a imagen, para revisar el
  diseño sin necesidad de la herramienta.
- `screenshots/*.png`, `uploads/*.png` — capturas e imágenes de apoyo.

## Estado de implementación

El rediseño que muestran estas maquetas ya está implementado en la app
(`src/pages/*`, `src/components/*`). Las maquetas quedan como referencia
histórica y guía visual. Cualquier ajuste fino pendiente se trabaja sobre los
componentes React, no sobre estos archivos.
