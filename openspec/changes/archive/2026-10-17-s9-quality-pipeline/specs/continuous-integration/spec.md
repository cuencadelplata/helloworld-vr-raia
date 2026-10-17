# Spec Delta

## Purpose
Ejecuta las verificaciones en cada cambio y publica métricas de cobertura de forma visible.

## ADDED Requirements

### Requirement: Ejecución en cada cambio
El sistema SHALL ejecutar en GitHub Actions la instalación reproducible (`npm ci`), las pruebas con cobertura y el build en cada push (excepto a `coverage-badge`) y en cada pull request, y SHALL admitir ejecución manual.

#### Scenario: Pull request
- **WHEN** se abre un pull request
- **THEN** corren `npm ci`, `npm run test:coverage` y `npm run build` con Node 22

### Requirement: Reportes de cobertura
El sistema SHALL registrar las métricas en el resumen de Actions y conservar el artifact `coverage-report` durante 30 días, incluso si una prueba falla, siempre que el reporte se haya generado.

#### Scenario: Prueba fallida con reporte
- **WHEN** una prueba falla pero existe `coverage-summary.json`
- **THEN** el resumen y el artifact igualmente se publican

### Requirement: Badge de cobertura
El sistema SHALL publicar en la rama `coverage-badge` un SVG y un resumen del porcentaje de líneas tras cada push exitoso a la rama predeterminada, sin servicios externos.

#### Scenario: Push a main
- **WHEN** hay un push exitoso a la rama predeterminada
- **THEN** se crea o actualiza la rama `coverage-badge` con `badge.svg`, `coverage-summary.json` y `summary.md`

### Requirement: Permisos mínimos
El sistema SHALL otorgar permiso de escritura de contenidos únicamente al job que publica el badge; los demás jobs usan solo lectura.

#### Scenario: Pull request
- **WHEN** corre el job de pruebas
- **THEN** tiene permiso de contenidos en solo lectura
