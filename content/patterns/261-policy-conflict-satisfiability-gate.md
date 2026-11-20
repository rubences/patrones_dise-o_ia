---
patternId: 261
slug: policy-conflict-satisfiability-gate
title: "Policy Conflict Satisfiability Gate"
summary: "Contrato experimental de aseguramiento formal para policy conflict satisfiability gate con invariantes, límites y pruebas negativas."
family: formal-runtime-assurance
legacyGroup: 44
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_261_policy_conflict_satisfiability_gate.ts
tags: [formal-methods, runtime-assurance, safety]
related: [98, 124, 183]
combinesWith: [77, 149]
antiPatterns:
  - Confundir un predicado local con prueba formal del sistema completo.
references: []
---

## Problema y solución

Policy Conflict Satisfiability Gate define una obligación o monitor de seguridad acotado. Código: `src/pattern_261_policy_conflict_satisfiability_gate.ts`.

## Pruebas y límites

`tests/p11_formal_patterns.test.ts`. No demuestra corrección de sistemas concurrentes, verificación exhaustiva ni certificación.

## Evidencia

Estado `needs-review`. Requiere especificaciones formales y contraejemplos reproducibles.
