---
patternId: 226
slug: semantic-latency-decomposer
title: "Semantic Latency Decomposer"
summary: "Contrato experimental de observabilidad y diagnóstico de agentes para semantic latency decomposer, con métricas y pruebas negativas."
family: ai-behavioral-observability
legacyGroup: 40
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_226_semantic_latency_decomposer.ts
tags: [observability, diagnostics, agents]
related: [98, 149, 183]
combinesWith: [77, 124]
antiPatterns:
  - Confundir trazabilidad o correlación con atribución causal demostrada.
references: []
---

## Problema y solución

Semantic Latency Decomposer aborda un contrato diferenciado de observabilidad del comportamiento de agentes. Implementación: `src/pattern_226_semantic_latency_decomposer.ts`.

## Evaluación y límites

Pruebas: `tests/p11_observability_patterns.test.ts`. Revisar datos sensibles en trazas, errores de clasificación y falsos positivos. La instrumentación no demuestra causalidad.

## Evidencia

Estado `needs-review`. Requiere fuentes primarias y evaluación independiente antes de atribuir garantías de producción.
