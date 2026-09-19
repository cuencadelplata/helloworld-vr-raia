# Hello World VR/RAIA

[![CI](https://github.com/cuencadelplata/helloworld-vr-raia/actions/workflows/ci.yml/badge.svg)](https://github.com/cuencadelplata/helloworld-vr-raia/actions/workflows/ci.yml)
[![Cobertura de líneas](https://raw.githubusercontent.com/cuencadelplata/helloworld-vr-raia/coverage-badge/badge.svg)](https://github.com/cuencadelplata/helloworld-vr-raia/tree/coverage-badge)

Este repositorio reúne una experiencia inicial de realidad virtual y realidad aumentada desarrollada como parte del proyecto de investigación **“Explorando conexiones a través de la Realidad Aumentada potenciada por Inteligencia Artificial en los entornos de programación y desarrollo de software”**.

El proyecto se desarrolla en el ámbito de la **Universidad de la Cuenca del Plata (UCP), sede Corrientes**. Su línea de investigación explora cómo la combinación de Realidad Aumentada e Inteligencia Artificial puede aportar información contextualizada y enriquecer las actividades vinculadas con la programación y el desarrollo de software.

## Alcance de este repositorio

Este repositorio contiene una implementación o prueba técnica puntual vinculada al proyecto de investigación. No representa por sí solo la plataforma completa ni sus resultados de evaluación.

## Referencia del proyecto

La investigación tiene como objetivo general desarrollar y evaluar una plataforma que integre recursos de Realidad Aumentada e Inteligencia Artificial en contextos de programación, considerando su impacto y aceptación en los ámbitos pertinentes.


## Team 

- Ing. Gilda R. Romero
- Ing. José A. Fernández
- Consultora experta: Jaquelina Escalante
- Estudiantes de la carrera de Ingeniería en Informática de la UCP, sede Corrientes
  - Mario González Junior
  - Gabriel Martínez Alarcón
  - Nicolás Médula


## Tests y cobertura

Requiere Node.js 22.12 o superior dentro de la rama 22 (el CI utiliza Node 22).

```bash
npm ci
npm test
npm run test:coverage
npm run build
```

Las pruebas usan el runner de Node, JSDOM y Three.js para comprobar:

- Ordenamientos y sus pasos, distribuciones de probabilidad y complejidad.
- Planificación de CPU, métricas y simulaciones MRU/MRUV.
- Generación de aulas, botones, iconos y eventos de la interfaz.
- Movimiento WASD/flechas, colisiones y joystick.
- Orden de carga de scripts y errores durante el arranque.

La cobertura se calcula con c8 sobre **todos los archivos de `js/`**, incluidos
los no ejecutados. No incluye dependencias, tests ni modelos 3D.
Los tests de DOM usan un adaptador de entidades A-Frame; no verifican renderizado
WebGL ni una sesión WebXR real. Los módulos de arranque se prueban con la API
experimental de módulos VM de Node, habilitada únicamente en los comandos de test.

Después de ejecutar la cobertura, abrir `coverage/index.html`. También se generan
`coverage/lcov.info` y `coverage/coverage-summary.json`.

El comando falla si la cobertura global baja del 90% en líneas, sentencias o
funciones, o del 85% en ramas condicionales. Estos mínimos están definidos en
[`.c8rc.json`](.c8rc.json). La suite inicial contiene 27 pruebas; el porcentaje
actual se obtiene ejecutando `npm run test:coverage`, y el badge se actualiza en CI.

## Integración continua

El workflow [CI](.github/workflows/ci.yml) ejecuta la instalación reproducible,
los tests con cobertura y el build en cada push y pull request. También admite
ejecución manual desde GitHub Actions.

Cada ejecución registra las métricas en el resumen de Actions y conserva el
artifact **coverage-report** durante 30 días, incluso cuando falla un test
si llegó a generarse el reporte.

El badge de cobertura muestra el porcentaje de líneas del último push exitoso
a la rama predeterminada. El CI crea y actualiza la rama `coverage-badge` con el
SVG y el resumen; no requiere Codecov ni secretos adicionales. Hasta la primera
ejecución exitosa en esa rama, el badge de cobertura no estará disponible.
La publicación utiliza `GITHUB_TOKEN` con `contents: write` solamente en ese job;
las pruebas de pull requests tienen permiso de lectura.




## Licencia

Este proyecto se distribuye bajo la licencia [MIT](LICENSE).