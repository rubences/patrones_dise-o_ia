---
patternId: 365
slug: end-to-end-agentic-assurance-case
title: "End-to-End Agentic Assurance Case"
summary: "Contrato experimental para End-to-End Agentic Assurance Case, con decisión determinista y límites explícitos."
family: bounded-agentic-autonomy
legacyGroup: 55
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_365_end_to_end_agentic_assurance_case.ts
tags: [autonomy, assurance, runtime-safety]
related: [72, 77, 341]
combinesWith: [350, 360]
antiPatterns:
  - Tratar validaciones declarativas como pruebas completas de seguridad.
references: []
---

## Problema

End-to-End Agentic Assurance Case delimita una condición crítica de seguridad y control en sistemas agénticos autónomos.

## Solución de referencia

`Pattern365Contract` ofrece una operación determinista `assess` para comprobar el contrato. No concede permisos, ejecuta cambios ni garantiza seguridad por sí sola.

## Evidencia y límites

`needs-review`: pendiente de evidencias primarias, pruebas de integración y evaluación en escenarios reales.
