---
patternId: 61
slug: few-shot
title: Few-Shot Prompting
summary: Incluye ejemplos representativos de entrada y salida para inducir formato, clasificación o comportamiento sin modificar los pesos del modelo.
family: reasoning
legacyGroup: 6
level: component
difficulty: beginner
maturity: established
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_61_few_shot.ts
tags: [prompting, few-shot, examples, in-context-learning]
related: [26, 64, 68]
combinesWith: [59, 73, 75]
antiPatterns:
  - Elegir ejemplos por conveniencia sin comprobar cobertura y sesgo.
  - Insertar ejemplos recuperados no confiables como instrucciones de alta prioridad.
  - Usar ejemplos para forzar JSON cuando existe salida estructurada nativa.
references:
  - Brown et al. (2020), Language Models are Few-Shot Learners.
---
# Propósito
Few-Shot Prompting muestra al modelo varios pares entrada/salida para aclarar la tarea, el formato o criterios implícitos. Es una forma de aprendizaje en contexto: la adaptación ocurre durante la inferencia, no mediante entrenamiento adicional.

## Problema
Una instrucción abstracta puede admitir múltiples interpretaciones. Los ejemplos ayudan a comunicar fronteras de clasificación, estilo o estructura.

## Solución
Selecciona un pequeño conjunto de ejemplos representativos, sepáralos claramente del input del usuario y mide su impacto.

## Diseño de ejemplos
Los ejemplos deberían cubrir:
- casos típicos;
- bordes importantes;
- clases minoritarias;
- formatos válidos;
- errores que quieres evitar.

Más ejemplos no siempre son mejores: consumen contexto y pueden introducir sesgo o contradicciones.

## Seguridad
Si los ejemplos se recuperan dinámicamente desde una base externa, trátalos como datos no confiables. No deben poder sustituir instrucciones del sistema ni introducir tool calls. Evita ejemplos con PII real.

## Implementación del repositorio
`src/pattern_61_few_shot.ts` mantiene una lista de ejemplos y construye un prompt textual para clasificación de sentimiento y extracción de entidades. Es una demostración clara de in-context examples, pero el JSON de la segunda tarea no está protegido por un schema estructurado.

## Producción
Versiona los conjuntos de ejemplos, evalúalos con un test set fijo y compara zero-shot vs few-shot. Para salida estructurada, usa schema enforcement además de ejemplos.

## Relaciones
**Zero-Shot CoT (68)** no necesita ejemplos; **Persona (64)** define comportamiento persistente; **A/B Testing (75)** permite medir qué conjunto de ejemplos funciona mejor.