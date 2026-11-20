## ADDED Requirements

### Requirement: Entrada principal bloqueada
El sistema SHALL impedir que el jugador salga del edificio por la entrada principal. El bloqueo SHALL justificarse dentro de la escena con una silla frente a cada una de las dos aberturas de la entrada doble, que no tiene marcos de puerta.

#### Scenario: Intento de salida por la entrada
- **WHEN** el jugador camina desde el punto de aparición hacia la entrada principal
- **THEN** se detiene antes de las sillas y no puede atravesar la entrada

#### Scenario: Aparición libre
- **WHEN** la aplicación inicia
- **THEN** el jugador aparece en la entrada del pasillo sin quedar atrapado por el bloqueo
