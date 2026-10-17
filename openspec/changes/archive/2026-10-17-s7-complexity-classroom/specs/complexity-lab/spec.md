# Spec Delta

## Purpose
Permite estimar la complejidad Big O de un patrón de código descrito por sus rasgos, compararla visualmente y recibir recomendaciones.

## ADDED Requirements

### Requirement: Clasificación por rasgos
El sistema SHALL derivar la clase de complejidad a partir de bucles anidados (0–3), recursividad (no, simple, múltiple), uso de ordenamiento y división a la mitad, eligiendo la de mayor costo entre los rasgos aplicables.

#### Scenario: Recursividad múltiple
- **WHEN** la recursividad es múltiple sin bucles
- **THEN** el resultado es O(2^n)

#### Scenario: Recursividad múltiple con bucle
- **WHEN** la recursividad es múltiple y hay al menos un bucle
- **THEN** el resultado es O(n!)

#### Scenario: Sin bucles
- **WHEN** no hay bucles ni recursividad y el rasgo "halving" está activo
- **THEN** el resultado es O(log n)

#### Scenario: Ordenamiento
- **WHEN** hay un bucle y el rasgo sort está activo
- **THEN** el resultado es O(n log n)

### Requirement: Parámetros editables
El sistema SHALL permitir ajustar n entre 10 y 2000 (pasos de 10 y 100) y los rasgos, invalidando el resultado y el ejemplo seleccionado al cambiar un rasgo.

#### Scenario: Límite de n
- **WHEN** n vale 2000 y se pulsa aumentar
- **THEN** permanece en 2000

#### Scenario: Cambio de rasgo
- **WHEN** el usuario cambia los bucles tras calcular
- **THEN** el resultado se marca como no calculado

### Requirement: Biblioteca de ejemplos
El sistema SHALL ofrecer seis ejemplos (Constante, Lineal, Binaria, Ordena, Doble bucle, Fibonacci) que carguen su código, rasgos y métricas y calculen el resultado de inmediato.

#### Scenario: Cargar Fibonacci
- **WHEN** el usuario elige el ejemplo Fibonacci
- **THEN** se muestra su código, el resultado O(2^n), la explicación y la recomendación de memoización

### Requirement: Gráfico y operaciones estimadas
El sistema SHALL graficar el crecimiento de la clase calculada en escala logarítmica y mostrar el número de operaciones estimadas, limitando n a 30 para clases exponencial y factorial.

#### Scenario: Valores muy grandes
- **WHEN** el valor estimado es infinito
- **THEN** se muestra "muy grande"

### Requirement: Retroalimentación cualitativa
El sistema SHALL mostrar un mensaje cualitativo y de recomendación por clase, y SHALL ofrecer un modo fácil/avanzado y reinicio a valores por defecto (n=1000, un bucle).

#### Scenario: Reinicio
- **WHEN** el usuario pulsa reiniciar
- **THEN** n vale 1000, un bucle, sin recursividad, sort ni halving, y sin resultado
