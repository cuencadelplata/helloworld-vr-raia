# Helloworld VR - RAIA

## Ejecutar el entorno (servidor estático)

Es un proyecto estático (A‑Frame). Necesita servirse por HTTP para que funcionen correctamente recursos y `service-worker`.

- Node.js (recomendado):

  - `npx http-server -c-1 .`
  - ó `npx serve -l 5173 .`

- Python 3:
  - `python3 -m http.server 8080`

Luego abrí el navegador en:

- `http://localhost:8080` (si usaste Python)
- `http://localhost:5173` (si usaste `serve`)
- o la URL que indique `http-server`

Nota: Si abrís `index.html` directamente como archivo (`file://`), el `service-worker` y algunos recursos pueden no cargar.

## ¿Qué incluye?

- A‑Frame 1.4.0 para la escena 3D.
- Un menú principal con navegación a escenas.
- Escena "Análisis Matemático" con visualización 3D de funciones de dos variables.
- PWA básico (manifest y `service-worker.js`).

## ¿Cómo funciona la visualización de funciones?

En `index.html` se define un menú de funciones y la lógica de render:

1. Al hacer click en un botón de función (por ejemplo `btn-func1`), se llama a `showFunction("funcX")`.
2. `showFunction` oculta el menú y llama a `generateMathSurface(funcKey)`.
3. `mathFunctions` contiene la fórmula `formula(x, z)` y metadatos (nombre, descripción, dominio) para cada función.
4. `generateMathSurface` recorre una grilla en \(x, z\), calcula \(y = f(x, z)\) y construye la superficie con triángulos (`a-triangle`). El color se calcula según la altura promedio del triángulo.
5. El HUD (`#mathHUD`) se actualiza con nombre, descripción y dominio de la función seleccionada.

## Uso básico

- Entrá a la app en la URL local del servidor.
- En el menú principal, seleccioná "Análisis Matemático".
- Elegí una función: se renderiza la superficie 3D y se muestran ejes y HUD.
- Usá el botón "← Menu Funciones" para volver al listado o "← Menu Principal" para regresar al inicio.

## Agregar una nueva función

1. En `index.html`, dentro de `mathFunctions`, añadí una entrada con `name`, `description`, `domain` y `formula(x, z)`.
2. Creá un nuevo botón en el menú (duplicá uno existente) y conectalo con `showFunction("tuClave")`.

## Requisitos

- Navegador moderno con soporte WebGL.
- Conexión servida por HTTP/HTTPS (no abrir directo como archivo) para PWA.

## Estructura

- `index.html`: escena A‑Frame y lógica de UI/render.
- `service-worker.js`: cacheo básico para PWA.
- `manifest.json`: metadatos de la app.
- `models-prueba/`: modelos 3D (GLTF/GLB).
