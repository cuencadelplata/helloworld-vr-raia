# app-bootstrap Specification

## Purpose
Garantiza que la aplicación cargue sus dependencias y componentes en el orden correcto antes de crear la escena, y que falle de forma visible si algún recurso no carga.

## Requirements

### Requirement: Orden de arranque
El sistema SHALL cargar primero las dependencias, luego los iconos, la escena y las interacciones, y SHALL instanciar las entidades de la escena solo después de registrar todos sus componentes.

#### Scenario: Arranque normal
- **WHEN** la página inicia
- **THEN** los scripts se cargan en el orden dependencias, iconos, escena, interacciones
- **AND** la plantilla de la escena se reemplaza por su contenido real al final
- **AND** se inicializan los eventos de la escena

### Requirement: Error de carga explícito
El sistema SHALL propagar un error con el mensaje "No se pudo cargar <ruta>" si un script no descarga y SHALL NOT crear una escena incompleta.

#### Scenario: Script faltante
- **WHEN** falla la descarga de un script de la aplicación
- **THEN** el arranque termina con error
- **AND** no se inserta la escena en el documento

### Requirement: Compatibilidad del teletransporte con A-Frame 1.8
El sistema SHALL aplicar alias para las APIs renombradas de Three.js antes de cargar el componente de teletransporte.

#### Scenario: Teletransporte tras actualizar
- **WHEN** se carga A-Frame 1.8 con el componente de teletransporte 0.3.1
- **THEN** el componente se registra sin error de constructor

### Requirement: Iconos en el panel
El sistema SHALL reemplazar cada marcador de icono del panel por su icono SVG correspondiente.

#### Scenario: Panel con iconos
- **WHEN** el panel de información contiene un marcador `data-lucide-icon` conocido
- **THEN** se muestra el SVG del icono en su lugar

### Requirement: Assets estáticos
El sistema SHALL servir modelos y texturas desde la ruta `/assets/`.

#### Scenario: Textura de pared
- **WHEN** la escena solicita la textura de pared
- **THEN** la obtiene desde `/assets/pared.jpg`
