---
patternId: 12
slug: decorator
title: Decorator
summary: Añade capacidades transversales a un agente o servicio envolviendo su contrato sin modificar su implementación central.
family: foundations
legacyGroup: 3
level: component
difficulty: beginner
maturity: foundational
llmRequired: true
stateful: false
evidenceStatus: partially-verified
sourceFile: src/pattern_12_decorator.ts
tags: [gof, structural, decorator, cross-cutting]
related: [21, 16, 45]
combinesWith: [47, 48, 53, 77]
antiPatterns:
  - Crear pilas de decorators cuyo orden sea implícito o difícil de razonar.
  - Usar wrappers para esconder efectos secundarios críticos.
references:
  - Gamma et al. (1994), Design Patterns.
---
# Propósito
Decorator compone capacidades alrededor de un objeto manteniendo su interfaz. En IA encaja con retries, cache, logging, guardrails, tracing o medición de coste.

## Problema
Añadir lógica transversal directamente a cada agente genera duplicación y mezcla responsabilidades.

## Solución
Cada decorator recibe un componente compatible, ejecuta comportamiento antes/después y delega la operación principal.

```text
Tracing(Cache(Guardrail(Agent)))
```

## Aplicabilidad
Útil cuando capacidades deben combinarse dinámicamente. Para comportamiento global uniforme puede ser mejor middleware o interceptores del framework.

## Orden y riesgo
El orden es parte de la semántica: cachear antes de autorizar no equivale a autorizar antes de cachear. Documenta la composición y prueba combinaciones adversariales.

## Implementación del repositorio
`src/pattern_12_decorator.ts` demuestra apilamiento de capacidades. En producción deben definirse contratos de errores, idempotencia y orden.

## Relaciones
**Proxy (21)** controla acceso a un objeto; **Facade (16)** simplifica; Circuit Breaker y Retry son capacidades naturales para decorators.