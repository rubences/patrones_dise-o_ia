---
patternId: 361
slug: autonomy-boundary-enforcement
title: "Autonomy Boundary Enforcement"
summary: "Contrato experimental para Autonomy Boundary Enforcement, con decisión determinista y límites explícitos."
family: bounded-agentic-autonomy
legacyGroup: 55
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_361_autonomy_boundary_enforcement.ts
tags: [autonomy, assurance, runtime-safety]
related: [72, 77, 341]
combinesWith: [350, 360]
antiPatterns:
  - Tratar validaciones declarativas como pruebas completas de seguridad.
references: []
---

## Problema

Autonomy Boundary Enforcement delimita una condición crítica de seguridad y control en sistemas agénticos autónomos.

## Solución de referencia

`Pattern361Contract` ofrece una operación determinista `check` para comprobar el contrato. No concede permisos, ejecuta cambios ni garantiza seguridad por sí sola.

## Evidencia y límites

`needs-review`: pendiente de evidencias primarias, pruebas de integración y evaluación en escenarios reales.
