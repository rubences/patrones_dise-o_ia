---
patternId: 255
slug: agent-transition-invariant-checker
title: "Agent Transition Invariant Checker"
summary: "Contrato experimental de verificación y aseguramiento en tiempo de ejecución para agent transition invariant checker, con invariantes y pruebas negativas."
family: formal-runtime-assurance
legacyGroup: 44
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: research/p11/formal/src/pattern_255_agent_transition_invariant_checker.ts
tags: [formal-methods, runtime-assurance, safety]
related: [72, 98, 183]
combinesWith: [77, 124]
antiPatterns:
  - Presentar un monitor determinista como prueba formal de un sistema completo.
references: []
---

## Propósito

Agent Transition Invariant Checker delimita un contrato verificable de seguridad o corrección de acciones agénticas.

## Implementación

Contrato experimental en `src/pattern_255_agent_transition_invariant_checker.ts`. No ejecuta verificación de modelos general ni constituye una demostración formal certificada.

## Modelo de amenazas y límites

Revisar estados no modelados, transiciones concurrentes, bypass del monitor, efectos laterales, errores de especificación y suposiciones sobre la validez de pruebas aportadas por terceros.

## Evidencia y evaluación

`needs-review`: exigir pruebas negativas, contraejemplos reproducibles y bibliografía primaria verificada antes de cualquier afirmación de corrección.
