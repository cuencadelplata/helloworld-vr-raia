# Spec Delta

## Purpose
Asegura de forma automática que la lógica de las aulas, la escena y el arranque se comportan como se espera, con un mínimo de cobertura exigido.

## ADDED Requirements

### Requirement: Alcance de las pruebas
El sistema SHALL verificar ordenamientos, distribuciones, complejidad, planificación de CPU, física, generación de aulas, botones, iconos, eventos VR, movimiento y orden de arranque.

#### Scenario: Ejecutar la suite
- **WHEN** se ejecuta `npm test`
- **THEN** corren todas las pruebas de `tests/` y el comando falla si alguna falla

### Requirement: Umbrales de cobertura
El sistema SHALL fallar `npm run test:coverage` si la cobertura global baja de 90 % en líneas, sentencias o funciones, o de 85 % en ramas.

#### Scenario: Cobertura insuficiente
- **WHEN** la cobertura de ramas es 80 %
- **THEN** el comando termina con error

### Requirement: Cobertura de todos los archivos de js
El sistema SHALL calcular la cobertura sobre todos los archivos de `js/`, incluidos los no ejecutados, y SHALL excluir dependencias, tests y modelos 3D.

#### Scenario: Archivo sin pruebas
- **WHEN** un archivo de `js/` no es cargado por ninguna prueba
- **THEN** cuenta como 0 % cubierto

### Requirement: Alcance declarado de las pruebas de DOM
El sistema SHALL documentar que las pruebas de DOM usan un adaptador de entidades A-Frame y no validan renderizado WebGL ni sesión WebXR real.

#### Scenario: Lectura del README
- **WHEN** se consulta la sección de tests del README
- **THEN** aparece esa limitación
