# Spec Delta

## Purpose
Permite observar cómo distintos algoritmos de planificación reparten la CPU entre procesos, con cola, E/S, Gantt y métricas.

## ADDED Requirements

### Requirement: Conjunto de procesos de ejemplo
El sistema SHALL simular cuatro procesos: P1 (llegada 0, ráfaga 8, E/S tras 3 u. por 2 u.), P2 (1, 4, sin E/S), P3 (2, 9, E/S tras 4 u. por 3 u.) y P4 (3, 5, sin E/S).

#### Scenario: Estado inicial
- **WHEN** se entra al Aula 3
- **THEN** los cuatro procesos están en estado "nuevo" y el algoritmo activo es FCFS con quantum 2

### Requirement: Algoritmos de planificación
El sistema SHALL ofrecer FCFS, SJF no preemptivo, SRTF preemptivo y Round Robin, y SHALL reiniciar la simulación al cambiar de algoritmo.

#### Scenario: SJF
- **WHEN** la CPU queda libre con varios procesos listos
- **THEN** se elige el de menor ráfaga restante sin desalojar al proceso en ejecución

#### Scenario: SRTF
- **WHEN** llega un proceso listo con menor tiempo restante que el actual
- **THEN** el proceso actual vuelve a la cola de listos y el más corto pasa a ejecutarse

#### Scenario: Round Robin
- **WHEN** un proceso consume su quantum sin terminar
- **THEN** vuelve al final de la cola de listos

### Requirement: Quantum ajustable
El sistema SHALL permitir ajustar el quantum de Round Robin entre 1 y 8 unidades.

#### Scenario: Límites
- **WHEN** el quantum vale 8 y se pulsa aumentar
- **THEN** permanece en 8

### Requirement: Entrada y salida
El sistema SHALL enviar un proceso a la lista de espera cuando ejecuta su instante de E/S, y SHALL devolverlo a listos al terminar su duración de E/S.

#### Scenario: P1 con E/S
- **WHEN** P1 acumula 3 unidades ejecutadas
- **THEN** pasa a estado "esperando" durante 2 unidades completas y luego regresa a listos

### Requirement: Control de la simulación
El sistema SHALL permitir iniciar, pausar/reanudar y reiniciar, avanzando una unidad de tiempo por tick, y SHALL marcar el fin cuando todos los procesos terminan.

#### Scenario: Fin de simulación
- **WHEN** el último proceso termina
- **THEN** la simulación se marca como finalizada y deja de avanzar

### Requirement: Visualización y métricas
El sistema SHALL colorear los procesos por estado (nuevo, listo, ejecutando, esperando, terminado), dibujar un diagrama de Gantt con leyenda y mostrar tabla de procesos y métricas (espera, respuesta, retorno, uso de CPU).

#### Scenario: Gantt
- **WHEN** un proceso ejecuta una unidad
- **THEN** se registra un bloque en el Gantt con su color
