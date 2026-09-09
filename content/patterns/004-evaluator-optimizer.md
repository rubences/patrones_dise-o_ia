---
patternId: 4
slug: evaluator-optimizer
title: Evaluator-Optimizer
summary: Itera entre un generador y un evaluador guiado por rúbrica hasta alcanzar un criterio de aceptación o agotar un presupuesto de rondas.
family: evaluation-qa
legacyGroup: 1
level: workflow
difficulty: intermediate
maturity: established
llmRequired: true
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_4_evaluator_optimizer.ts
tags:
  - evaluation
  - optimization
  - rubric
  - iterative-refinement
related:
  - 3
  - 73
  - 76
combinesWith:
  - 1
  - 73
  - 75
  - 77
antiPatterns:
  - Iterar sin límite de rondas o presupuesto.
  - Utilizar una rúbrica ambigua que no produzca acciones concretas.
  - Aceptar una puntuación del evaluador sin comprobar su calibración.
references: []
---

# Propósito

**Evaluator-Optimizer** separa dos responsabilidades: producir una solución y juzgarla contra criterios explícitos. El optimizador corrige únicamente los problemas detectados y repite el ciclo hasta alcanzar un umbral o un límite de ejecución.

## El problema

La generación en una sola pasada puede incumplir restricciones de calidad, tono, formato o contenido. Pedir simplemente “hazlo mejor” no ofrece una condición de parada ni permite saber qué defecto se está corrigiendo.

## La solución

Introduce un bucle controlado por rúbrica:

```text
Borrador
   |
   v
Evaluador -> aprobado? ---- sí ----> Resultado
   | no
   v
Problemas concretos
   |
   v
Optimizador
   |
   +-----------------------> Evaluador
```

El criterio de parada debe combinar calidad y presupuesto: nota mínima, flag de aprobación, número máximo de rondas, coste o tiempo.

## Implementación del repositorio

`src/pattern_4_evaluator_optimizer.ts` usa Structured Outputs con Zod para que el crítico devuelva `nota`, `aprobado` y una lista de `problemas`. El optimizador recibe únicamente los problemas y reescribe el texto. El flujo termina cuando se alcanza `notaMinima` y `aprobado`, o al llegar a `maxRondas`.

## Aplicabilidad

Úsalo cuando exista una rúbrica suficientemente concreta: redacción editorial, generación de documentación, cumplimiento de formato, transformación de contenido o producción de artefactos que admiten revisión iterativa.

## Cuándo no utilizarlo

No es un sustituto de pruebas deterministas. Si la propiedad puede validarse con un compilador, esquema, test, constraint o regla formal, ese validador debería tener prioridad sobre un juicio probabilístico.

## Failure modes

- **Oscilación:** el optimizador corrige un criterio y degrada otro.
- **Judge bias:** evaluador y generador comparten sesgos o errores.
- **Goodhart:** el sistema aprende a maximizar la nota sin mejorar la utilidad real.
- **Cost runaway:** demasiadas rondas consumen presupuesto sin mejora marginal.

## Seguridad

Para restricciones de seguridad, usa el evaluador como capa adicional y no como única barrera. Las prohibiciones críticas deben materializarse también mediante controles deterministas, autorización y validación de acciones.

## Observabilidad

Registra por ronda: versión del texto, crítica, nota, problemas, latencia, tokens y motivo de parada. Esto permite construir curvas de mejora marginal y determinar el número óptimo de iteraciones.

## Coste y latencia

Cada ronda suele implicar al menos una evaluación y, si falla, una nueva generación. Define `maxRondas` y corta cuando la mejora esperada no justifique otra iteración.

## Evaluación

Además de la nota del crítico, compara resultados contra revisión humana o métricas externas. Analiza estabilidad de la rúbrica, acuerdo entre evaluadores y ganancia entre rondas.

## Patrones relacionados

- **Reflection (3):** auto-revisión más abierta y menos contractual.
- **LLM-as-Judge (73):** formaliza el componente evaluador.
- **Regression Testing (76):** comprueba que cambios futuros no degraden casos conocidos.
- **Pipeline (1):** puede incorporar el bucle como una etapa concreta.

## Estado editorial

El código representa de forma clara el bucle y la condición de parada. La fiabilidad de la puntuación depende de la rúbrica, el modelo y la validación externa, por lo que las afirmaciones cuantitativas permanecen pendientes de evidencia.
