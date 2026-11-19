# Spec Delta

## Purpose
Define el desplazamiento del jugador por el edificio con teclado y teletransporte VR, respetando paredes.

## ADDED Requirements

### Requirement: Movimiento con teclado
El sistema SHALL mover al jugador en el plano horizontal con W/A/S/D o las flechas, en la dirección de la cámara, a velocidad 4 m/s con diagonales normalizadas.

#### Scenario: Avanzar
- **WHEN** el usuario mantiene W
- **THEN** el jugador avanza en la dirección horizontal de su mirada

#### Scenario: Diagonal
- **WHEN** el usuario presiona W y D a la vez
- **THEN** la velocidad total no supera 4 m/s

### Requirement: Colisiones con deslizamiento
El sistema SHALL impedir atravesar paredes estructurales (altura ≥ 1 m) usando un radio de jugador y SHALL deslizar a lo largo de la pared bloqueando solo el eje en colisión.

#### Scenario: Pared frontal
- **WHEN** el jugador camina contra una pared
- **THEN** no la atraviesa

#### Scenario: Botones no colisionan
- **WHEN** el jugador pasa por un botón de menú (altura < 1 m)
- **THEN** el botón no bloquea el movimiento

### Requirement: Nivel del suelo
El sistema SHALL mantener la posición vertical del jugador a nivel del suelo.

#### Scenario: Altura constante
- **WHEN** el jugador se mueve
- **THEN** su altura permanece en 0

### Requirement: Teletransporte VR
El sistema SHALL permitir teletransportarse con el botón grip de cualquiera de los dos controladores sobre superficies navegables.

#### Scenario: Teletransporte válido
- **WHEN** el usuario apunta con curva parabólica a un piso navegable y suelta grip
- **THEN** el jugador se traslada al punto apuntado
