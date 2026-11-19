# Spec Delta

## Purpose
Presenta dos ejercicios de cinemática resueltos con simulación animada y respuesta paso a paso.

## ADDED Requirements

### Requirement: Menú de física
El sistema SHALL ofrecer en el Aula 4 un menú con los ejercicios MRU y MRUV y un botón para volver al menú desde cualquier vista.

#### Scenario: Navegar
- **WHEN** el usuario elige MRU
- **THEN** se muestra el enunciado del ejercicio y el resto de las vistas queda oculto

### Requirement: Ejercicio MRU
El sistema SHALL simular un auto con velocidad constante de 20 m/s durante 4 s mostrando tiempo, velocidad y distancia en vivo, y luego mostrar respuestas: 80 m en 4 s y 3 s para 60 m.

#### Scenario: Resultados
- **WHEN** la animación MRU termina
- **THEN** tras 1 s se muestran las respuestas con las fórmulas x = v·t y t = x/v

### Requirement: Ejercicio MRUV
El sistema SHALL simular un auto con v0 = 0 y a = 2,5 m/s² durante 4 s, y luego mostrar vf = 10 m/s (36 km/h) y x = 20 m.

#### Scenario: Resultados
- **WHEN** la animación MRUV termina
- **THEN** tras 1 s se muestran las respuestas con vf = v0 + a·t y x = v0·t + ½·a·t²

### Requirement: Sin superposición ni simulaciones duplicadas
El sistema SHALL ocultar cualquier otra vista de física al mostrar una, ignorar un nuevo inicio mientras corre una simulación y cancelar animaciones y resultados pendientes al navegar.

#### Scenario: Volver durante la animación
- **WHEN** el usuario vuelve al menú mientras corre una simulación
- **THEN** la animación se detiene y los resultados diferidos no aparecen
