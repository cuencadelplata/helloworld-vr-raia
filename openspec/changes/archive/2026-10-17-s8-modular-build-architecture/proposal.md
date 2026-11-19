# Proposal

> Cambio reconstruido (reverse engineering) desde git. Etapa 8 de 9.
> Período: 2026-09-19 (`ac6f08d`, `c4d5add`, `22e852c`, `00516f1`, `8f7f718`, `07e0219`, `f5903a6`, PRs #5 y #6).

## Why

`index.html` superaba las 6900 líneas con CSS y JS embebidos, lo que impedía testear, mantener y actualizar dependencias (A-Frame 1.6 → 1.8).

## What Changes

- Extraer CSS (`css/`) y JS (`js/`) del HTML monolítico; mover assets a `public/assets/`.
- Introducir `package.json` y Vite como herramienta de desarrollo y build.
- Arranque ordenado: dependencias → iconos → escena → interacciones, y recién entonces instanciar la escena desde una `<template>`.
- Compatibilidad de `aframe-teleport-controls` con A-Frame 1.8 mediante alias de APIs de Three.js.
- Restaurar movimiento WASD/flechas en PC tras la migración; descartar teclas al perder el foco.
- Locomoción suave con thumbstick del controlador (fecha exacta de introducción no verificada en el historial; se especifica por el código vigente).

## Capabilities

### New Capabilities
- `app-bootstrap`: orden de carga, manejo de errores de arranque y compatibilidad de dependencias.

### Modified Capabilities
- `player-navigation`: agrega locomoción con thumbstick y descarte de teclas al perder el foco.

## Impact

- Archivos: `index.html`, `css/styles.css`, `js/main.js`, `js/vendor.js`, `js/lucide-icons.js`, `package.json`, `.gitignore`.
- Dependencias: Vite, A-Frame 1.8.0, aframe-teleport-controls 0.3.1, GSAP.
- **BREAKING**: las rutas de assets cambian a `/assets/*`.
