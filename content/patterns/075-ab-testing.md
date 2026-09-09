---
patternId: 75
slug: ab-testing
title: A/B Testing
summary: Compara variantes bajo asignación controlada y métricas predefinidas para estimar impacto real, distinguiendo una diferencia observada de una diferencia estadísticamente sustentada.
family: evaluation-qa
legacyGroup: 17
level: workflow
difficulty: intermediate
maturity: foundational
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_75_ab_testing.ts
tags: [ab-testing, experimentation, prompts, metrics]
related: [73, 90, 91]
combinesWith: [77, 92, 76]
antiPatterns:
  - Declarar significancia a partir de una diferencia de puntos sin análisis estadístico.
  - Cambiar asignación de variante para el mismo usuario durante un experimento sin intención explícita.
  - Optimizar una sola métrica ignorando coste, seguridad o experiencia de usuario.
references: []
---
# Propósito
A/B Testing compara variantes en condiciones controladas y permite decidir con evidencia si un cambio mejora una métrica objetivo.

## Implementación del repositorio
`src/pattern_75_ab_testing.ts` selecciona variantes uniformemente con `Math.random()` cuando no se fuerza un ID. La demo ejecuta cada variante con las mismas preguntas, estima tokens como palabras×1,3 y evalúa calidad con un juez LLM.

En `analizarResultados()` solo se evalúan con calidad las respuestas cuyas entradas estén en `entradasEvaluacion`; la demo pasa únicamente la primera pregunta. Después se llama `margen >= 10` a un **margen significativo**, pero no existe test estadístico, intervalo de confianza ni cálculo de potencia.

## Producción
Define hipótesis y métrica primaria antes del experimento, usa asignación sticky por unidad experimental, calcula tamaño de muestra y analiza incertidumbre. Controla guardrails de seguridad/coste y evita peeking oportunista.

Para prompts generativos, conserva modelo, temperatura, versión de prompt y cohortes, y diferencia efectos de calidad de cambios en latencia o tokens.

## Relaciones
**Canary Release (90)** reduce riesgo de despliegue pero no sustituye un experimento; **Meta-Prompting (91)** genera candidatos; A/B Testing mide impacto en tráfico o dataset.