---
patternId: 53
slug: guardrails
title: Guardrails
summary: Aplica controles antes y después del modelo para reducir exposición a entradas, salidas o acciones no conformes, combinando reglas deterministas con clasificadores cuando aportan valor.
family: safety-security
legacyGroup: 13
level: architecture
difficulty: intermediate
maturity: foundational
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_53_guardrails.ts
tags: [guardrails, safety, policy, filtering]
related: [69, 71, 72]
combinesWith: [89, 100, 101]
antiPatterns:
  - Tratar palabras clave como política de seguridad universal.
  - Usar un clasificador generativo como único control de salida.
  - Bloquear investigación legítima solo porque contiene términos de ciberseguridad.
references: []
---
# Propósito
Guardrails sitúa controles en puntos definidos del flujo para decidir qué puede entrar, qué puede salir y qué debe transformarse o bloquearse.

## Implementación del repositorio
`src/pattern_53_guardrails.ts` combina regex de PII, una lista pedagógica de topics prohibidos, palabras sensibles en output y un juicio LLM `SEGURO/INSEGURO`.

Tras el hardening P0, el veredicto de salida se interpreta mediante **igualdad exacta** y falla cerrado ante cualquier formato ambiguo. Esto corrige el defecto por el que `includes("SEGURO")` aceptaba también `INSEGURO`. La detección PII resetea además el estado de las regex globales antes y después de `.test()`, evitando falsos negativos entre llamadas consecutivas.

La lista `hackear`, `exploit`, `malware`, `phishing` y `bypass seguridad` continúa siendo intencionalmente pedagógica y puede bloquear consultas legítimas de docencia, defensa o investigación. Una policy de producción debe evaluar intención y contexto, no solo presencia léxica.

## Producción
Separa guardrails por finalidad, usa decisiones estructuradas y default-deny donde el riesgo lo justifique. Prueba falsos positivos/negativos, versiona políticas y evita que el mismo LLM que genera contenido sea la única autoridad de seguridad.

El hardening del parser elimina un fail-open concreto; **no convierte el clasificador LLM en una frontera de seguridad**. Autorización, aislamiento y validación de acciones siguen siendo controles independientes.

## Relaciones
**PII Redaction (89)** transforma datos personales; **Prompt Injection Defense (69)** trata manipulación de instrucciones; **Access Control (72)** gobierna acciones y recursos.