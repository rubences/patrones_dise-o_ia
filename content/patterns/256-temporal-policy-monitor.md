---
patternId: 256
slug: temporal-policy-monitor
title: "Temporal Policy Monitor"
summary: "Contrato experimental de aseguramiento formal para temporal policy monitor con invariantes, límites y pruebas negativas."
family: formal-runtime-assurance
legacyGroup: 44
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_256_temporal_policy_monitor.ts
tags: [formal-methods, runtime-assurance, safety]
related: [98, 124, 183]
combinesWith: [77, 149]
antiPatterns:
  - Confundir un predicado local con prueba formal del sistema completo.
references: []
---

## Problema y solución

Temporal Policy Monitor define una obligación o monitor de seguridad acotado. Código: `src/pattern_256_temporal_policy_monitor.ts`.

## Pruebas y límites

`tests/p11_formal_patterns.test.ts`. No demuestra corrección de sistemas concurrentes, verificación exhaustiva ni certificación.

## Evidencia

Estado `needs-review`. Requiere especificaciones formales y contraejemplos reproducibles.
