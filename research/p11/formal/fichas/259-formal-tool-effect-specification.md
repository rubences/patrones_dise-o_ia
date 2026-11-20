---
patternId: 259
slug: formal-tool-effect-specification
title: "Formal Tool Effect Specification"
summary: "Contrato experimental de verificación y aseguramiento en tiempo de ejecución para formal tool effect specification, con invariantes y pruebas negativas."
family: formal-runtime-assurance
legacyGroup: 44
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: research/p11/formal/src/pattern_259_formal_tool_effect_specification.ts
tags: [formal-methods, runtime-assurance, safety]
related: [72, 98, 183]
combinesWith: [77, 124]
antiPatterns:
  - Presentar un monitor determinista como prueba formal de un sistema completo.
references: []
---

## Propósito

Formal Tool Effect Specification delimita un contrato verificable de seguridad o corrección de acciones agénticas.

## Implementación

Contrato experimental en `src/pattern_259_formal_tool_effect_specification.ts`. No ejecuta verificación de modelos general ni constituye una demostración formal certificada.

## Modelo de amenazas y límites

Revisar estados no modelados, transiciones concurrentes, bypass del monitor, efectos laterales, errores de especificación y suposiciones sobre la validez de pruebas aportadas por terceros.

## Evidencia y evaluación

`needs-review`: exigir pruebas negativas, contraejemplos reproducibles y bibliografía primaria verificada antes de cualquier afirmación de corrección.
