---
patternId: 178
slug: counterfactual-evaluation
title: "Counterfactual Evaluation"
summary: "Contrato experimental para counterfactual evaluation con restricciones explícitas y evaluación reproducible."
family: causal-neurosymbolic-ai
legacyGroup: 34
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_178_counterfactual_evaluation.ts
tags: [causal, neuro-symbolic, planning]
related: [36, 37, 109]
combinesWith: [52, 77, 98]
antiPatterns:
  - Confundir correlación con causalidad identificada.
references: []
---

## Propósito

Counterfactual Evaluation delimita una estrategia de razonamiento causal o neuro-simbólico.

## Problema y fuerzas

Las relaciones observadas no demuestran efectos de intervención; restricciones y supuestos deben ser explícitos.

## Solución

Separar supuestos, datos, modelo, decisión y evidencia con trazabilidad.

## Implementación del repositorio

Compara resultados factual y contrafactual según un modelo suministrado; no identifica efectos causales. Referencia determinista: `src/pattern_178_counterfactual_evaluation.ts`. Pruebas positivas y negativas: `tests/p9_causal_patterns.test.ts`. **No se afirma identificación causal, corrección formal ni rendimiento en benchmarks.**


## Producción

Requiere validación de supuestos, identificación causal, datasets y pruebas especializadas.

## Evidencia y alcance

`needs-review`: sin resultados propios.

## Relaciones

Patrones 36, 37, 52, 77 y 109.
