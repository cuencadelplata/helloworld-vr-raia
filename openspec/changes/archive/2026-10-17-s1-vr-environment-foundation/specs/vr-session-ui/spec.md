# Spec Delta

## Purpose
Define la interfaz de sesión de la Facultad Virtual: panel de ayuda, cursor de selección y transición entre modo escritorio y modo VR.

## ADDED Requirements

### Requirement: Panel de información en modo escritorio
El sistema SHALL mostrar un panel HTML con el título "Facultad Virtual VR", las instrucciones de control para PC y VR, y un resumen de la ubicación de las aulas.

#### Scenario: Carga inicial
- **WHEN** el usuario abre la aplicación en un navegador de escritorio
- **THEN** el panel de información es visible
- **AND** indica que WASD mueve y el mouse mira, y que en VR el gatillo/grip teletransporta

### Requirement: Cursor de selección con gaze y click
El sistema SHALL ofrecer un cursor en la cámara que seleccione solo elementos marcados como clickeables, con fusión (gaze) de 1500 ms y click directo.

#### Scenario: Selección por mirada
- **WHEN** el usuario mantiene la mirada sobre un elemento clickeable durante 1500 ms
- **THEN** se emite un click sobre ese elemento

#### Scenario: Elemento no clickeable
- **WHEN** el cursor apunta a un elemento no clickeable
- **THEN** no se emite ningún click

### Requirement: Transición de entrada y salida de VR
El sistema SHALL ocultar el panel de información, el HUD matemático y el cursor gaze al entrar a VR, y SHALL restaurar el panel y el cursor al salir de VR.

#### Scenario: Entrar a VR
- **WHEN** la escena emite el evento de entrada a VR
- **THEN** el panel de información y el HUD quedan ocultos
- **AND** el cursor gaze queda oculto (se usan los láseres de los controladores)

#### Scenario: Salir de VR
- **WHEN** la escena emite el evento de salida de VR
- **THEN** el panel de información vuelve a mostrarse
- **AND** el cursor gaze vuelve a ser visible
