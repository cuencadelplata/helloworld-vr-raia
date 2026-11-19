# Tasks

> Todas las tareas están implementadas (reverse engineering). Se marcan como completas.

## 1. Escena base

- [x] 1.1 Crear escena A-Frame con entorno exterior e iluminación; verificar que carga sin errores (`tests/bootstrap.test.js`)
- [x] 1.2 Agregar logo glTF giratorio con luz puntual; verificar visualmente al fondo del pasillo

## 2. Sesión y entrada

- [x] 2.1 Agregar panel HTML de información; verificar que aparece en modo escritorio
- [x] 2.2 Agregar cursor gaze/click con raycaster sobre `.clickable`; verificar `fuse-timeout` 1500
- [x] 2.3 Ocultar/restaurar panel, HUD y cursor en `enter-vr`/`exit-vr`; verificar en `tests/scene.test.js`
