---
patternId: 362
slug: agent-self-modification-approval-gate
title: "Agent Self-Modification Approval Gate"
summary: "Contrato experimental para Agent Self-Modification Approval Gate, con decisión determinista y límites explícitos."
family: bounded-agentic-autonomy
legacyGroup: 55
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_362_agent_self_modification_approval_gate.ts
tags: [autonomy, assurance, runtime-safety]
related: [72, 77, 341]
combinesWith: [350, 360]
antiPatterns:
  - Tratar validaciones declarativas como pruebas completas de seguridad.
references: []
---

## Problema

Agent Self-Modification Approval Gate delimita una condición crítica de seguridad y control en sistemas agénticos autónomos.

## Solución de referencia

`Pattern362Contract` ofrece una operación determinista `approve` para comprobar el contrato. No concede permisos, ejecuta cambios ni garantiza seguridad por sí sola.

## Evidencia y límites

`needs-review`: pendiente de evidencias primarias, pruebas de integración y evaluación en escenarios reales.
