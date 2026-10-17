# Design

## Context

Prototipo A-Frame en un único `index.html`. Ver proposal.md para la motivación. Las capacidades se deducen del código vigente y de los commits `b9f8629`, `ecfedaa`, `adf0825`, `cd9f86c`.

## Goals / Non-Goals

**Goals:**
- Escena base usable con mouse/teclado y con visores VR.
- Identidad institucional visible.

**Non-Goals:**
- Contenido didáctico (etapas 2–7).
- PWA, proyectil y menú de piso: existieron y fueron retirados; no se especifican.

## Decisions

- **A-Frame + `aframe-environment-component`** para entorno exterior (preset forest) sin modelar terreno propio.
- **Cursor `fuse` 1500 ms**: único mecanismo común a escritorio y VR sin controladores.
- **Logo como glTF animado con `animation` de A-Frame** en vez de código propio de rotación.
- Al entrar a VR se ocultan los elementos HTML porque no son visibles dentro del visor.

## Risks / Trade-offs

- [Inferencia de fechas por commits] → los límites de etapa son aproximados.
