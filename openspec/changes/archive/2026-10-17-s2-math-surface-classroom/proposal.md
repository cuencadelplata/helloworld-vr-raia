# Proposal

> Cambio reconstruido (reverse engineering) desde git. Etapa 2 de 9.
> Período: 2025-07-05 (commit `da71eba` "Analisi Matematico y funciones") y ajustes posteriores de legibilidad (`4b76444`, `f01c41f`).

## Why

La investigación necesita ilustrar conceptos de Análisis Matemático (funciones de dos variables) de forma espacial e inmersiva, algo que una pizarra 2D no logra.

## What Changes

- Menú de funciones de dos variables en el Aula 1.
- Superficie 3D coloreada por altura generada proceduralmente para cada función.
- Título, descripción y dominio de la función seleccionada mostrados en un HUD HTML y en el aula.
- Botón para volver al menú.
- Renderizado compatible con Oculus/Quest (commit `f01c41f`).

## Capabilities

### New Capabilities
- `math-surface-lab`: laboratorio de superficies matemáticas del Aula 1.

### Modified Capabilities

## Impact

- Código: lógica de funciones y renderizado de malla (hoy en `js/interactions.js`), botones del Aula 1 (`js/scene.js`), HUD en `index.html`.
