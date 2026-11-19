# probability-lab Specification

## Purpose
Permite explorar distribuciones de probabilidad, calcular probabilidades sobre intervalos y contrastar el modelo con muestras generadas en máquinas del aula.

## Requirements

### Requirement: Catálogo de distribuciones
El sistema SHALL ofrecer 11 distribuciones continuas (normal, t de Student, chi-cuadrado, F, exponencial, Cauchy, Weibull, gamma, beta, log-normal, logística) y 5 discretas (uniforme discreta, binomial, binomial negativa, Poisson, hipergeométrica), navegables en ciclo con anterior/siguiente.

#### Scenario: Navegación circular
- **WHEN** el usuario pulsa "siguiente" en la última distribución
- **THEN** se muestra la primera y los parámetros vuelven a sus valores por defecto

### Requirement: Parámetros ajustables y validados
El sistema SHALL permitir aumentar y disminuir cada parámetro en su paso, respetando mínimos, máximos y valores enteros, y SHALL reportar errores de validación (por ejemplo K ≤ N y n ≤ N en la hipergeométrica).

#### Scenario: Límite mínimo
- **WHEN** el usuario disminuye un parámetro en su valor mínimo
- **THEN** el valor permanece en el mínimo

#### Scenario: Cambio de parámetro
- **WHEN** se modifica un parámetro
- **THEN** se reinician los datos observados con el mensaje "Parametro actualizado. Genera nuevos datos."

### Requirement: Probabilidad sobre un intervalo
El sistema SHALL calcular y mostrar la probabilidad teórica para los intervalos "entre", "izquierda", "derecha" y "fuera" con límites a y b ajustables (paso 0,25 continuo, 1 discreto) y SHALL exigir a ≤ b en "entre" y "fuera".

#### Scenario: Intervalo inválido
- **WHEN** a es mayor que b en el intervalo "entre"
- **THEN** se informa "Debe cumplirse a <= b." y no se calcula la probabilidad

### Requirement: Estaciones de muestreo
El sistema SHALL ofrecer estaciones activas de moneda (Binomial, n lanzamientos con probabilidad p), dado (Uniforme discreta de 1 a m) y llamadas (Poisson con tasa λ), cada una con parámetros y descripción propios.

#### Scenario: Elegir estación
- **WHEN** el usuario elige la estación de dado
- **THEN** la distribución activa pasa a Uniforme discreta con sus parámetros de estación y se reinician los datos observados

#### Scenario: Estación pendiente
- **WHEN** se ejecuta un experimento en una estación marcada como pendiente
- **THEN** solo se muestra su descripción y no se generan datos

### Requirement: Experimentos repetidos
El sistema SHALL generar 1, 10 o 100 muestras por pulsación, acumularlas, mostrar el último valor y el total, y permitir reiniciar los datos observados.

#### Scenario: Cien repeticiones
- **WHEN** el usuario pulsa "100" con 5 datos acumulados
- **THEN** el total pasa a 105 y se actualiza el gráfico observado
