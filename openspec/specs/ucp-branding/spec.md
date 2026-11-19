# ucp-branding Specification

## Purpose
Define la presencia visual de la identidad institucional UCP dentro del entorno virtual.

## Requirements

### Requirement: Logo institucional giratorio
El sistema SHALL mostrar un modelo 3D del logo de la UCP al fondo del pasillo, rotando continuamente sobre su eje vertical e iluminado por una luz puntual propia.

#### Scenario: Logo visible al fondo
- **WHEN** el usuario mira hacia el fondo del pasillo principal
- **THEN** ve el logo 3D girando en bucle continuo (una vuelta completa cada 8 s)

### Requirement: Título de la aplicación
El sistema SHALL titular la página "Facultad Virtual VR" y declarar el idioma español.

#### Scenario: Metadatos de la página
- **WHEN** se carga la página
- **THEN** el título del documento es "Facultad Virtual VR"
- **AND** el atributo de idioma del documento es "es"
