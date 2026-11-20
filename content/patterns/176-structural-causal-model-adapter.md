---
patternId: 176
slug: structural-causal-model-adapter
title: "Structural Causal Model Adapter"
summary: "Contrato experimental para structural causal model adapter con restricciones explícitas y evaluación reproducible."
family: causal-neurosymbolic-ai
legacyGroup: 34
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_176_structural_causal_model_adapter.ts
tags: [causal, neuro-symbolic, planning]
related: [36, 37, 109]
combinesWith: [52, 77, 98]
antiPatterns:
  - Confundir correlación con causalidad identificada.
references: []
---

## Propósito

Structural Causal Model Adapter delimita una estrategia de razonamiento causal o neuro-simbólico.

## Problema y fuerzas

Las relaciones observadas no demuestran efectos de intervención; restricciones y supuestos deben ser explícitos.

## Solución

Separar supuestos, datos, modelo, decisión y evidencia con trazabilidad.

## Implementación del repositorio

Evalúa ecuaciones estructurales acíclicas con intervenciones explícitas; requiere funciones y supuestos aportados externamente. Referencia determinista: `src/pattern_176_structural_causal_model_adapter.ts`. Pruebas positivas y negativas: `tests/p9_causal_patterns.test.ts`. **No se afirma identificación causal, corrección formal ni rendimiento en benchmarks.**


## Producción

Requiere validación de supuestos, identificación causal, datasets y pruebas especializadas.

## Evidencia y alcance

`needs-review`: sin resultados propios.

## Relaciones

Patrones 36, 37, 52, 77 y 109.
