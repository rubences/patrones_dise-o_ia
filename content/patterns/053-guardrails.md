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
`src/pattern_53_guardrails.ts` combina regex de PII, una lista de topics prohibidos, palabras sensibles en output y un juicio LLM `SEGURO/INSEGURO`.

Hay un bug importante en el guardrail de salida: el código calcula `seguro = output.toUpperCase().includes("SEGURO")`. La palabra **`INSEGURO` también contiene `SEGURO`**, por lo que una respuesta explícitamente marcada como `INSEGURO` puede clasificarse como segura. En producción debe parsearse un enum exacto o structured output.

La lista `hackear`, `exploit`, `malware`, `phishing` y `bypass seguridad` también puede bloquear consultas legítimas de docencia, defensa o investigación. La policy debería evaluar intención/contexto, no solo presencia léxica.

## Producción
Separa guardrails por finalidad, usa decisiones estructuradas y default-deny únicamente donde el riesgo lo justifique. Prueba falsos positivos/negativos, versiona políticas y evita que el mismo LLM que genera contenido sea la única autoridad de seguridad.

## Relaciones
**PII Redaction (89)** transforma datos personales; **Prompt Injection Defense (69)** trata manipulación de instrucciones; **Access Control (72)** gobierna acciones y recursos.