---
patternId: 181
slug: causal-confounder-check
title: "Causal Confounder Check"
summary: "Contrato experimental para causal confounder check con restricciones explícitas y evaluación reproducible."
family: causal-neurosymbolic-ai
legacyGroup: 34
level: architecture
difficulty: advanced
maturity: experimental
llmRequired: false
stateful: true
evidenceStatus: needs-review
sourceFile: src/pattern_181_causal_confounder_check.ts
tags: [causal, neuro-symbolic, planning]
related: [36, 37, 109]
combinesWith: [52, 77, 98]
antiPatterns:
  - Confundir correlación con causalidad identificada.
references: []
---

## Propósito

Causal Confounder Check delimita una estrategia de razonamiento causal o neuro-simbólico.

## Problema y fuerzas

Las relaciones observadas no demuestran efectos de intervención; restricciones y supuestos deben ser explícitos.

## Solución

Separar supuestos, datos, modelo, decisión y evidencia con trazabilidad.

## Implementación del repositorio

Señala padres comunes potencialmente confusores; heurística insuficiente para identificación causal. Referencia determinista: `src/pattern_181_causal_confounder_check.ts`. Pruebas positivas y negativas: `tests/p9_causal_patterns.test.ts`. **No se afirma identificación causal, corrección formal ni rendimiento en benchmarks.**


## Producción

Requiere validación de supuestos, identificación causal, datasets y pruebas especializadas.

## Evidencia y alcance

`needs-review`: sin resultados propios.

## Relaciones

Patrones 36, 37, 52, 77 y 109.
