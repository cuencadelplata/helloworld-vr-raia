# Design

## Context

Ver proposal.md. Ambas aulas comparten el patrón "vistas que se ocultan entre sí" dentro de un aula generada.

## Goals / Non-Goals

**Goals:**
- Simulación determinista y explicable paso a paso.
- Estado de aula aislado (CPU y física no interfieren).

**Non-Goals:**
- Procesos configurables por el usuario.
- Ejercicios de física parametrizables (valores fijos del enunciado).

## Decisions

- **Planificador por ticks** con `setTimeout` rastreados (1600 ms por unidad): permite pausar y limpiar.
- **E/S descontada al inicio del tick con +1** para ocupar duraciones completas.
- **Física con `requestAnimationFrame`** y escalas distintas por ejercicio (MRU 0,05; MRUV 0,20 u/m).
- **`hideFisicaAll` centralizado** corrige la superposición de resultados (`02b7b62`).

## Risks / Trade-offs

- [Conflicto de variables globales entre aulas, corregido en `93af09c`] → estados separados por laboratorio.
