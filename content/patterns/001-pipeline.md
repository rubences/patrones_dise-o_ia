---
patternId: 1
slug: pipeline
title: Pipeline
summary: Descompone una tarea compleja en etapas secuenciales donde la salida validada de cada etapa alimenta de forma explícita a la siguiente.
family: agentic-workflows
legacyGroup: 1
level: workflow
difficulty: beginner
maturity: established
llmRequired: true
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_1_pipeline.ts
tags:
  - workflow
  - orchestration
  - decomposition
  - structured-output
related:
  - 4
  - 24
  - 40
combinesWith:
  - 2
  - 4
  - 53
  - 77
antiPatterns:
  - Encadenar etapas sin contrato de entrada y salida.
  - Arrastrar todo el historial entre pasos aunque no sea necesario.
  - Convertir una tarea trivial en una cadena larga de llamadas al modelo.
references: []
---

# Propósito

**Pipeline** transforma una tarea amplia en una secuencia explícita de etapas. Cada etapa tiene una responsabilidad acotada y produce una salida que se convierte en entrada de la siguiente.

El valor del patrón no está en “hacer varias llamadas” al LLM, sino en introducir **contratos intermedios observables** que permitan validar, repetir, sustituir o medir cada transformación de forma independiente.

## El problema

Una única solicitud que mezcla planificación, generación, revisión y formato final concentra demasiadas decisiones en un punto. Esto dificulta saber dónde se produjo un error, obliga a repetir todo el proceso cuando falla una parte y hace más difícil imponer estructuras de salida.

## La solución

Separar el trabajo en pasos con límites claros:

```text
Entrada
  |
  v
+-----------+    +-----------+    +-----------+
| Etapa 1   | -> | Etapa 2   | -> | Etapa 3   |
| contrato  |    | contrato  |    | resultado |
+-----------+    +-----------+    +-----------+
```

Cada etapa debería declarar qué recibe, qué produce y qué condiciones debe cumplir antes de continuar.

## Implementación del repositorio

La implementación `src/pattern_1_pipeline.ts` construye un post técnico en tres fases:

1. generar un esquema de exactamente tres puntos mediante Structured Outputs y Zod;
2. escribir un borrador a partir de ese esquema;
3. generar un título a partir del borrador.

La primera etapa es especialmente importante porque convierte una respuesta generativa en un contrato tipado antes de seguir avanzando.

## Aplicabilidad

Utiliza Pipeline cuando:

- la tarea tiene una secuencia natural de transformaciones;
- necesitas inspeccionar resultados intermedios;
- cada etapa puede requerir instrucciones o modelos distintos;
- quieres reintentar únicamente el paso que falla;
- necesitas introducir validaciones antes de continuar.

## Cuándo no utilizarlo

No compensa para tareas simples de una sola transformación ni cuando todas las etapas necesitan simultáneamente el mismo contexto completo y la fragmentación introduce más coste que control.

## Failure modes

- **Propagación de error:** una salida incorrecta en una etapa contamina las siguientes.
- **Pérdida de información:** un contrato intermedio demasiado estrecho elimina contexto necesario.
- **Acoplamiento implícito:** una etapa depende de detalles no declarados de la anterior.
- **Explosión de latencia:** demasiadas llamadas secuenciales aumentan el tiempo total.

## Seguridad

Valida cada transición antes de usarla como instrucción para una etapa posterior. Si una etapa consume contenido externo, separa claramente datos e instrucciones para evitar que texto no confiable modifique el comportamiento del siguiente componente.

## Observabilidad

Registra por etapa: latencia, tokens, errores, versión de prompt/modelo, esquema de salida y correlación con la ejecución global. La unidad básica de diagnóstico debe ser la etapa, no solo la petición completa.

## Coste y latencia

El coste crece con el número de etapas, pero puede reducirse usando modelos más pequeños para pasos deterministas, caché intermedia y reintentos parciales. La latencia es principalmente acumulativa cuando las fases son estrictamente secuenciales.

## Evaluación

Mide tanto la calidad final como la tasa de validez de cada contrato intermedio. Un pipeline puede parecer correcto al final y ocultar una etapa frágil que solo funciona por compensación de etapas posteriores.

## Patrones relacionados

- **Evaluator-Optimizer (4):** añade iteración y criterio de aceptación a una etapa.
- **Template Method (24):** formaliza un esqueleto reusable de pasos.
- **Branching (40):** introduce bifurcaciones condicionales en lugar de una única secuencia.
- **Observability (77):** permite analizar el rendimiento de cada etapa.

## Estado editorial

La implementación demuestra correctamente la composición secuencial y el uso de un contrato estructurado en la primera fase. Las afirmaciones cuantitativas sobre mejora de calidad o coste deben incorporarse únicamente tras revisión de evidencia, por lo que esta ficha permanece en `needs-review`.
