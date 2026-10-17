# classroom-generator Specification

## Purpose
Permite crear aulas completas a partir de unos pocos parámetros (id, posición, color, tipo) evitando bloques HTML duplicados.

## Requirements

### Requirement: Estructura base del aula
El sistema SHALL construir cada aula de 9 m × 7 m × 4,5 m con piso navegable, techo, paredes colisionables, hueco de puerta hacia el pasillo con modelo de marco, pizarra, seis pupitres y luces.

#### Scenario: Aula izquierda
- **WHEN** se genera un aula con posición X negativa
- **THEN** la pizarra queda en la pared opuesta al pasillo y la puerta mira al pasillo (lado derecho del aula)

#### Scenario: Aula derecha
- **WHEN** se genera un aula con posición X positiva
- **THEN** la distribución es la imagen especular de la izquierda

### Requirement: Parámetros del componente
El sistema SHALL aceptar `posicionXYZ`, `colorParedes` y `tipo` (matematica, algoritmos, cpu, fisica, probabilidad, complejidad o base) y SHALL regenerar el aula limpiando su contenido previo.

#### Scenario: Tipo desconocido
- **WHEN** el tipo no es uno de los conocidos
- **THEN** se genera el aula base con el rótulo "Laboratorio"

#### Scenario: Regeneración
- **WHEN** se regenera un aula ya construida
- **THEN** no quedan elementos duplicados

### Requirement: Contenido por tipo
El sistema SHALL incorporar el contenido interactivo propio del tipo de aula (menús, paneles y superficies) después de la estructura base.

#### Scenario: Aula de matemática
- **WHEN** se genera un aula de tipo matematica
- **THEN** contiene el menú de funciones y su zona de visualización
