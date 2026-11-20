---
patternId: 225
slug: tool-call-drift-detector
title: "Tool-Call Drift Detector"
summary: "Contrato experimental de observabilidad y diagnóstico de agentes para tool-call drift detector, con métricas y pruebas negativas."
family: ai-behavioral-observability
legacyGroup: 40
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_225_tool_call_drift_detector.ts
tags: [observability, diagnostics, agents]
related: [98, 149, 183]
combinesWith: [77, 124]
antiPatterns:
  - Confundir trazabilidad o correlación con atribución causal demostrada.
references: []
---

## Problema y solución

Tool-Call Drift Detector aborda un contrato diferenciado de observabilidad del comportamiento de agentes. Implementación: `src/pattern_225_tool_call_drift_detector.ts`.

## Evaluación y límites

Pruebas: `tests/p11_observability_patterns.test.ts`. Revisar datos sensibles en trazas, errores de clasificación y falsos positivos. La instrumentación no demuestra causalidad.

## Evidencia

Estado `needs-review`. Requiere fuentes primarias y evaluación independiente antes de atribuir garantías de producción.
