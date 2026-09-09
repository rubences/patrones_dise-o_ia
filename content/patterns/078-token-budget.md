---
patternId: 78
slug: token-budget
title: Token Budget
summary: Impone un presupuesto de consumo por sesión o actor y decide cuándo permitir, degradar, comprimir o rechazar trabajo antes de exceder límites operativos.
family: production-finops
legacyGroup: 18
level: architecture
difficulty: intermediate
maturity: established
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_78_token_budget.ts
tags: [tokens, budget, cost, finops]
related: [49, 92, 80]
combinesWith: [39, 86, 77]
antiPatterns:
  - Comprobar solo tokens de entrada e ignorar salida esperada.
  - Usar estimaciones de palabras como contabilidad exacta.
  - Degradar calidad sin señal visible ni evaluación.
references: []
---
# Propósito
Token Budget limita consumo antes y durante una sesión y hace explícita la política al aproximarse al límite.

## Implementación del repositorio
`src/pattern_78_token_budget.ts` estima tokens por palabras×1,3. `verificar()` solo estima el prompt actual y no reserva output; después `registrar()` suma input+output, por lo que el gasto real estimado puede superar el límite tras una llamada permitida.

La configuración declara estrategia `comprimir`, pero el agente aplica directamente una respuesta de máximo 50 palabras cuando quedan menos de 500 tokens; otros modos no están implementados.

## Producción
Reserva un worst-case de output, usa usage/tokenizer real, aplica límites atómicos en entornos concurrentes y define jerarquías por usuario/tenant/feature.

## Relaciones
**Cost Attribution (92)** explica quién gastó; Token Budget impone límites en runtime.