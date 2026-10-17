# Proposal

> Cambio reconstruido (reverse engineering) desde git. Etapa 3 de 9.
> Período: 2025-10-30 → 2025-11-05 (commits `1c52d95`, `f01c41f`, `f022c76`).

## Why

Los algoritmos de ordenamiento son un tema central de programación; verlos moverse en 3D con control de ritmo ayuda a comprender sus pasos.

## What Changes

- Aula 2 "Algoritmos": menú con ordenamientos Bubble, Insertion y Quick.
- Arreglo aleatorio representado por barras/cubos 3D que se intercambian con animación.
- Controles: reiniciar, pausar/reanudar, paso atrás y selector de velocidad.
- Los alias de menú "intercambio" (burbuja) y "baraja" (inserción) se mantienen por compatibilidad.

## Capabilities

### New Capabilities
- `sorting-algorithm-lab`: animación paso a paso de algoritmos de ordenamiento.

### Modified Capabilities

## Impact

- Código en `js/interactions.js` (`showAlgorithm`, `getSortingSteps`, animación) y botones del Aula 2 en `js/scene.js`.
