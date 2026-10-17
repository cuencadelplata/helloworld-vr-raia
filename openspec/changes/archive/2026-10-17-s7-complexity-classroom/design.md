# Design

## Context

Ver proposal.md. Adaptación de un proyecto externo (`complexity_simulator`) que analizaba AST de Python con reglas heurísticas; aquí el análisis se hace sobre rasgos predefinidos.

## Goals / Non-Goals

**Goals:**
- Clasificación explicable (cada resultado muestra su razón).

**Non-Goals:**
- Analizar código arbitrario escrito por el usuario.
- Análisis de caso promedio o amortizado.

## Decisions

- **Biblioteca de ejemplos con `traits` y `metrics` fijos** en lugar de parsear código en el visor.
- **Ranking numérico de clases** para elegir la dominante.
- **Gráfico dibujado con entidades A-Frame** (líneas) para mantenerlo en VR.

## Risks / Trade-offs

- [Rasgos manuales pueden contradecir el código mostrado] → los ejemplos precargados garantizan coherencia.
