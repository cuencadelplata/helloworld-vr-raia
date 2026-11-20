# Tasks

Nota: los scripts se corren con `pnpm run` (preferencia del usuario), sin cambiar `package-lock.json` ni la CI.

## 1. Baseline

- [x] 1.1 Crear la rama `feat/remove-chairs` desde `main` y verificarla con `git branch --show-current`
- [x] 1.2 Correr la CI local antes del cambio (`test:coverage`, `scripts/coverage-summary.js`, `build`) y verificar que queda en verde: 27/27 tests y build OK

## 2. Quitar sillas

- [x] 2.1 En `js/scene.js`, borrar el bloque `forEach` que crea los seis `.pupitre` del aula base y verificar que no quedan apariciones de `class: "pupitre"`
- [x] 2.2 En `js/scene.js`, borrar el bloque que crea las `.prob-audience-chair` y verificar que no quedan apariciones de `prob-audience-chair`
- [x] 2.3 En `js/scene.js`, borrar los bucles `querySelectorAll(".pupitre")` de CPU, probabilidad y complejidad, y verificar con `grep -n "pupitre" js/scene.js` que no hay resultados
- [x] 2.4 En `index.html`, borrar `<a-asset-item id="modelo-pupitre">` y verificar con `grep -rn "pupitre" index.html js` que no hay resultados

## 3. Verificación

- [x] 3.1 Correr `pnpm run test:coverage`, `node scripts/coverage-summary.js` y `pnpm run build`, y verificar que todos salen con código 0
- [x] 3.2 Levantar `pnpm run dev` en localhost y pasarle la URL al usuario para que confirme que no hay sillas en ningún aula
