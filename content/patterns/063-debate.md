---
patternId: 63
slug: debate
title: Debate
summary: Fuerza perspectivas contrapuestas y una evaluación posterior para descubrir argumentos omitidos, sin asumir que el consenso de modelos equivale a verdad.
family: multi-agent
legacyGroup: 14
level: workflow
difficulty: advanced
maturity: emerging
llmRequired: true
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_63_debate.ts
tags: [debate, multi-agent, critique, perspectives]
related: [4, 43, 73]
combinesWith: [52, 74, 76]
antiPatterns:
  - Presentar al juez del mismo modelo como árbitro objetivo.
  - Interpretar confianza autodeclarada como probabilidad calibrada.
  - Forzar una dicotomía favor-contra cuando existen más alternativas.
references: []
---
# Propósito
Debate introduce oposición deliberada para que una propuesta reciba contraargumentos antes de una decisión o síntesis.

## Implementación del repositorio
`src/pattern_63_debate.ts` ejecuta rondas secuenciales con un agente PRO y otro CONTRA. Ambos usan el mismo `DEFAULT_MODEL`; después un juez, también sobre el mismo cliente/modelo, produce `VEREDICTO`, `GANADOR` y `CONFIANZA` mediante texto que se parsea con regex.

La arquitectura genera diversidad de instrucciones, pero no independencia de modelo ni garantía de imparcialidad. La `confianza` es autodeclarada y el resultado `ganador` depende de parsing textual.

## Aplicabilidad
Puede ser útil para decisiones con trade-offs, diseño, revisión de riesgos o hipótesis. No debe emplearse para fabricar una falsa simetría cuando existe evidencia factual suficiente.

## Producción
Aísla información cuando quieras independencia real, utiliza jueces o métricas distintas, incorpora evidencia recuperada y conserva una opción `insuficiente evidencia`. Para decisiones críticas, el debate es una señal, no la autorización final.

## Relaciones
**Evaluator-Optimizer (4)** critica una propuesta; **Ensemble (43)** agrega perspectivas; **LLM-as-Judge (73)** formaliza evaluación y sus límites.