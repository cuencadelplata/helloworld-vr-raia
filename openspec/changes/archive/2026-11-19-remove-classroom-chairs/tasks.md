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

## 3. Verificación (sillas)

- [x] 3.1 Correr `pnpm run test:coverage`, `node scripts/coverage-summary.js` y `pnpm run build`, y verificar que todos salen con código 0
- [x] 3.2 Levantar `pnpm run dev` en localhost y pasarle la URL al usuario para que confirme que no hay sillas en ningún aula

## 4. Quitar marcos de puerta

- [x] 4.1 En `js/scene.js`, borrar la entidad `#modelo-puerta` de `addBaseClassroom` y verificar con `grep -n "modelo-puerta" js/scene.js` que no hay resultados
- [x] 4.2 En `index.html`, borrar el bloque "Marco de puerta principal (entrada doble)" con sus dos entidades y el `<a-asset-item id="modelo-puerta">`, y verificar con `grep -rn "modelo-puerta\|marco_en_madera" index.html js` que no hay resultados

## 5. Bloqueo de la entrada

- [x] 5.1 En `index.html`, volver a precargar `<a-asset-item id="modelo-pupitre">`, poner 2 sillas en x ±0,6, z 7,0 y una caja `.collidable` invisible que cubra el hueco, y verificar con grep que hay exactamente 2 usos de `#modelo-pupitre`

## 6. Verificación (marcos y bloqueo)

- [x] 6.1 Correr `pnpm run test:coverage`, `node scripts/coverage-summary.js` y `pnpm run build`, y verificar que todos salen con código 0
- [x] 6.2 Levantar `pnpm run dev` en localhost y pasarle la URL al usuario para que confirme que no quedan marcos en las aulas ni en la entrada, que se ven las 2 sillas y que no se puede salir por la entrada
