# Design

## Context

En `js/scene.js` las sillas salen de dos lugares: el bloque `.pupitre` del aula base (seis entidades) y el bloque `.prob-audience-chair` de `buildProbabilityContent`. Además, CPU (`buildCpuSchedulerContent`) y complejidad (`buildComplexityContent`) reubican los `.pupitre`, y probabilidad los borra. `index.html` precarga `#modelo-pupitre`.

Los marcos salen de dos lugares: una entidad `#modelo-puerta` por aula en `addBaseClassroom` (6 en total) y dos entidades `#modelo-puerta` estáticas en `index.html` para la entrada principal doble. `index.html` precarga `#modelo-puerta`. Los marcos no tienen la clase `collidable`, así que estorban de forma visual y no física.

## Goals / Non-Goals

**Goals:**
- Que no quede ninguna silla ni ningún marco de puerta en la escena, haciendo el diff más chico posible.

**Non-Goals:**
- Borrar `public/assets/silla_pupitre_disgraf_8b.glb` o `public/assets/marco_en_madera_puerta.glb`.
- Cambiar los huecos de puerta, el dintel o el relleno sobre la entrada.
- Reacomodar otros elementos de las aulas.
- Migrar el proyecto de npm a pnpm. El lockfile y la CI se quedan como están.

## Decisions

- **Eliminar en el origen.** Se borran los dos bloques que crean sillas. La alternativa era ocultarlas con `visible: false`, pero se descartó porque igual cargaría el modelo y dejaría entidades muertas.
- **Borrar los bucles `.pupitre` de CPU, probabilidad y complejidad.** Sin pupitres no hacen nada, y quedarían como código muerto.
- **Quitar el `<a-asset-item id="modelo-pupitre">`.** Sin referencias, sería una descarga inútil. El archivo `.glb` se conserva.
- **Marcos: borrar las 8 entidades y el `<a-asset-item id="modelo-puerta">`.** Se descartó escalar el modelo al tamaño del hueco: el pedido es sacarlos, y escalar exige calibrar el modelo.
- **Bloqueo de la entrada con una caja invisible y dos sillas.** La colisión de `player-movement` solo usa cajas `.collidable` de 1 m de alto o más, armadas a partir de los atributos, y no lee la geometría de los GLB. Por eso las sillas solas no bloquearían el paso. Se agrega un `a-box` `.collidable` con `visible="false"` que cubre el hueco (x ±1,2) y la zona de las sillas (z 6,7–7,6), y no alcanza el punto de aparición (z 6, radio 0,4). Las sillas van en x ±0,6, z 7,0, que es donde estaban los marcos. El teletransporte usa `.navegable` y los láseres `.clickable`, así que la caja no les interfiere.
- **No agregar un test nuevo.** Es una eliminación trivial. La verificación consiste en un grep sin resultados más la CI existente.

## Risks / Trade-offs

- [Algún test de escena cuenta entidades hijas] → hay que correr `pnpm run test:coverage` y revisar si falla.
- [El layout de probabilidad, CPU o complejidad dependía visualmente de las sillas] → lo valida el usuario en localhost.
- [Sin marco, el borde del hueco se ve crudo] → es aceptable según el pedido; lo valida el usuario en localhost.
