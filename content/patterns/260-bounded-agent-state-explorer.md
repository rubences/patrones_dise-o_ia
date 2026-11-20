---
patternId: 260
slug: bounded-agent-state-explorer
title: "Bounded Agent State Explorer"
summary: "Contrato experimental de verificación y aseguramiento en tiempo de ejecución para bounded agent state explorer, con invariantes y pruebas negativas."
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
related: [72, 98, 183]
combinesWith: [77, 124]
antiPatterns:
  - Presentar un monitor determinista como prueba formal de un sistema completo.
references: []
---

## Propósito

Bounded Agent State Explorer delimita un contrato verificable de seguridad o corrección de acciones agénticas.

## Implementación

Contrato experimental en `src/pattern_260_bounded_agent_state_explorer.ts`. No ejecuta verificación de modelos general ni constituye una demostración formal certificada.

## Modelo de amenazas y límites

Revisar estados no modelados, transiciones concurrentes, bypass del monitor, efectos laterales, errores de especificación y suposiciones sobre la validez de pruebas aportadas por terceros.

## Evidencia y evaluación

`needs-review`: exigir pruebas negativas, contraejemplos reproducibles y bibliografía primaria verificada antes de cualquier afirmación de corrección.
