# Proposal

## Why

Se pidió quitar todas las sillas (modelo `silla_pupitre_disgraf_8b.glb`) del entorno virtual. Hoy aparecen en todas las aulas, como los seis pupitres de la estructura base y como las sillas de audiencia del laboratorio de probabilidad.

## What Changes

- Las aulas dejan de generar los seis pupitres de la estructura base.
- El laboratorio de probabilidad deja de generar sus seis sillas de audiencia.
- Se elimina el código que reubicaba o borraba pupitres en los laboratorios de CPU, probabilidad y complejidad, porque ya no hay pupitres que mover.
- Se quita la precarga del modelo `#modelo-pupitre` en `index.html`, que queda sin uso.
- No cambia nada más: el archivo `.glb` sigue en `public/assets/`, y la geometría, la pizarra, las luces, los paneles y la navegación quedan igual.

## Capabilities

### New Capabilities

Ninguna.

### Modified Capabilities

- `classroom-generator`: el requisito "Estructura base del aula" ya no incluye seis pupitres y pasa a exigir que ningún aula tenga sillas.

## Impact

- `js/scene.js`: creación de pupitres en el aula base, sillas de audiencia en probabilidad, bucles sobre `.pupitre` en CPU, probabilidad y complejidad.
- `index.html`: `<a-asset-item id="modelo-pupitre">`.
- Los tests no referencian pupitres. La CI (`test:coverage` + build) tiene que seguir en verde.
