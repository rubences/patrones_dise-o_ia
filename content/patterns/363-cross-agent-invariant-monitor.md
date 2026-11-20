---
patternId: 363
slug: cross-agent-invariant-monitor
title: "Cross-Agent Invariant Monitor"
summary: "Contrato experimental para Cross-Agent Invariant Monitor, con decisión determinista y límites explícitos."
family: bounded-agentic-autonomy
legacyGroup: 55
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_363_cross_agent_invariant_monitor.ts
tags: [autonomy, assurance, runtime-safety]
related: [72, 77, 341]
combinesWith: [350, 360]
antiPatterns:
  - Tratar validaciones declarativas como pruebas completas de seguridad.
references: []
---

## Problema

Cross-Agent Invariant Monitor delimita una condición crítica de seguridad y control en sistemas agénticos autónomos.

## Solución de referencia

`Pattern363Contract` ofrece una operación determinista `inspect` para comprobar el contrato. No concede permisos, ejecuta cambios ni garantiza seguridad por sí sola.

## Evidencia y límites

`needs-review`: pendiente de evidencias primarias, pruebas de integración y evaluación en escenarios reales.
