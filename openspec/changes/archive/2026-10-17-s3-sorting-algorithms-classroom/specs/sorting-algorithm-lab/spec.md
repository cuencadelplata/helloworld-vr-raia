# Spec Delta

## Purpose
Permite visualizar en 3D la ejecución paso a paso de algoritmos de ordenamiento sobre un arreglo aleatorio, con control de velocidad y navegación de pasos.

## ADDED Requirements

### Requirement: Selección de algoritmo
El sistema SHALL ofrecer Bubble Sort, Insertion Sort y Quick Sort desde el menú del Aula 2 y SHALL mostrar el nombre y una descripción breve del algoritmo elegido.

#### Scenario: Elegir algoritmo
- **WHEN** el usuario pulsa un algoritmo del menú
- **THEN** se oculta el menú y se muestra la vista del algoritmo con su nombre y descripción
- **AND** se genera y dibuja un arreglo aleatorio

#### Scenario: Alias heredados
- **WHEN** se dispara la acción "intercambio" o "baraja"
- **THEN** se ejecutan Bubble Sort e Insertion Sort respectivamente

### Requirement: Animación de pasos
El sistema SHALL animar cada comparación e intercambio del algoritmo sobre las barras, y SHALL marcar el final del ordenamiento.

#### Scenario: Ejecución completa
- **WHEN** el algoritmo comienza
- **THEN** las barras se intercambian según los pasos del algoritmo hasta quedar ordenadas
- **AND** al terminar se indica que el ordenamiento finalizó

### Requirement: Controles de reproducción
El sistema SHALL permitir reiniciar, pausar/reanudar, retroceder un paso y alternar entre las velocidades "Vel 1x", "Lento" y "Muy lento".

#### Scenario: Pausar y reanudar
- **WHEN** el usuario pulsa pausar durante la animación
- **THEN** la animación se detiene
- **AND** al pulsar de nuevo continúa desde el mismo paso

#### Scenario: Cambiar velocidad
- **WHEN** el usuario pulsa el botón de velocidad
- **THEN** la velocidad pasa a la siguiente opción de la lista y la etiqueta del botón se actualiza

#### Scenario: Paso atrás
- **WHEN** el usuario pulsa paso atrás
- **THEN** se revierte el último paso aplicado

### Requirement: Controles solo con vista activa
El sistema SHALL ignorar los controles de reproducción y las acciones "algo-*" cuando la vista correspondiente no está visible.

#### Scenario: Botón oculto
- **WHEN** se dispara "pausar" sin vista de algoritmo visible
- **THEN** no cambia el estado de la animación
