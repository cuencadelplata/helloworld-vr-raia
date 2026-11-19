# Design

## Context

Ver proposal.md. Hasta mayo de 2026 las aulas eran HTML duplicado; la refactorización `c6e6f10` pasa a generarlas desde JS. El documento `arquitectura-conceptual.md` (enero 2026) se eliminó después (`c674b3f`).

## Goals / Non-Goals

**Goals:**
- Una sola definición de aula parametrizable.
- Un solo mecanismo de click para todos los dispositivos.
- Colisión simple y robusta.

**Non-Goals:**
- Física completa (gravedad, saltos).
- Aulas generadas dinámicamente en ejecución por el usuario.

## Decisions

- **Componente `generar-aula`** en lugar de plantillas HTML: facilita el espejado izquierda/derecha por el signo de X.
- **Cajas de colisión calculadas a mano** desde atributos (no `Box3.setFromObject`), porque falla con entidades anidadas.
- **Filtro por altura ≥ 1 m** para ignorar botones marcados como colisionables.
- **Construcción con retardo de 500 ms** para que las matrices de mundo estén listas.
- **Teletransporte parabólico con grip** para dejar el gatillo libre para apuntar y clickear.

## Risks / Trade-offs

- [Cajas calculadas a mano ignoran rotaciones] → las paredes se mantienen alineadas a los ejes.
- [Retardo fijo de 500 ms] → hay una ventana corta sin colisión tras la carga.
