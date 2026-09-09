---
patternId: 68
slug: zero-shot-cot
title: Zero-Shot Chain of Thought
summary: Induce descomposición o deliberación sin ejemplos previos mediante instrucciones de razonamiento, evaluando si aportan valor frente a una respuesta directa.
family: reasoning
legacyGroup: 6
level: component
difficulty: beginner
maturity: established
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_68_zero_shot_cot.ts
tags: [reasoning, zero-shot, cot, prompting]
related: [26, 55, 61]
combinesWith: [42, 73]
antiPatterns:
  - Tratar «piensa paso a paso» como un sufijo universal que siempre mejora el resultado.
  - Pedir revelar todo el proceso interno cuando basta una respuesta o rationale breve.
  - Comparar variantes sin un conjunto de evaluación reproducible.
references:
  - Kojima et al. (2022), Large Language Models are Zero-Shot Reasoners.
---
# Propósito
Zero-Shot CoT utiliza una instrucción de deliberación sin proporcionar ejemplos. Históricamente, frases del tipo «pensemos paso a paso» mostraron mejoras en determinados benchmarks y modelos; el patrón general es **solicitar descomposición cuando la tarea la necesita**.

## Problema
Few-shot requiere curar ejemplos. En algunos problemas queremos inducir una estrategia de resolución sin ese coste editorial.

## Solución
Añade una instrucción que oriente a descomponer, comprobar hipótesis o considerar alternativas, y evalúa el resultado frente a un baseline directo.

## No existe un «sufijo mágico» universal
El efecto depende del modelo, tarea y API. Modelos con capacidades de razonamiento dedicadas pueden gestionar deliberación internamente y no necesitan que el usuario solicite una traza visible. El criterio correcto es rendimiento medido, no tradición de prompt.

## Implementación del repositorio
`src/pattern_68_zero_shot_cot.ts` implementa seis sufijos y separa heurísticamente la última línea como respuesta final. Algunos sufijos piden «razona en voz alta» o «muestra todo tu proceso de pensamiento».

Para la edición canónica, esas frases se tratan como ejemplos históricos de prompting, **no como recomendación de producto para exponer razonamiento interno**. La extracción por última línea tampoco garantiza que se haya identificado una conclusión válida.

## Producción
Compara variantes con evals; usa outputs estructurados si necesitas pasos verificables; mide tokens y latencia; y evita persistir borradores sensibles.

## Relaciones
**Chain of Thought (26)** es el patrón más amplio; **Few-Shot (61)** añade demostraciones; **Self-Consistency (42)** muestrea varias trayectorias; **Scratchpad (55)** gestiona estado de trabajo.