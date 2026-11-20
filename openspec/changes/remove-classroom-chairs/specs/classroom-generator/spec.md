## MODIFIED Requirements

### Requirement: Estructura base del aula
El sistema SHALL construir cada aula de 9 m × 7 m × 4,5 m con piso navegable, techo, paredes colisionables, hueco de puerta hacia el pasillo con modelo de marco, pizarra y luces, sin sillas ni pupitres.

#### Scenario: Aula izquierda
- **WHEN** se genera un aula con posición X negativa
- **THEN** la pizarra queda en la pared opuesta al pasillo y la puerta mira al pasillo (lado derecho del aula)

#### Scenario: Aula derecha
- **WHEN** se genera un aula con posición X positiva
- **THEN** la distribución es la imagen especular de la izquierda

#### Scenario: Sin sillas en ningún aula
- **WHEN** se generan las aulas de cualquier tipo, incluido el laboratorio de probabilidad
- **THEN** ninguna entidad de la escena usa el modelo de silla/pupitre
