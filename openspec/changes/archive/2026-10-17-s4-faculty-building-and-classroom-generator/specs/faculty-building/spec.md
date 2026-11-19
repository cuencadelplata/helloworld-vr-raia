# Spec Delta

## Purpose
Define la geometría y distribución del edificio: un pasillo central con seis aulas numeradas, iluminación y entrada.

## ADDED Requirements

### Requirement: Pasillo principal
El sistema SHALL ofrecer un pasillo de 4 m de ancho y 29 m de largo, con piso, techo, pared de fondo, entrada doble al frente e iluminación puntual a lo largo.

#### Scenario: Punto de aparición
- **WHEN** la aplicación inicia
- **THEN** el jugador aparece en la entrada del pasillo mirando hacia el fondo
- **AND** el piso del pasillo es superficie navegable para el teletransporte

### Requirement: Distribución de aulas
El sistema SHALL ubicar seis aulas: las impares (1, 3, 5) a la izquierda y las pares (2, 4, 6) a la derecha del pasillo, con una puerta hacia cada una.

#### Scenario: Asignación de materias
- **WHEN** el usuario recorre el pasillo
- **THEN** el Aula 1 es Análisis Matemático, la 2 Algoritmos, la 3 CPU, la 4 Física, la 5 Probabilidad y la 6 Complejidad

### Requirement: Cartel de aula
El sistema SHALL colocar junto a la puerta de cada aula un cartel con "Aula N" y el nombre de su materia.

#### Scenario: Lectura del cartel
- **WHEN** el usuario se acerca a la puerta del Aula 3
- **THEN** el cartel muestra "Aula 3" y "Planificacion de CPU"

### Requirement: Texturas y entorno
El sistema SHALL texturizar paredes y pisos con imágenes dedicadas y rodear el edificio con un entorno exterior de bosque con niebla.

#### Scenario: Carga de assets
- **WHEN** se carga la escena
- **THEN** los assets de texturas y modelos se precargan antes de mostrar el contenido (timeout 30 s)
