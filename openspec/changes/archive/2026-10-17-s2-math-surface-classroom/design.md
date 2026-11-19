# Design

## Context

Ver proposal.md. Código vigente: `mathFunctions`, `showMathMenu`, `showFunction`, `generateMathSurface`, `hslToRgb` en `js/interactions.js`.

## Goals / Non-Goals

**Goals:**
- Visualización procedural de superficies sin assets externos.

**Non-Goals:**
- Editor de funciones arbitrarias del usuario.
- Cálculo simbólico (derivadas, integrales).

## Decisions

- **Malla procedural (`BufferGeometry`) con color por vértice** en lugar de modelos pre-generados: permite añadir funciones con una sola fórmula.
- **Dominios fijos por función** (descritos en el HUD) para mantener la escena a escala de aula.
- **Bloqueo de re-render concurrente** (`isRenderingFunction`) para evitar cuelgues en Quest (commit `f01c41f`).

## Risks / Trade-offs

- [Rendimiento en Quest con mallas densas] → resolución limitada y renderizado serializado.
