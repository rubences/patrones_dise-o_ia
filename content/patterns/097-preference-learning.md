---
patternId: 97
slug: preference-learning
title: Preference Learning
summary: Ajusta comportamiento a partir de señales de feedback observables sin convertir inferencias débiles en hechos sobre el usuario ni ocultar cómo influyen en futuras respuestas.
family: human-experience
legacyGroup: 22
level: workflow
difficulty: advanced
maturity: emerging
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_97_preference_learning.ts
tags: [preferences, personalization, feedback, adaptation]
related: [51, 64, 75]
combinesWith: [77, 89]
antiPatterns:
  - Interpretar ausencia de corrección como preferencia positiva inequívoca.
  - Inferir rasgos sensibles o estables a partir de señales débiles.
  - Aplicar preferencias acumuladas sin decay, revisión o control del usuario.
references: []
---
# Propósito
Preference Learning adapta estilo o comportamiento con el tiempo a partir de feedback explícito e implícito.

## Implementación del repositorio
`src/pattern_97_preference_learning.ts` mantiene pesos por rasgo entre -1 y 1 y aplica incrementos fijos según cuatro tipos de señal. Cuando el valor absoluto supera un umbral, añade instrucciones como `Prioriza ser X` o `Evita ser X` al prompt.

La demo **no infiere qué rasgo explica una edición**. El caller ya proporciona `rasgosImplicados`, por ejemplo `verboso`. Por tanto, el módulo aprende pesos una vez etiquetada la señal, pero no realiza aprendizaje automático de preferencias desde la edición en sí.

`implicito_aceptacion` se interpreta como señal positiva, aunque un usuario puede aceptar por prisa, abandono o indiferencia. No existe decay temporal, confianza por rasgo ni separación por contexto.

## Producción
Mantén preferencias explicables, reversibles y acotadas a dominios apropiados. Permite corregirlas, aplica decay y no infieras categorías sensibles. Evalúa si la personalización mejora la experiencia sin degradar precisión o seguridad.

## Relaciones
**Persona (64)** define estilo explícito; **Long-Term Memory (51)** persiste hechos/contexto; Preference Learning adapta pesos derivados de feedback.