# Proposal

> Cambio reconstruido (reverse engineering) desde git. Etapa 6 de 9.
> Período: 2026-05-31 → 2026-06-02 (`c143baa` aula de estadística, `e845148` casino, `319962a`, `a1a0783`, `aa214f3`, `965e731`, `1558197`, `6c8f4bc`).

## Why

La Probabilidad se entiende mejor generando datos: lanzar monedas, dados o contar llamadas y compararlos con el modelo teórico.

## What Changes

- Aula 5 "casino": estaciones/máquinas de moneda (Binomial), dado (Uniforme discreta) y llamadas por minuto (Poisson).
- Catálogo de 16 distribuciones con parámetros ajustables y cálculo de probabilidades por intervalo.
- Experimentos de 1, 10 y 100 repeticiones, con histograma de datos observados frente al modelo.
- Mejoras visuales: máquinas, dado, pizarras didácticas, textos legibles.

## Capabilities

### New Capabilities
- `probability-lab`: laboratorio de distribuciones, estaciones de muestreo y probabilidades por intervalo.

### Modified Capabilities

## Impact

- `js/interactions.js` (matemática estadística, estado, render de pizarras y máquinas), `js/scene.js` (construcción del aula).
