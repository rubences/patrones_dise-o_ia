---
patternId: 3
slug: reflection
title: Reflection
summary: Hace que una primera respuesta sea revisada críticamente y después refinada, separando generación, crítica y mejora en un ciclo explícito.
family: agentic-workflows
legacyGroup: 1
level: workflow
difficulty: intermediate
maturity: established
llmRequired: true
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_3_reflection.ts
tags:
  - reflection
  - critique
  - refinement
  - self-review
related:
  - 4
  - 42
  - 54
  - 73
combinesWith:
  - 4
  - 73
  - 76
  - 77
antiPatterns:
  - Pedir una auto-crítica sin criterios concretos.
  - Asumir que el mismo modelo detectará de forma fiable todos sus propios errores.
  - Añadir rondas de reflexión sin límite ni criterio de parada.
references: []
---

# Propósito

**Reflection** introduce una fase explícita de auto-revisión entre la primera respuesta y la versión final. El sistema genera, critica y reescribe en lugar de aceptar automáticamente el primer resultado.

## El problema

Una respuesta inicial puede ser incompleta, poco clara o contener errores que podrían detectarse con una segunda lectura. Sin embargo, una instrucción genérica como “mejora esto” ofrece poco control sobre qué debe revisarse y hace difícil evaluar si la iteración aporta valor.

## La solución

Separar los roles lógicos:

```text
Pregunta -> Respuesta v1 -> Crítica -> Respuesta v2
                              |
                              +-- claridad
                              +-- corrección
                              +-- completitud
```

La crítica debe producir observaciones accionables y la fase de mejora debe recibir tanto la respuesta inicial como esas observaciones.

## Implementación del repositorio

`src/pattern_3_reflection.ts` implementa tres llamadas: respuesta inicial, reflexión crítica y mejora final. La reflexión devuelve texto generado por el modelo, mientras que las puntuaciones numéricas de claridad, corrección y completitud están actualmente fijadas de forma demostrativa en `7/8/6`.

Ese detalle es importante editorialmente: la implementación ilustra el patrón de flujo, pero **no implementa todavía un parser real ni una evaluación cuantitativa de esas tres métricas**.

## Aplicabilidad

Úsalo cuando:

- la calidad justifica una segunda pasada;
- el resultado puede revisarse contra criterios explícitos;
- quieres conservar tanto la primera versión como la crítica;
- el coste de una iteración adicional es aceptable.

## Cuándo no utilizarlo

No es adecuado como garantía de verdad ni como sustituto de validadores externos. Para resultados verificables, conviene combinarlo con tests, herramientas deterministas, fuentes externas o evaluadores independientes.

## Failure modes

- **Self-confirmation:** el modelo reafirma su primera respuesta sin detectar el error.
- **Crítica superficial:** comentarios vagos que no cambian el resultado.
- **Degradación:** una segunda versión peor que la primera.
- **Loop infinito:** iteraciones sin umbral ni presupuesto.

## Seguridad

No confíes en Reflection como control de seguridad principal. Una respuesta insegura puede ser ratificada por la misma distribución de modelo. Para decisiones críticas, añade Guardrails, Human-in-the-Loop o validadores externos.

## Observabilidad

Conserva respuesta inicial, crítica, respuesta final, número de rondas, coste y delta de calidad medido por una evaluación independiente. Esto permite comprobar si la reflexión aporta mejora real o solo más tokens.

## Coste y latencia

La variante del repositorio triplica aproximadamente el número de llamadas respecto a una respuesta simple. En producción conviene activar Reflection selectivamente según riesgo, complejidad o una primera señal de baja calidad.

## Evaluación

Compara la respuesta inicial y final sobre un conjunto etiquetado. Mide mejora real mediante métricas externas o revisión humana; no utilices únicamente la propia puntuación del modelo que está siendo evaluado.

## Patrones relacionados

- **Evaluator-Optimizer (4):** formaliza la crítica con rúbrica y criterio de aceptación.
- **Self-Consistency (42):** compara múltiples trayectorias en lugar de revisar una sola.
- **ReAct (54):** alterna razonamiento y acción sobre observaciones externas.
- **LLM-as-Judge (73):** separa explícitamente la función evaluadora.

## Estado editorial

La ficha documenta de forma expresa la simplificación de las puntuaciones presente en el código actual. Antes de elevar la madurez de evidencia, debe sustituirse ese placeholder por salida estructurada o por un evaluador reproducible.
