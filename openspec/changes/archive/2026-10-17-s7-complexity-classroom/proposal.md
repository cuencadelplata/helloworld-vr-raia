# Proposal

> Cambio reconstruido (reverse engineering) desde git. Etapa 7 de 9.
> Período: 2026-05-31 → 2026-06-02 (`1607473` salón, `cf2121e`, `204c45c` simulador Big O, `80f540a` ejemplos de código, `f52deae` análisis precargado, `d993142`).

## Why

La notación Big O es abstracta. Un simulador interactivo permite ver cómo crece el costo según bucles, recursividad, ordenamiento y división a la mitad.

## What Changes

- Aula 6: simulador de complejidad adaptado de un analizador de AST de Python.
- Controles de n, bucles, recursividad, sort y halving; botón calcular y reiniciar.
- Biblioteca de seis ejemplos de código precargados con métricas tipo AST, explicación y recomendación.
- Gráfico de crecimiento y retroalimentación cualitativa por clase de complejidad.
- Modo fácil/avanzado.

## Capabilities

### New Capabilities
- `complexity-lab`: estimación y visualización de la complejidad asintótica.

### Modified Capabilities

## Impact

- `js/interactions.js` (estado, clasificador, gráfico, biblioteca) y `js/scene.js` (panel del Aula 6).
