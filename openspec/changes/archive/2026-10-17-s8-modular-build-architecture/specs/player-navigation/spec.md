# Spec Delta

## ADDED Requirements

### Requirement: Descartar teclas al perder el foco
El sistema SHALL soltar todas las teclas presionadas cuando la ventana pierde el foco, evitando que el jugador siga caminando.

#### Scenario: Cambio de pestaña
- **WHEN** el usuario mantiene W y la ventana pierde el foco
- **THEN** el jugador deja de moverse

### Requirement: Locomoción con thumbstick
El sistema SHALL mover al jugador con el joystick del controlador izquierdo a velocidad 3 m/s, con zona muerta de 0,15, proporcional a la inclinación y orientado por la cabeza, respetando las colisiones cuando están listas.

#### Scenario: Zona muerta
- **WHEN** el eje del joystick es menor que 0,15 en valor absoluto
- **THEN** el jugador no se mueve

#### Scenario: Colisión
- **WHEN** el joystick empuja al jugador contra una pared
- **THEN** el jugador no atraviesa la pared y desliza por el eje libre

#### Scenario: Colisiones aún no listas
- **WHEN** el joystick se usa antes de que las colisiones estén listas
- **THEN** el jugador se mueve sin comprobación de colisión
