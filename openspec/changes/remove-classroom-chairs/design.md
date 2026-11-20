# Design

## Context

En `js/scene.js` las sillas salen de dos lugares: el bloque `.pupitre` del aula base (seis entidades) y el bloque `.prob-audience-chair` de `buildProbabilityContent`. Además, CPU (`buildCpuSchedulerContent`) y complejidad (`buildComplexityContent`) reubican los `.pupitre`, y probabilidad los borra. `index.html` precarga `#modelo-pupitre`.

## Goals / Non-Goals

**Goals:**
- Que no quede ninguna silla en la escena, haciendo el diff más chico posible.

**Non-Goals:**
- Borrar `public/assets/silla_pupitre_disgraf_8b.glb`.
- Reacomodar otros elementos de las aulas.
- Migrar el proyecto de npm a pnpm. El lockfile y la CI se quedan como están.

## Decisions

- **Eliminar en el origen.** Se borran los dos bloques que crean sillas. La alternativa era ocultarlas con `visible: false`, pero se descartó porque igual cargaría el modelo y dejaría entidades muertas.
- **Borrar los bucles `.pupitre` de CPU, probabilidad y complejidad.** Sin pupitres no hacen nada, y quedarían como código muerto.
- **Quitar el `<a-asset-item id="modelo-pupitre">`.** Sin referencias, sería una descarga inútil. El archivo `.glb` se conserva.
- **No agregar un test nuevo.** Es una eliminación trivial. La verificación consiste en un grep sin resultados más la CI existente.

## Risks / Trade-offs

- [Algún test de escena cuenta entidades hijas] → hay que correr `pnpm run test:coverage` y revisar si falla.
- [El layout de probabilidad, CPU o complejidad dependía visualmente de las sillas] → lo valida el usuario en localhost.
