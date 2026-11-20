---
patternId: 262
slug: proof-carrying-agent-action
title: "Proof-Carrying Agent Action"
summary: "Contrato experimental de aseguramiento formal para proof-carrying agent action con invariantes, límites y pruebas negativas."
family: formal-runtime-assurance
legacyGroup: 44
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_262_proof_carrying_agent_action.ts
tags: [formal-methods, runtime-assurance, safety]
related: [98, 124, 183]
combinesWith: [77, 149]
antiPatterns:
  - Confundir un predicado local con prueba formal del sistema completo.
references: []
---

## Problema y solución

Proof-Carrying Agent Action define una obligación o monitor de seguridad acotado. Código: `src/pattern_262_proof_carrying_agent_action.ts`.

## Pruebas y límites

`tests/p11_formal_patterns.test.ts`. No demuestra corrección de sistemas concurrentes, verificación exhaustiva ni certificación.

## Evidencia

Estado `needs-review`. Requiere especificaciones formales y contraejemplos reproducibles.
