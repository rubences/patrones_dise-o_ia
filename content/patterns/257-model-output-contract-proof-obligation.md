---
patternId: 257
slug: model-output-contract-proof-obligation
title: "Model Output Contract Proof Obligation"
summary: "Contrato experimental de verificación y aseguramiento en tiempo de ejecución para model output contract proof obligation, con invariantes y pruebas negativas."
family: formal-runtime-assurance
legacyGroup: 44
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: false
evidenceStatus: needs-review
sourceFile: src/pattern_257_model_output_contract_proof_obligation.ts
tags: [formal-methods, runtime-assurance, safety]
related: [72, 98, 183]
combinesWith: [77, 124]
antiPatterns:
  - Presentar un monitor determinista como prueba formal de un sistema completo.
references: []
---

## Propósito

Model Output Contract Proof Obligation delimita un contrato verificable de seguridad o corrección de acciones agénticas.

## Implementación

Contrato experimental en `src/pattern_257_model_output_contract_proof_obligation.ts`. No ejecuta verificación de modelos general ni constituye una demostración formal certificada.

## Modelo de amenazas y límites

Revisar estados no modelados, transiciones concurrentes, bypass del monitor, efectos laterales, errores de especificación y suposiciones sobre la validez de pruebas aportadas por terceros.

## Evidencia y evaluación

`needs-review`: exigir pruebas negativas, contraejemplos reproducibles y bibliografía primaria verificada antes de cualquier afirmación de corrección.
