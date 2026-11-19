# Proposal

> Cambio reconstruido (reverse engineering) desde git. Etapa 5 de 9.
> Período: 2026-05-28 → 2026-05-30 (`a3a9211` planificación, `5937a3b` MRUV, `56d8576`/`93af09c` fusión de ramas cpu+física, `c7bbcc1` MRU, `02b7b62` superposición de resultados).
> Dos aulas en un mismo cambio porque nacieron en la rama `helloworld-vr-raia-cpu-fisica` y se integraron juntas.

## Why

Cubrir contenidos de Sistemas Operativos (planificación de CPU) y Física (movimiento rectilíneo) con simulaciones visibles y repetibles.

## What Changes

- Aula 3: simulador VR de planificación de CPU con FCFS, SJF, SRTF y Round Robin, cola de listos, E/S, diagrama de Gantt y métricas.
- Aula 4: ejercicios resueltos de MRU y MRUV con animación de un auto y pantalla de respuestas.
- Corrección de incompatibilidad entre ambas aulas y de superposición de paneles al mostrar resultados.

## Capabilities

### New Capabilities
- `cpu-scheduler-lab`: simulación visual de algoritmos de planificación de CPU.
- `kinematics-lab`: simulaciones guiadas de MRU y MRUV con respuestas.

### Modified Capabilities

## Impact

- `js/interactions.js` (estado de CPU, Gantt, física) y construcción de aulas en `js/scene.js`.
