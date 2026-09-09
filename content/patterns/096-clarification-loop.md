---
patternId: 96
slug: clarification-loop
title: Clarification Loop
summary: Detecta ambigüedad material antes de actuar y formula preguntas específicas hasta resolverla o declarar explícitamente que la intención sigue sin estar suficientemente definida.
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
  - Preguntar por defecto cuando la tarea ya está suficientemente definida.
  - Agotar el máximo de rondas y proceder como si la ambigüedad hubiera desaparecido.
  - Reemplazar todo el contexto original por una respuesta de aclaración aislada.
references: []
---
# Propósito
Clarification Loop evita decisiones irreversibles basadas en una interpretación arbitraria cuando existen varias intenciones plausibles.

## Implementación del repositorio
`src/pattern_96_clarification_loop.ts` inyecta una función de detección de ambigüedad y permite hasta `maxRondas`. La demo usa un detector determinista para el caso de cancelar un pedido cuando existen varios activos.

Si se alcanzan todas las rondas, el método devuelve `interpretacionFinal = inputActual` **sin comprobar de nuevo que ya no sea ambiguo** ni devolver un estado `unresolved`. Un consumidor podría continuar y ejecutar una interpretación todavía insegura.

Además, cada respuesta de aclaración sustituye completamente `inputActual`; la semántica del pedido original debe preservarse en un estado estructurado para no depender de que la respuesta aislada sea autosuficiente.

## Producción
Devuelve estados `resolved/unresolved`, conserva intención original + slots aclarados y exige abstención o escalada al agotar rondas para acciones sensibles. Mide tasa de aclaración útil y fricción añadida.

## Relaciones
**Planning (6)** actúa cuando la intención ya es clara; **Human Escalation (95)** es el fallback cuando la ambigüedad no puede resolverse.