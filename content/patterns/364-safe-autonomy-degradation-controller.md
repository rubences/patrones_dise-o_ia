---
patternId: 364
slug: safe-autonomy-degradation-controller
title: "Safe Autonomy Degradation Controller"
summary: "Contrato experimental para Safe Autonomy Degradation Controller, con decisión determinista y límites explícitos."
family: bounded-agentic-autonomy
legacyGroup: 55
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_364_safe_autonomy_degradation_controller.ts
tags: [autonomy, assurance, runtime-safety]
related: [72, 77, 341]
combinesWith: [350, 360]
antiPatterns:
  - Tratar validaciones declarativas como pruebas completas de seguridad.
references: []
---

## Problema

Safe Autonomy Degradation Controller delimita una condición crítica de seguridad y control en sistemas agénticos autónomos.

## Solución de referencia

`Pattern364Contract` ofrece una operación determinista `mode` para comprobar el contrato. No concede permisos, ejecuta cambios ni garantiza seguridad por sí sola.

## Evidencia y límites

`needs-review`: pendiente de evidencias primarias, pruebas de integración y evaluación en escenarios reales.
