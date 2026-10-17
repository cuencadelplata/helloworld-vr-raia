# Proposal

> Cambio reconstruido (reverse engineering) a partir del historial de git. Etapa 1 de 9.
> Período: 2024-12-16 → 2025-10-07 (commits `379c5c3` … `cd9f86c`).

## Why

El proyecto de investigación UCP necesitaba un entorno A-Frame navegable en navegador y en visores VR (Quest) como base sobre la cual montar contenido didáctico. Esta etapa fija la identidad visual y el comportamiento de sesión VR/escritorio.

## What Changes

- Escena A-Frame inicial con entorno exterior, iluminación y logo institucional 3D giratorio.
- Panel de información en pantalla (HTML) con instrucciones de uso PC/VR.
- Cursor de mirada (gaze) con click y fusión para PC y VR.
- Al entrar a VR se ocultan paneles HTML y cursor gaze; al salir se restauran.
- Historia superada (no vigente hoy): prototipo de proyectil físico, PWA (manifest + service worker) y menú 3D sobre el piso. Se eliminaron en la refactorización de la etapa 4.

## Capabilities

### New Capabilities
- `vr-session-ui`: panel de información, cursor gaze/click y comportamiento al entrar/salir de VR.
- `ucp-branding`: logo institucional 3D giratorio en el pasillo y título/identidad de la escena.

### Modified Capabilities

## Impact

- `index.html` (escena y panel), `public/assets/Iso.gltf`, `public/assets/logo.png`.
- Dependencias: A-Frame, aframe-environment-component.
