# Design

## Context

Ver proposal.md. Los scripts de aplicación son "clásicos" (no módulos) y dependen de `AFRAME` y `THREE` globales, por lo que se cargan dinámicamente desde `main.js`.

## Goals / Non-Goals

**Goals:**
- Mantener el comportamiento existente sin reescribir la lógica de las aulas.
- Dejar la base testeable en Node (JSDOM).

**Non-Goals:**
- Convertir los scripts a módulos ES.
- Separar `interactions.js` por aula.

## Decisions

- **`main.js` como orquestador con `await` secuencial**: garantiza registro de componentes antes de crear entidades.
- **Escena dentro de `<template>`**: A-Frame no la instancia hasta que los componentes existan.
- **Alias de Three.js en `vendor.js`** en lugar de bifurcar `aframe-teleport-controls`.
- **Vite** por su soporte de `?url` y de assets estáticos en `public/`.

## Risks / Trade-offs

- [Alias dependientes de la versión de Three.js] → se fija A-Frame 1.8.0.
- [Scripts clásicos comparten globales] → riesgo de colisiones, aceptado en esta etapa.
