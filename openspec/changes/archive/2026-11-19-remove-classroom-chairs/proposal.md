# Proposal

## Why

Se pidió quitar todas las sillas (modelo `silla_pupitre_disgraf_8b.glb`) del entorno virtual. Hoy aparecen en todas las aulas, como los seis pupitres de la estructura base y como las sillas de audiencia del laboratorio de probabilidad.

También sobran los marcos de puerta (modelo `marco_en_madera_puerta.glb`). Son más chicos que el hueco de la entrada y estorban al entrar a las aulas y al edificio.

## What Changes

- Las aulas dejan de generar los seis pupitres de la estructura base.
- El laboratorio de probabilidad deja de generar sus seis sillas de audiencia.
- Se elimina el código que reubicaba o borraba pupitres en los laboratorios de CPU, probabilidad y complejidad, porque ya no hay pupitres que mover.
- Se quita la precarga del modelo `#modelo-pupitre` en `index.html`, que queda sin uso.
- Las aulas dejan de generar el marco de puerta. El hueco de la puerta se mantiene.
- La entrada principal del pasillo deja de tener sus dos marcos.
- Se quita la precarga del modelo `#modelo-puerta` en `index.html`, que queda sin uso.
- La entrada principal no tenía ninguna barrera, así que se podía salir del edificio. Se pone una silla frente a cada una de las dos aberturas y una caja invisible colisionable que bloquea el paso. Para eso se vuelve a precargar `#modelo-pupitre`.
- No cambia nada más: los archivos `.glb` siguen en `public/assets/`, y la geometría, la pizarra, las luces, los paneles y la navegación quedan igual.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `classroom-generator`: el requisito "Estructura base del aula" ya no incluye seis pupitres ni modelo de marco, y pasa a exigir que ningún aula tenga sillas ni marco de puerta. 
- `faculty-building`: se agrega el requisito "Entrada principal bloqueada".

## Impact

- `js/scene.js`: creación de pupitres en el aula base, sillas de audiencia en probabilidad, bucles sobre `.pupitre` en CPU, probabilidad y complejidad.
- `js/scene.js`: entidad `#modelo-puerta` de `addBaseClassroom`.
- `index.html`: `<a-asset-item id="modelo-puerta">`, los dos marcos de la entrada principal, las dos sillas de bloqueo y la caja de colisión.
- Los tests no referencian pupitres. La CI (`test:coverage` + build) tiene que seguir en verde.
