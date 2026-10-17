# Proposal

> Cambio reconstruido (reverse engineering) desde git. Etapa 9 de 9.
> Período: 2026-09-19 (`428fba3` pruebas + CI, `d26dbe2` licencia MIT, `2574f5a`, `88459d4` rama de badge).

## Why

Tras modularizar, el proyecto necesitaba una red de seguridad automatizada y visibilidad de calidad para continuar evolucionando.

## What Changes

- Suite de pruebas con el runner de Node, JSDOM y Three.js sobre matemática, simulaciones, escena y arranque.
- Cobertura con c8 sobre todos los archivos de `js/` y umbrales mínimos.
- Workflow de GitHub Actions: instalación reproducible, pruebas con cobertura, build, resumen, artifact y badge.
- Licencia MIT y documentación en README.

## Capabilities

### New Capabilities
- `automated-testing`: pruebas y umbrales de cobertura.
- `continuous-integration`: ejecución automática, reportes y badge de cobertura.

### Modified Capabilities

## Impact

- `tests/`, `.c8rc.json`, `scripts/coverage-summary.js`, `.github/workflows/ci.yml`, `LICENSE`, `README.md`, `package.json`.
