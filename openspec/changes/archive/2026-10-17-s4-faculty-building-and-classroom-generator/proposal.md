# Proposal

> Cambio reconstruido (reverse engineering) desde git. Etapa 4 de 9.
> Período: 2026-01-22 (documento de arquitectura conceptual `f2305a5`), 2026-05-28 (`c674b3f`, `c6e6f10` "Refactoriza aulas dinamicas") y 2026-05-31 (texturas, carteles, tarjetas: `565df3c`, `a6ecc85`, `454726b`).

## Why

Con un solo aula embebida en HTML, agregar contenido era costoso y repetitivo. Se necesitaba un edificio (pasillo + aulas) con un generador de aulas, interacción unificada con botones y desplazamiento con colisiones.

## What Changes

- Pasillo principal con entrada, luces y 6 puertas (aulas impares a la izquierda, pares a la derecha).
- Generador de aulas (`generar-aula`) que construye paredes, piso, techo, puerta, pizarra, 6 pupitres, luces y cartel desde JavaScript.
- Componente de botón único (`btn-action`) con hover/click para PC, gaze y láser VR.
- Movimiento del jugador con colisiones, y teletransporte en VR.
- Texturas de pared y piso, cartel por aula, eliminación de emojis en textos.
- Retiro de PWA (manifest/service worker) y del menú 3D de piso.

## Capabilities

### New Capabilities
- `faculty-building`: pasillo, distribución de aulas, texturas, iluminación y entrada.
- `classroom-generator`: construcción parametrizada de aulas con cartel y contenido por tipo.
- `interactive-buttons`: botones 3D clickeables para cursor, gaze y controladores.
- `player-navigation`: movimiento WASD/flechas con colisiones y teletransporte VR.

### Modified Capabilities

## Impact

- `index.html` (pasillo y 6 aulas declaradas con `generar-aula`), `js/scene.js` (generador, `btn-action`, `player-movement`), assets `pared.jpg`, `piso.jpg`, `pizarra.glb`, `silla_pupitre_disgraf_8b.glb`, `marco_en_madera_puerta.glb`.
