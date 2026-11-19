# Design

## Context

Ver proposal.md. La función matemática (pdf/cdf, gamma/beta incompletas) es propia, sin librerías, para correr en el navegador del visor.

## Goals / Non-Goals

**Goals:**
- Fidelidad numérica razonable (funciones de error, gamma, beta regularizada).
- Interfaz de pizarra legible desde el aula.

**Non-Goals:**
- Pruebas de hipótesis o estimación de parámetros.
- Estaciones de normal, Student y varianza (existen definidas como pendientes).

## Decisions

- **Mapeo estación → distribución** para unir "máquina física" con el modelo teórico.
- **Muestreo por método simple**: Bernoulli para moneda, Knuth para Poisson, Box-Muller para normal.
- **Estado único `probabilityState`** y re-render completo tras cada acción.

## Risks / Trade-offs

- [Rendimiento al redibujar toda la pizarra] → renderizado a demanda solo en acciones.
- [Precisión numérica en colas extremas] → se limitan probabilidades a [0, 1].
