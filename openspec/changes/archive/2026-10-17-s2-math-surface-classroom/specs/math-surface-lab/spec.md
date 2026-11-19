# Spec Delta

## Purpose
Permite explorar en 3D superficies de funciones de dos variables, con su nombre, descripción y dominio, dentro del Aula 1 (Análisis Matemático).

## ADDED Requirements

### Requirement: Catálogo de funciones
El sistema SHALL ofrecer cinco funciones seleccionables desde un menú: sin(x)·cos(y), x²+y², sin(√(x²+y²)), cos(x)·sin(y) y e^(−(x²+y²)).

#### Scenario: Menú inicial
- **WHEN** el usuario entra al Aula 1
- **THEN** ve el menú con cinco botones de función
- **AND** no hay ninguna superficie visible

### Requirement: Superficie 3D de la función elegida
El sistema SHALL generar una malla 3D de la función seleccionada, coloreada según el valor de la función, y SHALL mostrar su nombre, descripción y dominio.

#### Scenario: Seleccionar una función
- **WHEN** el usuario pulsa el botón de una función
- **THEN** el menú se oculta y se muestra la superficie de esa función
- **AND** se muestran el título, la descripción y el dominio de esa función

#### Scenario: Función desconocida
- **WHEN** se solicita una función que no existe en el catálogo
- **THEN** no se genera ninguna superficie

### Requirement: Volver al menú de funciones
El sistema SHALL permitir volver al menú de funciones desde la vista de una superficie y SHALL ignorar ese botón si la vista de función no está visible.

#### Scenario: Volver
- **WHEN** el usuario pulsa "volver" con una superficie visible
- **THEN** la superficie se oculta y reaparece el menú

#### Scenario: Botón oculto
- **WHEN** se dispara la acción "volver" sin superficie visible
- **THEN** no cambia el estado del aula
