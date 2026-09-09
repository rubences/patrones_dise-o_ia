---
patternId: 45
slug: circuit-breaker
title: Circuit Breaker
summary: Interrumpe temporalmente llamadas a una dependencia que falla repetidamente para evitar saturación, reducir latencia inútil y permitir recuperación controlada.
family: reliability
legacyGroup: 9
level: component
difficulty: intermediate
maturity: foundational
llmRequired: false
stateful: true
evidenceStatus: partially-verified
sourceFile: src/pattern_45_circuit_breaker.ts
tags: [resilience, circuit-breaker, failure, dependency]
related: [46, 47, 81]
combinesWith: [77, 94, 48]
antiPatterns:
  - Usar un fallback del tipo equivocado mediante casting inseguro.
  - Contar todos los errores como fallos de dependencia.
  - Compartir un circuito entre operaciones con perfiles de fallo distintos.
references: []
---
# Propósito
Circuit Breaker modela una máquina `closed -> open -> half-open` alrededor de una dependencia remota.

## Implementación del repositorio
`src/pattern_45_circuit_breaker.ts` abre tras un umbral de fallos, espera un timeout y permite una prueba en semi-abierto. El fallback es un `string` convertido genéricamente a `T`, una simplificación que en producción puede romper el contrato de tipos.

## Producción
Clasifica errores, usa ventanas temporales y métricas adecuadas, limita probes en half-open y define fallbacks compatibles con el contrato. Expón estado y transiciones como métricas/trazas.

## Relaciones
**Retry (47)** intenta superar fallos transitorios; Circuit Breaker deja de intentarlo cuando el servicio parece degradado. **Model Fallback (81)** puede aportar la alternativa.