# Design

## Context

Ver proposal.md. Código vigente: `getSortingSteps` produce una lista de pasos (comparar/intercambiar) y `animateAlgorithmSteps` la consume.

## Goals / Non-Goals

**Goals:**
- Separar la generación de pasos de su animación para poder pausar, retroceder y cambiar velocidad.

**Non-Goals:**
- Mostrar complejidad temporal del algoritmo (tema del Aula 6).
- Entrada de datos por el usuario (el arreglo es aleatorio).

## Decisions

- **Lista de pasos precalculada** en lugar de animar durante la ejecución: hace posible el paso atrás.
- **Timeouts rastreados** (`algorithmTimeouts`) para cancelar limpiamente al navegar.
- **Velocidades como factores** (1, 1.6, 2.4) sobre un retardo base.

## Risks / Trade-offs

- [Timeouts pendientes tras salir de la vista] → `stopAlgorithmAnimations` los cancela.
