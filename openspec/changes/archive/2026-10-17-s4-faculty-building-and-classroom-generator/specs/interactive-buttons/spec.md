# Spec Delta

## Purpose
Unifica la interacción con botones 3D para que funcione igual con cursor de PC, mirada (gaze) y controladores VR.

## ADDED Requirements

### Requirement: Botón con acción nombrada
El sistema SHALL representar cada botón con una acción en forma de texto y SHALL ejecutar la acción asociada al recibir click del botón o de su caja visual.

#### Scenario: Click sobre la caja del botón
- **WHEN** se hace click sobre la caja visual del botón
- **THEN** se ejecuta la acción nombrada una sola vez (el evento no se propaga al contenedor)

### Requirement: Retroalimentación visual
El sistema SHALL ampliar el botón a escala 1,15 al entrar el cursor y restaurarla a 1 al salir.

#### Scenario: Hover
- **WHEN** el cursor entra y luego sale del botón
- **THEN** la escala va de 1 a 1,15 y vuelve a 1

### Requirement: Ignorar botones de vistas ocultas
El sistema SHALL ignorar acciones cuyo menú o vista contenedora no esté visible.

#### Scenario: Acción de menú oculto
- **WHEN** se dispara una acción "func*" mientras el menú matemático está oculto
- **THEN** no se ejecuta ninguna acción

### Requirement: Enrutamiento de acciones
El sistema SHALL derivar cada acción a su controlador (matemática, algoritmos, física, CPU, probabilidad, complejidad).

#### Scenario: Acción de CPU
- **WHEN** se dispara "cpu-start"
- **THEN** se invoca el controlador del planificador de CPU
