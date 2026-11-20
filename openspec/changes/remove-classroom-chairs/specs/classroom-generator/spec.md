## MODIFIED Requirements

### Requirement: Estructura base del aula
El sistema SHALL construir cada aula de 9 m × 7 m × 4,5 m con piso navegable, techo, paredes colisionables, hueco de puerta hacia el pasillo libre de obstáculos, pizarra y luces, sin sillas, pupitres ni marco de puerta.

#### Scenario: Aula izquierda
- **WHEN** se genera un aula con posición X negativa
- **THEN** la pizarra queda en la pared opuesta al pasillo y la puerta mira al pasillo (lado derecho del aula)

#### Scenario: Aula derecha
- **WHEN** se genera un aula con posición X positiva
- **THEN** la distribución es la imagen especular de la izquierda

#### Scenario: Sin sillas en ningún aula
- **WHEN** se generan las aulas de cualquier tipo, incluido el laboratorio de probabilidad
- **THEN** ninguna entidad dentro de un aula usa el modelo de silla/pupitre

#### Scenario: Sin marco de puerta
- **WHEN** se genera un aula de cualquier tipo
- **THEN** el hueco de la puerta no contiene ningún modelo de marco y el jugador lo atraviesa sin obstáculos
