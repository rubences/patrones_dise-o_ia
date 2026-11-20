---
patternId: 260
slug: bounded-agent-state-explorer
title: "Bounded Agent State Explorer"
summary: "Contrato experimental de aseguramiento formal para bounded agent state explorer con invariantes, límites y pruebas negativas."
family: formal-runtime-assurance
legacyGroup: 44
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_260_bounded_agent_state_explorer.ts
tags: [formal-methods, runtime-assurance, safety]
related: [98, 124, 183]
combinesWith: [77, 149]
antiPatterns:
  - Confundir un predicado local con prueba formal del sistema completo.
references: []
---

## Problema y solución

Bounded Agent State Explorer define una obligación o monitor de seguridad acotado. Código: `src/pattern_260_bounded_agent_state_explorer.ts`.

## Pruebas y límites

`tests/p11_formal_patterns.test.ts`. No demuestra corrección de sistemas concurrentes, verificación exhaustiva ni certificación.

## Evidencia

Estado `needs-review`. Requiere especificaciones formales y contraejemplos reproducibles.
