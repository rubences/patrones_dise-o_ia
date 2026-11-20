---
patternId: 215
slug: multi-agent-budget-allocation
title: "Multi-Agent Budget Allocation"
summary: "Contrato experimental de economía multiagente para multi-agent budget allocation, con reglas de asignación, auditoría y límites explícitos."
family: ai-economics-mechanisms
legacyGroup: 39
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_215_multi_agent_budget_allocation.ts
tags: [economics, multi-agent, allocation]
related: [7, 74, 98]
combinesWith: [77, 149]
antiPatterns:
  - Declarar compatibilidad de incentivos o equidad sin supuestos y demostración.
references: []
---

## Propósito y contexto

Multi-Agent Budget Allocation introduce un mecanismo económico explícito para coordinar recursos, incentivos o auditoría entre agentes.

## Solución e implementación

Contrato TypeScript en `src/pattern_215_multi_agent_budget_allocation.ts` y pruebas en `tests/p10_economics_patterns.test.ts`. Limitaciones en `research/P10_ECONOMICS_215_222_IMPLEMENTATION_NOTES.md`.

## Riesgos y límites

No garantiza estrategia dominante, ausencia de colusión, equidad, cumplimiento de contratación ni corrección contable integral. Las reglas son prototipos educativos.

## Evidencia y evaluación

Estado `needs-review`. Requiere escenarios adversariales, evaluación de incentivos, revisión bibliográfica y validación independiente.
