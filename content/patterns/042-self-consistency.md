---
patternId: 42
slug: self-consistency
title: Self-Consistency
summary: Ejecuta varias trayectorias independientes para la misma tarea y agrega sus respuestas, usando el acuerdo entre resultados como señal de robustez, no como verdad garantizada.
family: reasoning
legacyGroup: 6
level: workflow
difficulty: intermediate
maturity: established
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_42_self_consistency.ts
tags: [reasoning, self-consistency, voting, sampling]
related: [26, 36, 43]
combinesWith: [61, 73, 78]
antiPatterns:
  - Interpretar el porcentaje de votos como probabilidad calibrada de corrección.
  - Agregar cadenas de texto por igualdad superficial cuando las respuestas son semánticas.
  - Ejecutar N muestras sin medir si el coste adicional mejora el resultado.
references:
  - Wang et al. (2022), Self-Consistency Improves Chain of Thought Reasoning in Language Models.
---
# Propósito
Self-Consistency reduce la dependencia de una única muestra estocástica. Se generan varias soluciones y se agrega la respuesta final por mayoría, equivalencia semántica o un criterio de consenso.

## Problema
Dos ejecuciones del mismo modelo pueden producir rutas distintas. Una sola muestra puede elegir una trayectoria errónea aunque otras muestras converjan en una solución mejor.

## Solución

```text
Pregunta
  -> muestra 1 -> respuesta A
  -> muestra 2 -> respuesta B
  -> muestra 3 -> respuesta A
  -> ...
  -> agregador -> A
```

La agregación debe adaptarse al tipo de tarea: igualdad exacta para resultados discretos, normalización estructurada, equivalencia semántica o juez/verificador para outputs abiertos.

## Aplicabilidad
Es útil cuando la variación de muestreo aporta diversidad y el resultado final es agregable. Es menos útil en tareas creativas o cuando todas las muestras comparten el mismo sesgo sistemático.

## Coste
El coste crece aproximadamente con el número de ejecuciones más la agregación. Antes de aumentar `N`, compara contra usar un modelo mejor, un verificador o herramientas deterministas.

## Implementación del repositorio
`src/pattern_42_self_consistency.ts` lanza N ejecuciones en paralelo, extrae `RESPUESTA FINAL` y normaliza usando minúsculas + truncado a 100 caracteres. El campo `confianza` es simplemente la fracción de votos de la cadena ganadora.

Esto introduce dos límites importantes:
- respuestas semánticamente equivalentes pero redactadas de forma distinta pueden dividir votos;
- el porcentaje de acuerdo **no es una probabilidad calibrada de verdad**.

El claim `+18–35%` debe conservarse únicamente con el contexto experimental de la literatura original, no como garantía general.

## Mejoras para producción
Usa output estructurado para respuestas discretas, canonicalización robusta, clustering semántico cuando proceda y un conjunto de evaluación para determinar N óptimo por coste/calidad.

## Relaciones
**Ensemble (43)** combina modelos o sistemas distintos; Self-Consistency suele muestrear el mismo modelo. **Tree of Thought (36)** explora ramas dentro de una búsqueda; Self-Consistency agrega trayectorias completas.