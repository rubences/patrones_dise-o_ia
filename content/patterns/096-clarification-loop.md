---
patternId: 96
slug: clarification-loop
title: Clarification Loop
summary: Detecta ambigüedad material antes de actuar y formula preguntas específicas hasta resolverla o devolver explícitamente un estado unresolved.
family: human-experience
legacyGroup: 22
level: workflow
difficulty: intermediate
maturity: foundational
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_96_clarification_loop.ts
tags: [clarification, ambiguity, intent, ux]
related: [6, 8, 95]
combinesWith: [72, 101]
antiPatterns:
  - Preguntar cuando la tarea ya está suficientemente definida.
  - Agotar rondas y proceder como si la ambigüedad hubiera desaparecido.
  - Reemplazar la intención original por una respuesta de aclaración aislada.
references: []
---
# Propósito
Clarification Loop evita decisiones irreversibles basadas en una interpretación arbitraria cuando existen varias intenciones plausibles.

## Implementación del repositorio
Tras el hardening P1, el resultado distingue `resolved` de `unresolved`. Si se alcanza `maxRondas` y el detector sigue declarando ambigüedad, **no existe `interpretacionFinal`** y el caller recibe el motivo pendiente.

El contexto de detección conserva siempre la intención original y acumula aclaraciones numeradas, en lugar de sustituir el input completo por la última respuesta del usuario.

## Producción
Para dominios estructurados, representa slots/constraints como datos tipados y no como concatenación textual. Un resultado `unresolved` debe desembocar en abstención, handoff o petición de más información; nunca en una acción sensible por defecto.

## Relaciones
**Planning (6)** actúa cuando la intención ya es clara; **Human Escalation (95)** toma ownership cuando el loop no puede resolverla.