# Design

## Context

Ver proposal.md. Los componentes A-Frame dependen del navegador; las pruebas los ejecutan sobre JSDOM con un adaptador (`tests/helpers/app.js`).

## Goals / Non-Goals

**Goals:**
- Detectar regresiones lógicas sin navegador ni visor.
- Cobertura honesta (incluye archivos no ejecutados).

**Non-Goals:**
- Pruebas de renderizado WebGL/WebXR.
- Pruebas de rendimiento en Quest.

## Decisions

- **Runner de Node + `--experimental-vm-modules`** en lugar de Jest/Vitest: menos dependencias, evaluación de módulos de arranque en VM.
- **c8** para cobertura nativa V8 con `.c8rc.json`.
- **Rama `coverage-badge` vía GITHUB_TOKEN** en lugar de Codecov: sin secretos.
- **`cancel-in-progress` por rama** para ahorrar minutos de CI.

## Risks / Trade-offs

- [API experimental de Node] → habilitada solo en comandos de test; Node 22 fijado.
- [Badge ausente hasta el primer push exitoso] → documentado en README.
