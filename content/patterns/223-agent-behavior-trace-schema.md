---
patternId: 223
slug: agent-behavior-trace-schema
title: "Agent Behavior Trace Schema"
summary: "Contrato experimental de observabilidad y diagnóstico de agentes para agent behavior trace schema, con métricas y pruebas negativas."
family: ai-behavioral-observability
legacyGroup: 40
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_223_agent_behavior_trace_schema.ts
tags: [observability, diagnostics, agents]
related: [98, 149, 183]
combinesWith: [77, 124]
antiPatterns:
  - Confundir trazabilidad o correlación con atribución causal demostrada.
references: []
---

## Problema y solución

Agent Behavior Trace Schema aborda un contrato diferenciado de observabilidad del comportamiento de agentes. Implementación: `src/pattern_223_agent_behavior_trace_schema.ts`.

## Evaluación y límites

Pruebas: `tests/p11_observability_patterns.test.ts`. Revisar datos sensibles en trazas, errores de clasificación y falsos positivos. La instrumentación no demuestra causalidad.

## Evidencia

Estado `needs-review`. Requiere fuentes primarias y evaluación independiente antes de atribuir garantías de producción.
